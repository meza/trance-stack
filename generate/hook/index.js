module.exports = {
  description: 'Generates new React hook',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: "What's the name of the hook? (ensure you prefix it with 'use')",
      validate: function (value) {
        let message = true;
        if (!/.+/.test(value)) {
          message = console.error('Missing', 'you must define a hook name');
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
        path: 'src/hooks/{{camelCase name}}/index.ts',
        templateFile: './generate/hook/templates/index.hbs',
      },
      {
        type: 'add',
        path: 'src/hooks/{{camelCase name}}/{{camelCase name}}.ts',
        templateFile: './generate/hook/templates/hook.hbs',
      },
      {
        type: 'add',
        path: 'src/hooks/{{camelCase name}}/{{camelCase name}}.stories.mdx',
        templateFile: './generate/hook/templates/docs.hbs',
      },
      {
        type: 'modify',
        path: 'src/hooks/index.ts',
        pattern: /(\/\* -- hook: insert above here -- \*\/)/gi,
        template:
          "export { {{camelCase name}} } from './{{camelCase name}}'\n$1",
      },
    ];
  },
};
