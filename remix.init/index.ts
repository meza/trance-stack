import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'node:path';
import os from 'os';
import PackageJson from '@npmcli/package-json';
import isGitRepo from 'is-git-repository';

interface PromptAnswers {
  addOrigin: boolean;
  appSlug: string;
  appName: string;
  githubUsername: string;
  githubRepo: string;
  validate: boolean;
}

const getAppName = (appSlug: string) => {
  return appSlug
    .replace(/[-_]/g, ' ') // replace underscores and dashes with spaces
    .replace(/\b\w/g, (l) => l.toUpperCase()) // capitalize first letter of each word
    .replace(/\s/g, '') // remove spaces
    .replace(/([a-z])([A-Z])/g, '$1 $2'); // split camel case words with spaces
};

const cleanUpDeploymentScripts = async (rootDirectory: string) => {
  //remove all lines with "command: install" in all the yml files in the .github/workflows directory
  //as that is only necessary for the lockfile-less installations

  const workflowsPath = path.join(rootDirectory, '.github/workflows');
  const workflows = await fs.readdir(workflowsPath);
  for (const workflow of workflows) {
    const workflowPath = path.join(workflowsPath, workflow);
    const contents = await fs.readFile(workflowPath, 'utf-8');
    const newContents = contents.split('\n').filter((line) => !line.includes('command: install')).join('\n');
    await fs.writeFile(workflowPath, newContents, 'utf-8');
  }
};

const cleanUpReadme = async (rootDirectory: string) => {
  // remove all blocks between <!-- initremove:begin --> and <!-- initremove:end --> in the readme

  const readmePath = path.join(rootDirectory, 'README.md');
  const contents = await fs.readFile(readmePath, 'utf-8');

  const newContents = contents.replaceAll(/<!--\s*initremove:begin\s*-->.*?<!--\s*initremove:end\s*-->/gs, '');

  await fs.writeFile(readmePath, newContents, 'utf-8');
};

const replaceInFile = async (file: string, replacements: PromptAnswers) => fs.readFile(file, 'utf-8').then((contents) => {
  const githubSlug = replacements.githubRepo.replace(`https://github.com/${replacements.githubUsername}/`, '');
  const newContents = contents.replace('REPL_APP_SLUG', replacements.appSlug)
    .replaceAll('https://github.com/meza/trance-stack', replacements.githubRepo)
    .replaceAll('Trance Stack', replacements.appName)
    .replaceAll('TRANCE STACK', replacements.appName.toUpperCase())
    .replaceAll('trance stack', replacements.appName.toLowerCase())
    .replaceAll('remix-trance-stack', replacements.appSlug)
    .replaceAll('REPL_APP_NAME', replacements.appName)
    .replaceAll('REPL_APP_REPO', replacements.githubRepo)
    .replaceAll('https://meza.github.io/trance-stack/', `https://${replacements.githubUsername}.github.io/${githubSlug}`);

  return fs.writeFile(file, newContents, 'utf-8');
});

export default async ({ isTypeScript, rootDirectory }: { isTypeScript: boolean; rootDirectory: string; }) => {
  const { default: chalk } = await import('chalk');
  const appSlug = path.basename(rootDirectory);
  const username = os.userInfo().username;

  if (!isTypeScript) {
    console.log('🚨 This stack is typescript only. Your initial selection will be ignored. 🚨');
  }

  const appArcPath = path.join(rootDirectory, 'app.arc');
  const packageJsonPath = path.join(rootDirectory, 'package.json');
  const envExamplePath = path.join(rootDirectory, '.env.example');
  const envPath = path.join(rootDirectory, '.env');
  const readmePath = path.join(rootDirectory, 'README.md');
  const githubPath = path.join(rootDirectory, '.github');
  const workflowsPath = path.join(githubPath, 'workflows');
  const bugReportPath = path.join(githubPath, 'ISSUE_TEMPLATE/bug_report.yml');
  const featureRequestPath = path.join(githubPath, 'ISSUE_TEMPLATE/feature_request.yml');
  const issueTemplateConfigPath = path.join(githubPath, 'ISSUE_TEMPLATE/config.yml');
  const deployWorkflowPath = path.join(workflowsPath, 'deploy.yml');
  const ephemeralWorkflowPath = path.join(workflowsPath, 'ephemeralDeploy.yml');
  const ephemeralDestroyWorkflowPath = path.join(workflowsPath, 'ephemeralDestroy.yml');
  const fundingPath = path.join(rootDirectory, 'FUNDING.yml');
  const licensePath = path.join(rootDirectory, 'LICENSE');
  const contributingPath = path.join(rootDirectory, 'CONTRIBUTING.md');
  // const awsPath = path.join(rootDirectory, 'deployment');
  const rootPath = path.join(rootDirectory, 'src/root.tsx');
  const rootTestPath = path.join(rootDirectory, 'src/root.test.tsx');
  const e2ePath = path.join(rootDirectory, 'playwright/e2e/example.spec.ts');

  const filesToDelete = [
    fundingPath,
    licensePath,
    contributingPath
  ];

  const filesToReplaceThingsIn = [
    appArcPath,
    packageJsonPath,
    readmePath,
    bugReportPath,
    featureRequestPath,
    issueTemplateConfigPath,
    deployWorkflowPath,
    ephemeralWorkflowPath,
    ephemeralDestroyWorkflowPath,
    rootPath,
    rootTestPath,
    e2ePath
  ];

  console.log('\n🚀 Initializing your app...\n\n');
  const inquirer = (await import('inquirer')).default;
  const answers = await inquirer.prompt<PromptAnswers>([
    {
      type: 'input',
      name: 'appSlug',
      message: `${chalk.cyan('What is the slug of your app?')} ${chalk.white('This will be used in the Arc file and the deployment stages of your app')}`,
      default: appSlug,
      validate: (input: string) => {
        if (input.match(/^[a-zA-Z0-9-_]*$/)) {
          return true;
        }
        return chalk.yellow('The app slug can only contain letters, numbers, dashes, and underscores.');
      }
    },
    {
      type: 'input',
      name: 'appName',
      message: `${chalk.cyan('What is the name of your app?')} ${chalk.white('This will be used in the README and the Meta of your app.')}`,
      default: (answers: PromptAnswers) => {
        return getAppName(answers.appSlug);
      }
    },
    // {
    //   type: 'confirm',
    //   name: 'useAWS',
    //   message: `${chalk.cyan('Do you want to use AWS?')} ${chalk.white('This will add an AWS deployment workflow to your app.')}`,
    //   default: true
    // },
    // {
    //   type: 'confirm',
    //   name: 'useGithub',
    //   message: `${chalk.cyan('Do you want to use GitHub?')} ${chalk.white('This will add a GitHub Actions workflow to your app.')}`,
    //   default: true
    // },
    {
      type: 'input',
      name: 'githubUsername',
      message: `${chalk.cyan('What is your GitHub username?')} ${chalk.white('This will be used to construct a repo URL for your app.')}`,
      default: username
      // when: (answers) => answers.useGithub
    },
    {
      type: 'input',
      name: 'githubRepo',
      message: `${chalk.cyan('What is the name of your GitHub repo?')} ${chalk.white('This will be used in the github related documentation/policies.')}`,
      default: (answers: PromptAnswers) => {
        return `https://github.com/${answers.githubUsername}/${answers.appSlug}`;
      }
      // when: (answers) => answers.useGithub
    },
    {
      type: 'confirm',
      name: 'addOrigin',
      message: 'Does this repo already exist on GitHub?',
      default: false
    },
    {
      name: 'validate',
      type: 'confirm',
      default: true,
      message:
        'Do you want to run the build/tests/etc to verify things are setup properly?'
    }
  ]);

  await Promise.all(filesToDelete.map((file) =>
    fs.rm(file, {
      recursive: true,
      force: true
    })
  ));

  await Promise.all(filesToReplaceThingsIn.map((file) => replaceInFile(file, answers)));

  await Promise.all([
    cleanUpReadme(rootDirectory),
    cleanUpDeploymentScripts(rootDirectory),
    fs.copyFile(
      envExamplePath,
      envPath
    ),
    fs.copyFile(
      path.join(rootDirectory, 'remix.init', 'gitignore'),
      path.join(rootDirectory, '.gitignore')
    )
  ]);

  // if (!answers.useAWS) {
  //   filesToDelete.push(awsPath);
  // }
  //
  // if (!answers.useGithub) {
  //   filesToDelete.push(githubPath);
  // }

  if (answers.validate) {
    console.log(
      'Running the validate script to make sure everything was set up properly'
    );
    execSync('npm run validate', { cwd: rootDirectory, stdio: 'inherit' });
  }

  const pkgJson = await PackageJson.load(rootDirectory);
  const newContent = pkgJson.content;
  delete newContent.workspaces;
  pkgJson.update(newContent);
  await pkgJson.save();

  if (!isGitRepo()) {
    console.log('Initializing git repo...');
    execSync('git init', { cwd: rootDirectory, stdio: 'inherit' });
    execSync('git add .', { cwd: rootDirectory, stdio: 'inherit' });
    execSync('git commit -m\'chore: created the remix app\'', { cwd: rootDirectory, stdio: 'inherit' });
    execSync('git branch -M main', { cwd: rootDirectory, stdio: 'inherit' });
    if (answers.addOrigin) {
      execSync(`git remote add origin ${answers.githubRepo}`, { cwd: rootDirectory, stdio: 'inherit' });
    }
  }

  execSync('npm run prepare', { cwd: rootDirectory, stdio: 'inherit' });

  console.log(
    '✅  Project is ready! Start development with "npm run dev"'
  );

  if (!answers.addOrigin) {
    console.log('\n');
    console.log('You can add the git remote origin with the following command:\n');
    console.log(chalk.cyan(`git remote add origin ${answers.githubRepo}\n\n`));
  }
};

