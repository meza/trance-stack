const { execSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const { toLogicalID } = require('@architect/utils');

const getRandomString = length => crypto.randomBytes(length).toString('hex');

const askSetupQuestions = async () => {
  const inquirer = (await import('inquirer')).default;
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'hotjarId',
      message: 'What is your Hotjar ID?'
    },
    {
      type: 'input',
      name: 'mixpanelId',
      message: 'What is your Mixpanel ID?'
    },
    {
      type: 'list',
      name: 'mixpanelApi',
      message: 'What is your Mixpanel data residency?',
      choices: [
        { name: 'US', value: 'us' },
        { name: 'EU', value: 'eu' }
      ],
      default: 'us',
      filter: (value) => {
        if (value === 'us') {
          return 'https://api.mixpanel.com';
        }
        return 'https://api-eu.mixpanel.com';
      }
    }
  ]);
  return answers;
};

const main = async ({ rootDirectory }) => {
  const sort = (await import('sort-package-json')).default;
  const answers = await askSetupQuestions().catch((error) => {
    if (error.isTtyError) {
      throw new Error('Prompt couldn\'t be rendered in the current environment');
    } else {
      throw error;
    }
  });

  const APP_ARC_PATH = path.join(rootDirectory, './app.arc');
  const EXAMPLE_ENV_PATH = path.join(rootDirectory, '.env.example');
  const ENV_PATH = path.join(rootDirectory, '.env');
  const PACKAGE_JSON_PATH = path.join(rootDirectory, 'package.json');
  const README_PATH = path.join(rootDirectory, 'README.md');
  const DIR_NAME = path.basename(rootDirectory);
  const SUFFIX = getRandomString(2);

  const APP_NAME = (DIR_NAME + '-' + SUFFIX)
    // get rid of anything that's not allowed in an app name
    .replace(/[^a-zA-Z0-9-_]/g, '-');

  const [appArc, env, packageJson, readme] = await Promise.all([
    fs.readFile(APP_ARC_PATH, 'utf-8'),
    fs.readFile(EXAMPLE_ENV_PATH, 'utf-8'),
    fs.readFile(PACKAGE_JSON_PATH, 'utf-8'),
    fs.readFile(README_PATH, 'utf-8')
  ]);

  const newEnv = env.replace(
    /^SESSION_SECRET=.*$/m,
    `SESSION_SECRET="${getRandomString(16)}"`
  ).replace(
    /^HOTJAR_ID=.*$/m,
    `HOTJAR_ID=${answers.hotjarId}`
  ).replace(
    /^MIXPANEL_TOKEN=.*$/m,
    `MIXPANEL_TOKEN=${answers.mixpanelToken}`
  ).replace(
    /^MIXPANEL_API=.*$/m,
    `MIXPANEL_API=${answers.mixpanelApi}`
  )

  const newPackageJson
    = JSON.stringify(
    sort({ ...JSON.parse(packageJson), name: APP_NAME }),
    null,
    2
  ) + '\n';

  await Promise.all([
    fs.writeFile(
      APP_ARC_PATH,
      appArc.replace('repl-app-slug', APP_NAME)
    ),
    fs.writeFile(ENV_PATH, newEnv),
    fs.writeFile(PACKAGE_JSON_PATH, newPackageJson),
    fs.writeFile(
      README_PATH,
      readme.replace(new RegExp('REPL_APP_NAME', 'g'), toLogicalID(APP_NAME))
    ),
    fs.copyFile(
      path.join(rootDirectory, 'remix.init', 'gitignore'),
      path.join(rootDirectory, '.gitignore')
    )
  ]);

  console.log('✅  Project is ready! Start development with "pnpm dev"');
};

module.exports = main;
