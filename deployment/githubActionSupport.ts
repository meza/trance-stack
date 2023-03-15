import './githubEnv'; // for local testing purposes
import fs from 'node:fs';
import path from 'node:path';
import * as core from '@actions/core';
import * as github from '@actions/github';

// Not for long, but for now we need to disable this rule
// eslint-disable-next-line sonarjs/cognitive-complexity
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
      const mnemonic = 'You can access your deployment at the following URL';

      const summary = core.summary
        .addHeading('Deployment details')
        .addBreak()
        .addRaw(`✅ Your stack: <code>${stack}</code> has been successfully deployed.`)
        .addSeparator()
        .addRaw(`${mnemonic}: `)
        .addLink(apiName, apiName);

      const finalText = summary.stringify();

      summary.write().then(async () => {
        core.endGroup();
        if (github.context.eventName === 'pull_request') {
          core.info(`Final text: ${finalText}`);
          core.startGroup('Deployment summary for a PR');
          const context = github.context;
          const token = process.env.GITHUB_TOKEN || core.getInput('token', { required: true });
          const octokit = github.getOctokit(token);
          const repository = context.repo.repo;
          const owner = context.repo.owner;
          const issueNumber = process.env.ISSUE_NUMBER;
          const parameters = {
            owner: owner,
            repo: repository,
            // eslint-disable-next-line camelcase
            issue_number: issueNumber
          } as never;

          let commentId = '';

          for await (const { data: comments } of octokit.paginate.iterator(octokit.rest.issues.listComments, parameters)) {
            // Search each page for the comment
            const comment = comments.find((comment) =>
              comment.body?.includes(mnemonic)
            );
            if (comment) {
              commentId = comment.id.toString();
            }
          }

          if (commentId) {
            octokit.rest.issues.updateComment({
              owner: owner,
              repo: repository,
              // eslint-disable-next-line camelcase
              comment_id: commentId,
              body: finalText
            } as never).then(() => {
              core.endGroup();
            });
          } else {
            octokit.rest.issues.createComment({
              owner: owner,
              repo: repository,
              // eslint-disable-next-line camelcase
              issue_number: issueNumber,
              body: finalText
            } as never).then(() => {
              core.endGroup();
            });
          }
        }
      });
    });
  } else {
    core.warning('No deployment result file found');
  }
};

run();
