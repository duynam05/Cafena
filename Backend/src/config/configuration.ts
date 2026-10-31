export const configuration = () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'cafena_super_secret_jwt_key_2026_change_in_production',
    expiresIn: process.env.JWT_EXPIRATION || '1h',
    refreshSecret:
      process.env.JWT_REFRESH_SECRET || 'cafena_super_secret_refresh_key_2026_change_in_production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  mail: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'Cafena Coffee <no-reply@cafena.vn>',
  },
  ai: {
    serviceUrl: process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000',
  },
});

