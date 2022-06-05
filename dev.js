process.env.PORT = process.env.PORT ?? 3000;
process.env.ARC_LOCAL = process.env.ARC_LOCAL ?? 1;
process.env.ARC_TABLES_PORT = process.env.ARC_TABLES_PORT ?? 5555;
process.env.STATIC_PATH = '_static';

const arc = require('@architect/architect');

arc();
