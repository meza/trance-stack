import fs from 'node:fs';
console.log(process.env);
if (!process.env.GITHUB_STEP_SUMMARY) {
  process.env.GITHUB_STEP_SUMMARY = 'deploymentSummary.md';
  // eslint-disable-next-line no-sync
  fs.writeFileSync(process.env.GITHUB_STEP_SUMMARY, '');
}
