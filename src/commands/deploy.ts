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

    if (!cloudFormation) {
      console.error("CloudFormation client could not be initialized.");
      return;
    }
    
    ui.display("Arbiter is being deployed and might take a few minutes");

    const arbiterDeploy = new CloudDeploy(cloudFormation, idleRooms);
    await arbiterDeploy.deployAll();

    console.log('thanks bye')
   // show process working in the background
   // display success or failure
  }
}
