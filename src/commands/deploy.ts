import {Command} from '@oclif/core'
import { GetAwsInfo } from '../prompts/awsCredentials.js';
import { CloudFormation} from "@aws-sdk/client-cloudformation";
import * as ui from "../utils/ui.js";
import { CloudDeploy } from '../utils/cloudDeploy.js';
import { errorHandler } from '../utils/errorHandler.js';
export default class Deploy extends Command {
  static description = 'provision and deploy arbiter to aws';

  public async run(): Promise<void> {
    ui.greet();
    await ui.printLogo();
    await ui.generateName();
    const {credentials, region, idleRooms} = await GetAwsInfo();
    let cloudFormation
    
    try {
      cloudFormation = new CloudFormation({ credentials, region });
      await cloudFormation.listStacks({});
    } catch (err) {
      if (err instanceof Error) {
        errorHandler(err.message);
      } else {
        errorHandler(`Non-Error thrown: ${String(err)}`);
      }
    }
    ui.success("AWS Credentials validated");
    
    ui.display("Arbiter is being deployed and might take a few minutes");

    const arbiterDeploy = new CloudDeploy(cloudFormation, idleRooms);
    await arbiterDeploy.deployAll();

    ui.deploySuccessText();
    ui.gradientText('Warp field stablized!')
    ui.success('Deployment successful. Copy the .env.local file into your react project!')
    ui.success('Use the Arbiter-SDK to complete your conferencing features and enjoy!')
    ui.gradientText('Thank you for using Arbiter!');
  }
}
