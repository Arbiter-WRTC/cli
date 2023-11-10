import { Capability } from "@aws-sdk/client-cloudformation";

export type StackData = {
  name: string;
  template: string;
  deployingMessage: string;
  deployCompleteMessage: string;
  capability: Capability[];
};

export const sfuStack: StackData = {
  name: "sfu-ecs",
  deployingMessage: "Deploying SFU to ECS Fargate...",
  deployCompleteMessage: "SFU ECS is deployed!",
  capability: ["CAPABILITY_IAM", "CAPABILITY_NAMED_IAM", "CAPABILITY_AUTO_EXPAND"],
  template: ''
};

export const signalStack: StackData = {
  name: "signal",
  deployingMessage: "Deploying Signaling Stack to Websocket Gateway...",
  deployCompleteMessage: "Websocket Gateway Signaling Stack is deployed!",
  capability: ["CAPABILITY_IAM", "CAPABILITY_NAMED_IAM", "CAPABILITY_AUTO_EXPAND"],
  template: ''
};

export const httpApiStack: StackData = {
  name: "httpapi",
  deployingMessage: "Deploying HTTP API Gateway...",
  deployCompleteMessage: "HTTP API Gateway is deployed!",
  capability: ["CAPABILITY_IAM", "CAPABILITY_NAMED_IAM", "CAPABILITY_AUTO_EXPAND"],
  template: ''
};

export const coturnStack: StackData = {
  name: "coturn-ecs",
  deployingMessage: "Deploying CoTURN to ECS Fargate...",
  deployCompleteMessage: "CoTURN ECS is deployed!",
  capability: ["CAPABILITY_IAM", "CAPABILITY_NAMED_IAM", "CAPABILITY_AUTO_EXPAND"],
  template: ''
};

export const stacks: StackData[] = [
  sfuStack,
  signalStack,
  httpApiStack,
  coturnStack,
];