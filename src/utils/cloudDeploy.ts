import * as ui from "../utils/ui.js";
import { AwsCredentialIdentity } from "@aws-sdk/types";
import { CloudFormation, DescribeStacksCommandOutput,} from "@aws-sdk/client-cloudformation";
import { StackData, stacks } from "../constants/cloudFormationData.js";
import { Templates } from "./templates.js";
import { deployErrorHandler } from "./errorHandler.js";
import { Listr, ListrTask } from 'listr2';

type Capability = "CAPABILITY_IAM" | "CAPABILITY_NAMED_IAM" | "CAPABILITY_AUTO_EXPAND";

export class CloudDeploy {
  cloudFormationClient: CloudFormation | undefined;
  yamlTemplates: Templates;
  idleRooms: number;
  checkInterval: number;
  endpoints?: PromiseSettledResult<unknown>[];

  constructor(cloudformation: CloudFormation | undefined, idleRooms: number) {
    this.cloudFormationClient = cloudformation;
    this.yamlTemplates = new Templates(stacks);
    this.idleRooms = idleRooms;
    this.checkInterval = 3000;
  }

  async deployAll() {
    const concurrentTasks = new Listr([this.deploySFU(), this.deployCoTURN(), this.deployWSG()],
      { concurrent: true, exitOnError: true }
    );
    const httpGatewayTask = new Listr([this.deployHTTPAPI(), this.getAllEndpoints(), ], {concurrent: false});

    try {
    await concurrentTasks.run();
    await httpGatewayTask.run();
    } catch(err: any) {
      deployErrorHandler(err)
    }
    // the output file needs these endpoints
      // WebsocketURI
      // FormattedRTCConfig

    // HTTPGatewayURI
  }

  async deployService(stack: StackData) {
    const params = this.getParams(stack);
    try {
      if (!this.cloudFormationClient) return
      const result = this.cloudFormationClient.createStack(params)
      await this.checkStackCreationStatus(stack.name)
    } catch(err: any) {
      throw err;
    } 
  }

  deploySFU(): ListrTask {
    const stackName = 'sfu-ecs';
    const stack = this.yamlTemplates.findTemplateByName(stackName)

    return {
      title: stack.deployingMessage,
      task: async (_, task) => {
        await this.deployService(stack)
        task.title = ui.secondary(stack.deployCompleteMessage);
      },
    }
  }

  deployCoTURN(): ListrTask {
    const stackName = 'coturn-ecs';
    const stack = this.yamlTemplates.findTemplateByName(stackName)

    return {
      title: stack.deployingMessage,
      task: async (_, task) => {
        await this.deployService(stack)
        task.title = ui.secondary(stack.deployCompleteMessage);
      },
    }
  }

  deployWSG(): ListrTask {
    const stackName = 'signal';
    const stack = this.yamlTemplates.findTemplateByName(stackName)

    return {
      title: stack.deployingMessage,
      task: async (_, task) => {
        await this.deployService(stack)
        task.title = ui.secondary(stack.deployCompleteMessage);
      },
    }
  }

  deployHTTPAPI(): ListrTask {
    const stackName = 'httpapi';
    const stack = this.yamlTemplates.findTemplateByName(stackName)

    return {
      title: stack.deployingMessage,
      task: async (_, task) => {
        await this.deployService(stack)
        task.title = ui.secondary(stack.deployCompleteMessage);
      },
    }
  }

  getParams(stack: StackData) {
    const capabilities: Capability[] = ["CAPABILITY_IAM", "CAPABILITY_NAMED_IAM", "CAPABILITY_AUTO_EXPAND"];
    return  {
      StackName: stack.name,
      TemplateBody: stack.template,
      Capabilities: capabilities,
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
        this.endpoints = await Promise.allSettled([this.getEndpoint('coturn-ecs', 'FormattedRTCConfig'), this.getEndpoint('signal', 'WebsocketURI'), this.getEndpoint('httpapi', 'HTTPGatewayURI')])
        task.title = 'all endpoints fetched';
      },
    }
  }

  async getEndpoint(apiStackName: string, outputKey: string) {
    try {
      const stackDescription = await this.cloudFormationClient
      ?.describeStacks({
        StackName: apiStackName,
      })
      const outputs = stackDescription?.Stacks?.[0].Outputs;
      const targetOutput = outputs?.filter(
        (output) => output.OutputKey === outputKey
      )[0];
      const endpoint = targetOutput?.OutputValue;
      if (!endpoint) throw new Error("Could not find your endpoint");
  
      return endpoint;

    } catch(err) {
        return err
    }
  }

  private async getStackStatus(stackName: string) {
    try {
      const stackData: DescribeStacksCommandOutput | undefined =
      await this.cloudFormationClient?.describeStacks({ StackName: stackName })
      const stackStatus = stackData?.Stacks?.[0].StackStatus;
      return stackStatus;
    } catch(err){
      return Promise.reject(err);
    }
  }

  private isComplete(status: string | void | undefined): boolean {
    if (status)
      return status === "CREATE_COMPLETE" || status === "UPDATE_COMPLETE";
    return false;
  }

  private isError(status: string | void | undefined): boolean {
    if (status)
      return (
        status.endsWith("FAILED") ||
        status === "ROLLBACK_COMPLETE" ||
        status === "ROLLBACK_IN_PROGRESS"
      );

    return false;
  }
}