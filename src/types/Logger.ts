import pino from 'pino';

const Logger =
  process.env.NODE_ENV === 'production'
    ? pino()
    : pino({
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      });

export default Logger;
