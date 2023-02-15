module.exports = {
  description: 'Generates new React component',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: "What's the name of the Component?",
      validate: function (value) {
        let message = true;
        if (!/.+/.test(value)) {
          message = console.error(
            'Missing',
            'you must define a component name',
          );
        } else if (value.length < 3) {
          message = console.error(
            'Too Short',
            `"${value}" is not descriptive enough`,
          );
        }
        return message;
      },
    },
  ],
  actions: function () {
    return [
      {
        type: 'add',
        path: 'src/components/{{pascalCase name}}/index.ts',
        templateFile: './generate/component/templates/index.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.tsx',
        templateFile: './generate/component/templates/component.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.stories.tsx',
        templateFile: './generate/component/templates/story.hbs',
      },
      // {
      //   type: 'add',
      //   path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.test.tsx',
      //   templateFile: './generate/component/templates/test.hbs',
      // },
      {
        type: 'modify',
        path: 'src/components/index.ts',
        pattern: /(\/\* -- component: insert above here -- \*\/)/gi,
        template:
          "export { {{pascalCase name}} } from './{{pascalCase name}}';\n$1",
      },
    ];
  },
};
