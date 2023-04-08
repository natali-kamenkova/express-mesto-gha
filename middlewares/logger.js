const winston = require('winston');
const expressWinston = require('express-winston');

const handlerRequestLogger = expressWinston.logger({ // запросоы
  transports: [new winston.transports.File({ filename: 'request.log' })],
  format: winston.format.json(),
});

const handlerErrorLogger = expressWinston.errorLogger({ // ошибки
  transports: [new winston.transports.File({ filename: 'error.log' })],
  format: winston.format.json(),
});

module.exports = { handlerRequestLogger, handlerErrorLogger };
