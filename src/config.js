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
    password: 'root',
  },
  test: {
    connectionLimit: 10,
    host: 'database',
    user: 'root',
    password: 'root',
    database: 'irp',
  },
};

module.exports = config;
