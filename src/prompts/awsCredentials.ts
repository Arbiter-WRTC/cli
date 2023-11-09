import inquirer, { Answers, DistinctQuestion } from "inquirer";

const isNotEmpty = (input: string): boolean | string => {
  if (input.length > 0) return true;

  return "Input cannot be empty, please try again.";
};

const isNumber = (input: number): boolean | string => {
  if (input > 0 && input < 20) return true;
  return "Please enter a positive number less than 20"
}

const accessKeyIdQuestion: DistinctQuestion = {
  type: "input",
  name: "accessKeyId",
  message: "Enter your AWS access key ID: ",
  validate: isNotEmpty,
};

const secretAccessKeyQuestion: DistinctQuestion = {
  type: "password",
  mask: '*',
  name: "secretAccessKey",
  message: "Enter your AWS secret access key: ",
  validate: isNotEmpty,
};

const selectRegionQuestion: DistinctQuestion = {
  type: "list",
  name: "region",
  message: "Please select a region to provision/access your resources: ",
  choices: ["us-east-1", "us-east-2", "us-west-1", "us-west-2"],
};

const idleRoomsQuestion: DistinctQuestion = {
  type: "number",
  default: 2,
  name: "idleRooms",
  message: "How many rooms would you like idle as a buffer? ",
  validate: isNumber,
};

export const GetAwsInfo = async (): Promise<Answers> => {
  let answers = await inquirer.prompt(
    [accessKeyIdQuestion, secretAccessKeyQuestion, selectRegionQuestion, idleRoomsQuestion],
  );

  const AwsInfo = {
    credentials: {
      accessKeyId: answers.accessKeyId,
      secretAccessKey: answers.secretAccessKey,
    },
    region: answers.region,
    idleRooms: answers.idleRooms,
  };

  return AwsInfo;
};