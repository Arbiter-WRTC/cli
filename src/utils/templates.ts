import { fileURLToPath } from 'url';
import * as fs from 'fs';
import * as path from 'path';
import { StackData } from '../constants/cloudFormationData.js';

export class Templates {
  stackData: StackData[];

  constructor(stackData: StackData[]) {
    this.stackData = stackData;
    this.parse();
  }

  parse() {
    this.stackData.forEach((stack) => {
      stack.template = this.readYAMLFile(
        path.join(this.getDirName(), `../cloudformation/${stack.name}.yaml`)
      );
    });
  }

  getDirName() {
    return path.dirname(fileURLToPath(import.meta.url));
  }

  readYAMLFile(filePath: string) {
    return fs.readFileSync(path.resolve(filePath), 'utf8');
  }

  findTemplateByName(name: string) {
    const stack = this.stackData.find((stack) => stack.name === name);
    if (!stack) {
      throw new Error('Fatal: no template found', )
    }
    return stack;
  }
}
