const express = require('express');
const path = require('path');
const { createServer } = require('http');

const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const httpServer = createServer(app);

app.use(express.static(path.join(__dirname, '../build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

httpServer.listen(port, () => {
  console.log(
    `Server listening at 127.0.0.1:${port} (${
      isProduction ? 'Production' : 'Development'
    })`
  );
});
