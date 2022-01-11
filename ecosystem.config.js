module.exports = {
  apps: [
    {
      name: 'metabike.app.server',
      script: './server/bin/www',
      env: {
        PORT: 6000,
        PUBLIC_URL: 'https://test.yian.dev',
        NODE_ENV: 'production'
      }
    },
    {
      name: 'metabike.app.offline',
      script: './server/bin/offline',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
