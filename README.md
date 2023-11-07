oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g arbiter-wrtc
$ arbiter COMMAND
running command...
$ arbiter (--version)
arbiter-wrtc/0.0.0 darwin-x64 node-v20.6.1
$ arbiter --help [COMMAND]
USAGE
  $ arbiter COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`arbiter hello PERSON`](#arbiter-hello-person)
* [`arbiter hello world`](#arbiter-hello-world)
* [`arbiter help [COMMANDS]`](#arbiter-help-commands)
* [`arbiter plugins`](#arbiter-plugins)
* [`arbiter plugins:install PLUGIN...`](#arbiter-pluginsinstall-plugin)
* [`arbiter plugins:inspect PLUGIN...`](#arbiter-pluginsinspect-plugin)
* [`arbiter plugins:install PLUGIN...`](#arbiter-pluginsinstall-plugin-1)
* [`arbiter plugins:link PLUGIN`](#arbiter-pluginslink-plugin)
* [`arbiter plugins:uninstall PLUGIN...`](#arbiter-pluginsuninstall-plugin)
* [`arbiter plugins:uninstall PLUGIN...`](#arbiter-pluginsuninstall-plugin-1)
* [`arbiter plugins:uninstall PLUGIN...`](#arbiter-pluginsuninstall-plugin-2)
* [`arbiter plugins update`](#arbiter-plugins-update)

## `arbiter hello PERSON`

Say hello

```
USAGE
  $ arbiter hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/Arbiter-WRTC/cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `arbiter hello world`

Say hello world

```
USAGE
  $ arbiter hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ arbiter hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/Arbiter-WRTC/cli/blob/v0.0.0/src/commands/hello/world.ts)_

## `arbiter help [COMMANDS]`

Display help for arbiter.

```
USAGE
  $ arbiter help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for arbiter.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.20/src/commands/help.ts)_

## `arbiter plugins`

List installed plugins.

```
USAGE
  $ arbiter plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ arbiter plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.0.2/src/commands/plugins/index.ts)_

## `arbiter plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ arbiter plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ arbiter plugins add

EXAMPLES
  $ arbiter plugins:install myplugin 

  $ arbiter plugins:install https://github.com/someuser/someplugin

  $ arbiter plugins:install someuser/someplugin
```

## `arbiter plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ arbiter plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ arbiter plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.0.2/src/commands/plugins/inspect.ts)_

## `arbiter plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ arbiter plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ arbiter plugins add

EXAMPLES
  $ arbiter plugins:install myplugin 

  $ arbiter plugins:install https://github.com/someuser/someplugin

  $ arbiter plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.0.2/src/commands/plugins/install.ts)_

## `arbiter plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ arbiter plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help      Show CLI help.
  -v, --verbose
  --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ arbiter plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.0.2/src/commands/plugins/link.ts)_

## `arbiter plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ arbiter plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ arbiter plugins unlink
  $ arbiter plugins remove
```

## `arbiter plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ arbiter plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ arbiter plugins unlink
  $ arbiter plugins remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.0.2/src/commands/plugins/uninstall.ts)_

## `arbiter plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ arbiter plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ arbiter plugins unlink
  $ arbiter plugins remove
```

## `arbiter plugins update`

Update installed plugins.

```
USAGE
  $ arbiter plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.0.2/src/commands/plugins/update.ts)_
<!-- commandsstop -->
