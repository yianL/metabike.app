module.exports = {
  apps: [
    {
      name: 'metabike.app',
      script: './server/app.js',
      env: {
        PORT: 6000,
        NODE_ENV: 'production'
      }
    }
  ]
};
