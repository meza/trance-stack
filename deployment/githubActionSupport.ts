import './githubEnv';
import fs from 'node:fs';
import * as core from '@actions/core';

const file = '../deployment.result.json';

// eslint-disable-next-line no-sync
if (fs.existsSync(file)) {
  console.log('The github step summary is:', process.env.GITHUB_STEP_SUMMARY);
  import(file).then((outputs) => {
    const typedOutputs: {
      [key: string]: {
        ApiUrl: string;
      }
    } = outputs;

    const stack = Object.keys(outputs)[0];
    const apiName = typedOutputs[stack].ApiUrl;

    core.summary.addHeading('Deployment details')
      .addBreak()
      .addRaw(`✅ Your stack: <code>${stack}</code> has been successfully deployed.`)
      .addSeparator()
      .addRaw('You can access your API at the following URL: ')
      .addLink(apiName, apiName)
      .write();

  });

}
