import path from 'path';

export default ({ env }: { env: any }) => {
  const client = env('DATABASE_CLIENT', 'postgres');

  const connections = {
    postgres: {
      connection: {
        host: env('DATABASE_HOST', '127.0.0.1'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'msme_database'),
        user: env('DATABASE_USERNAME', 'postgres'),
        password: env('DATABASE_PASSWORD', 'postgres'),
        ssl: env.bool('DATABASE_SSL', false) ? { rejectUnauthorized: false } : false,
      },
      pool: {
        min: env.int('DATABASE_POOL_MIN', 2),
        max: env.int('DATABASE_POOL_MAX', 10),
      },
    },
    sqlite: {
      connection: {
        filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      ...connections[client as keyof typeof connections],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};