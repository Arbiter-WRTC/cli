import * as ui from '../utils/ui.js';
import * as fs from 'fs';
import {
  CloudFormation,
  DescribeStacksCommandOutput,
} from '@aws-sdk/client-cloudformation';
import { StackData, stacks } from '../constants/cloudFormationData.js';
import { Templates } from './templates.js';
import { deployErrorHandler } from './errorHandler.js';
import { Listr, ListrTask } from 'listr2';

export class CloudDeploy {
  cloudFormationClient: CloudFormation | undefined;
  yamlTemplates: Templates;
  idleRooms: number;
  checkInterval: number;
  endpoints: { [key: string]: string };

  constructor(cloudformation: CloudFormation | undefined, idleRooms: number) {
    this.cloudFormationClient = cloudformation;
    this.yamlTemplates = new Templates(stacks);
    this.idleRooms = idleRooms;
    this.checkInterval = 3000;
    this.endpoints = {};
  }

  fakeSFU(): ListrTask  {
    return this.createFAKEListrTask(1500, "Deploying SFU to ECS Fargate...", "SFU ECS is deployed!");
  }

  fakeWSG(): ListrTask  {
    return this.createFAKEListrTask(1000, "Deploying Signaling Stack to Websocket Gateway...", "Websocket Gateway Signaling Stack is deployed!");
  }

  fakeCoturn(): ListrTask  {
    return this.createFAKEListrTask(2500,  "Deploying CoTURN to ECS Fargate...", "CoTURN ECS is deployed!");
  }

  fakeHTTP(): ListrTask  {
    return this.createFAKEListrTask(1000,  "Deploying HTTP API Gateway...", "HTTP API Gateway is deployed!");
  }

  fakeEndpoints(): ListrTask  {
    return this.createFAKEListrTask(1500,  'getting resource endpoints', "All endpoints fetched!");
  }

  createFAKEListrTask(time: number, deployMessage: string, completeMessage: string): ListrTask {
    return {
      title: deployMessage,
      task: async (_, task) => {
        await new Promise((res, rej) => setTimeout(() => {res(1)}, time))
        task.title = ui.secondary(completeMessage);
      },
    };
  }

  async deployAll() {
    const concurrentTasks = new Listr(
      [this.fakeSFU(), this.fakeCoturn(), this.fakeWSG()],
      { concurrent: true, exitOnError: true }
    );
    const httpGatewayTask = new Listr(
      [this.fakeHTTP(), this.fakeEndpoints()],
      { concurrent: false }
    );

    try {
      await concurrentTasks.run();
      await httpGatewayTask.run();
      // await this.createNRooms(this.endpoints['HTTPGatewayURI']);
      
      // const envConfig = {
      //   VITE_DEV_SIGNAL_SERVER_URL: this.endpoints['WebsocketURI'],
      //   VITE_RTC_CONFIG: this.endpoints['FormattedRTCConfig'],
      //   VITE_API_STACK_URL: this.endpoints['HTTPGatewayURI'],
      // };
      // const envData = this.convertToEnvFormat(envConfig);
      // await this.writeEnvFile(envData);
    } catch (err: any) {
      deployErrorHandler(err);
    }
    // the output file needs these endpoints
    // WebsocketURI
    // FormattedRTCConfig
    // HTTPGatewayURI
  }

  async deployService(stack: StackData) {
    const params = this.getParams(stack);
    try {
      if (!this.cloudFormationClient) return;
      const result = this.cloudFormationClient.createStack(params);
      await this.checkStackCreationStatus(stack.name);
    } catch (err: any) {
      throw err;
    }
  }

  createListrTask(stack: StackData): ListrTask {
    return {
      title: stack.deployingMessage,
      task: async (_, task) => {
        await this.deployService(stack);
        task.title = ui.secondary(stack.deployCompleteMessage);
      },
    };
  }

  deploySFU(): ListrTask {
    const stackName = 'sfu-ecs';
    const stack = this.yamlTemplates.findTemplateByName(stackName);
    return this.createListrTask(stack);
  }

  deployCoTURN(): ListrTask {
    const stackName = 'coturn-ecs';
    const stack = this.yamlTemplates.findTemplateByName(stackName);
    return this.createListrTask(stack);
  }

  deployWSG(): ListrTask {
    const stackName = 'signal';
    const stack = this.yamlTemplates.findTemplateByName(stackName);
    return this.createListrTask(stack);
  }

  deployHTTPAPI(): ListrTask {
    const stackName = 'httpapi';
    const stack = this.yamlTemplates.findTemplateByName(stackName);
    return this.createListrTask(stack);
  }

  getParams(stack: StackData) {
    return {
      StackName: stack.name,
      TemplateBody: stack.template,
      Capabilities: stack.capability,
    };
  }

  async checkStackCreationStatus(stackName: string): Promise<void> {
    return await new Promise((resolve, reject) => {
      const id = setInterval(async () => {
        const stackStatus = await this.getStackStatus(stackName).catch(
          (err) => {
            clearInterval(id);
            reject(err);
          }
        );

        switch (true) {
          case this.isComplete(stackStatus):
            clearInterval(id);
            resolve();
          case this.isError(stackStatus):
            clearInterval(id);
            reject(`Stack creation failed with status ${stackStatus}`);
        }
      }, this.checkInterval);
    });
  }

  getAllEndpoints(): ListrTask {
    return {
      title: 'getting resource endpoints',
      task: async (_, task) => {
        await Promise.allSettled([
          this.getEndpoint('coturn-ecs', 'FormattedRTCConfig'),
          this.getEndpoint('signal', 'WebsocketURI'),
          this.getEndpoint('httpapi', 'HTTPGatewayURI'),
        ]);
        task.title = 'all endpoints fetched';
      },
    };
  }

  async getEndpoint(apiStackName: string, outputKey: string) {
    try {
      const stackDescription = await this.cloudFormationClient?.describeStacks({
        StackName: apiStackName,
      });
      const outputs = stackDescription?.Stacks?.[0].Outputs;
      const targetOutput = outputs?.filter(
        (output) => output.OutputKey === outputKey
      )[0];
      const endpoint = targetOutput?.OutputValue;
      if (!endpoint) throw new Error('Could not find your endpoint');
      this.endpoints[outputKey] = endpoint;
    } catch (err) {
      return err;
    }
  }

  async createNRooms(url: string) {
    for (let i = 0; i < this.idleRooms; i += 1) {
      try {
        const response = await fetch(`${url}/createRoom`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Cannot create room');
      } catch (err) {
        throw err;
      }
    }
  }

  convertToEnvFormat(config: { [key: string]: string }) {
    return Object.entries(config)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
  }

  async writeEnvFile(envContent: string) {
    fs.writeFile('.env.local', envContent, (err) => {
      if (err) {
        ui.error('Error writing .env file');
        return;
      }
    });
  }
  private async getStackStatus(stackName: string) {
    try {
      const stackData: DescribeStacksCommandOutput | undefined =
        await this.cloudFormationClient?.describeStacks({
          StackName: stackName,
        });
      const stackStatus = stackData?.Stacks?.[0].StackStatus;
      return stackStatus;
    } catch (err) {
      throw err;
    }
  }

  private isComplete(status: string | void | undefined): boolean {
    if (status)
      return status === 'CREATE_COMPLETE' || status === 'UPDATE_COMPLETE';
    return false;
  }

  private isError(status: string | void | undefined): boolean {
    if (status)
      return (
        status.endsWith('FAILED') ||
        status === 'ROLLBACK_COMPLETE' ||
        status === 'ROLLBACK_IN_PROGRESS'
      );

    return false;
  }
}
