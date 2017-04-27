var config = {};

config.env = process.env.NODE_ENV || 'development';

config.mysql = {
  production: {
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'irp',
  },
  development: {
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'irp',
  },
  test: {
    connectionLimit: 10,
    host: 'database',
    user: 'root',
    password: 'root',
    database: 'irp',
  },
};

config.mail = {
  from: 'Altran <altran@musaic.ml>',
  user: '52c5cd0009cbb99f272734c8a5f2397a',
  password: 'c89caedf7d95d57eb0afcc334c813f92', // TODO: use environment variables
  host: 'in-v3.mailjet.com',
  ssl: true,
};

module.exports = config;
