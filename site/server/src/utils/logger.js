const winston = require('winston');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'ai-butik-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  ]
});

// `${info.level}: ${info.message} JSON.stringify({ ...rest })`
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(
        info => `${info.timestamp} ${info.level}: ${info.message} ${
          info.stack ? '\n' + info.stack : (
            Object.keys(info).some(key => !['timestamp', 'level', 'message', 'service'].includes(key))
              ? '\n' + JSON.stringify(Object.fromEntries(
                  Object.entries(info).filter(([key]) => !['timestamp', 'level', 'message', 'service'].includes(key))
                ), null, 2)
              : ''
          )
        }`
      )
    )
  }));
}

module.exports = logger;