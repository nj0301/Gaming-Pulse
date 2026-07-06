import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          // Media allowlist: self plus the configured object-storage/CDN host only.
          'img-src': ["'self'", 'data:', 'blob:', process.env.MEDIA_CDN_HOST ?? ''].filter(Boolean),
          'media-src': ["'self'", 'data:', 'blob:', process.env.MEDIA_CDN_HOST ?? ''].filter(Boolean),
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  'global::rate-limit',
];

export default config;
