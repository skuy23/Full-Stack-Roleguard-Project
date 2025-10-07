module.exports = {
  accessTtl: process.env.ACCESS_TOKEN_TTL || '15m',
  refreshTtl: process.env.REFRESH_TOKEN_TTL || '7d',
  accessSecret: process.env.JWT_SECRET || 'dev',
  refreshSecret: process.env.REFRESH_SECRET || 'dev_refresh'
};
