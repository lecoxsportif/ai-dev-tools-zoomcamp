const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const { setupWSConnection } = require('y-websocket/bin/utils');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

app.use(cors());
app.use(express.json());

const path = require('path');

// Serve static files from the client build directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// API Routes
app.get('/api/health', (req, res) => {
  res.send('CodeView Server is running');
});

// Catch-all handler for any request that doesn't match an API route
// Sends back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Handle WebSocket upgrades
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    setupWSConnection(ws, request);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
