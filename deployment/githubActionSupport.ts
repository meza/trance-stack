import './githubEnv'; // for local testing purposes
import fs from 'node:fs';
import path from 'node:path';
import * as core from '@actions/core';

const file = path.resolve(process.argv[2]);
core.info(`Looking for deployment result file at ${file}`);
// eslint-disable-next-line no-sync
if (fs.existsSync(file)) {
  core.info('Found deployment result file');
  core.startGroup('Deployment summary');
  import(file).then((outputs) => {
    const typedOutputs: {
      [key: string]: {
        ApiUrl: string;
      }
    } = outputs;

    const stack = Object.keys(outputs)[0];
    const apiName = `https://${typedOutputs[stack].ApiUrl}`;

    core.summary
      .addHeading('Deployment details')
      .addBreak()
      .addRaw(`✅ Your stack: <code>${stack}</code> has been successfully deployed.`)
      .addSeparator()
      .addRaw('You can access your API at the following URL: ')
      .addLink(apiName, apiName)
      .write().then(() => {
        core.endGroup();
      });
  });
} else {
  core.warning('No deployment result file found');
}
