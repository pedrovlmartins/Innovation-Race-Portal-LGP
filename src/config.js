var config = {};

config.env = process.env.NODE_ENV || 'development';

config.mysql = {
  production: {
    connectionLimit: 10,
    host: 'database',
    user: 'root',
    database: 'irp',
  },
  development: {
    connectionLimit: 10,
    host: 'database',
    user: 'root',
    database: 'irp',
  },
  test: {
    connectionLimit: 10,
    host: 'database',
    user: 'root',
    database: 'irp_test',
  },
};

module.exports = config;
