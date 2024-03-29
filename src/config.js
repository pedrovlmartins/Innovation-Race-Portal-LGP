var config = {};

var castField = function(field, useDefaultTypeCasting) {
  if ((field.type === "BIT") && (field.length === 1)) {
    var bytes = field.buffer();
    return( bytes[ 0 ] === 1 );
  }
  else return(useDefaultTypeCasting());
}

config.env = process.env.NODE_ENV || 'development';

if (config.env === 'development') {
  config.baseURL = 'http://localhost:8080/';
} else {
  config.baseURL = 'http://altran.musaic.ml/';
}

config.mysql = {
  production: {
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'irp',
    typeCast: castField,
  },
  development: {
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'irp',
    typeCast: castField,
  },
  test: {
    connectionLimit: 10,
    host: 'database',
    user: 'root',
    password: 'root',
    database: 'irp',
    typeCast: castField,
  },
};

config.mail = {
  from: 'Altran <altran@musaic.ml>',
  user: '52c5cd0009cbb99f272734c8a5f2397a',
  password: 'c89caedf7d95d57eb0afcc334c813f92', // TODO: use environment variables
  host: 'in-v3.mailjet.com',
  ssl: false,
};

module.exports = config;
