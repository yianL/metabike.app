module.exports = {
  apps: [
    {
      name: 'metabike.app.server',
      script: './server/bin/www'
    },
    {
      name: 'metabike.app.offline',
      script: './server/bin/offline'
    }
  ]
};
