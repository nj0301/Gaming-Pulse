import path from 'path';
import fs from 'node:fs';

function resolveSqliteFilename(filename: string): string {
  if (!filename) filename = '.tmp/data.db'; // scaffold .env ships DATABASE_FILENAME= (empty)
  if (path.isAbsolute(filename)) return filename;
  // __dirname is <app>/config or <app>/dist/config; walk up to the app root.
  let appRoot = path.resolve(__dirname, '..');
  if (path.basename(appRoot) === 'dist') appRoot = path.resolve(appRoot, '..');
  const resolved = path.resolve(appRoot, filename);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  return resolved;
}

import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Database => {
  const client = env('DATABASE_CLIENT', 'sqlite');

  const connections = {
    mysql: {
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
      },
      pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
    },
    postgres: {
      connection: {
        connectionString: env('DATABASE_URL'),
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
        schema: env('DATABASE_SCHEMA', 'public'),
      },
      pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
    },
    sqlite: {
      connection: {
        // Resolve against the app root regardless of whether this file runs
        // from config/ (tsx scripts) or dist/config/ (compiled builds).
        filename: resolveSqliteFilename(env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };

  if (!(client in connections)) {
    throw new Error(
      `Unsupported DATABASE_CLIENT: ${client}. Use "postgres", "mysql", or "sqlite".`
    );
  }

  type DatabaseClient = keyof typeof connections;

  return {
    connection: {
      client: client as DatabaseClient,
      ...connections[client as DatabaseClient],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  } as Core.Config.Database;
};

export default config;
