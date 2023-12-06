![arbiter_banner](https://github.com/Arbiter-WRTC/cli/assets/57457673/fc3b2155-707a-4e25-ab42-6a382713a3f5)
<!-- toc -->

* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
Arbiter's CLI can be installed globally with npm
```sh-session
$ npm install -g arbiter-wrtc
```

Deploy Arbiter to your AWS account using the deploy command
```sh-session
$ arbiter deploy
running command...
```

Check your current version or get help with
```sh-session
$ arbiter (--version)
arbiter-wrtc/0.1.1 darwin-x64 node-v20.6.1
$ arbiter --help [COMMAND]
USAGE
  $ arbiter COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`arbiter deploy]`](#arbiter-deploy)

## `arbiter deploy`

```
USAGE
  $ arbiter deploy [FILE] [-n <value>] [-f]

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  deploy Arbiter to AWS

EXAMPLES
  $ arbiter deploy
```

The `deploy` command will prompt you for your AWS access key ID and secret access key.
Your AWS IAM account must have permission to create infastructure and security groups.
You will then be asked what region you want to use to deploy Arbiter, and how many rooms you would like idle.
Note that idle rooms are able to be claimed by users. It is possible to run Arbiter with 0 idle rooms, but that may result in long wait times to create new rooms when a URL is visited. A room is docker container of Arbiter's SFU, and it can take several minutes for a room to instantiate and become available to be claimed.

When you deploy Arbiter, you will have the following architecture created:
<img width="751" alt="Screen Shot 2023-12-05 at 9 14 52 PM" src="https://github.com/Arbiter-WRTC/cli/assets/57457673/822f173d-02c9-458d-8253-7bde9075d366">

This architecture includes:
  HTTP API Gateway
  WebSocket Gateway
  CoTURN ECS Cluster
  SFU ECS Cluster

Please refer to the documentation on <a href="https://arbiter-framework.com">Arbiter's Homepage</a> for API documentation.
_See code: [src/commands/deploy.ts](https://github.com/Arbiter-WRTC/cli/blob/v0.1.0/src/commands/deploy.ts)_

<!-- commandsstop -->
