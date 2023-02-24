import './githubEnv'; // for local testing purposes
import fs from 'node:fs';
import path from 'node:path';
import * as core from '@actions/core';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const github = require('@actions/github');

const run = async () => {
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

      const summary = core.summary
        .addHeading('Deployment details')
        .addBreak()
        .addRaw(`✅ Your stack: <code>${stack}</code> has been successfully deployed.`)
        .addSeparator()
        .addRaw('You can access your API at the following URL: ')
        .addLink(apiName, apiName);

      summary.write().then((finalSummary) => {
        core.endGroup();
        if (github.context.eventName === 'pull_request') {
          core.info(summary.stringify());
          core.startGroup('Deployment summary for a PR');
          const context = github.context;
          const token = process.env.GITHUB_TOKEN || core.getInput('token', { required: true });
          const octokit = github.getOctokit(token);
          const repository = context.repo.repo;
          const owner = context.repo.owner;
          const issueNumber = process.env.ISSUE_NUMBER;
          octokit.rest.issues.createComment({
            owner: owner,
            repo: repository,
            // eslint-disable-next-line camelcase
            issue_number: issueNumber,
            body: finalSummary.stringify()
          } as never).then(() => {
            core.endGroup();
          });
        }
      });
    });
  } else {
    core.warning('No deployment result file found');
  }
};

run();
