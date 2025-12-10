# CodeView - Real-time Coding Interview Platform

CodeView is a collaborative code editor similar to CoderPad, allowing users to write and execute code together in real-time.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS
- **Editor**: Monaco Editor (VS Code editor)
- **Real-time**: Yjs + y-websocket
- **Backend**: Node.js, Express (for signals), y-websocket (stand-alone server)
- **Execution**: Client-side Web Workers (Sandboxed JavaScript)

## Prerequisites

- Node.js (v16+)
- npm

## Installation

1. **Clone the repository** (if applicable)
2. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   ```
3. **Install Client Dependencies**
   ```bash
   cd client
   npm install
   ```

## Running the Application

You need to run both the backend (signaling server) and the frontend.

### 1. Start the Backend
The backend listens on port **1234** for WebSocket connections.
```bash
cd server
node node_modules/y-websocket/bin/server.js
```

### 2. Start the Frontend
The frontend runs on **http://localhost:5173**.
```bash
cd client
npm run dev
```

### 3. Usage
- Open `http://localhost:5173`.
- Click 'Create New Room' to generate a unique room ID.
- Share the URL with another person.
- Type in the editor - changes are synced instantly.
- Click 'Run Code' to execute the JavaScript code.

## Testing

We have integration tests to verify the real-time synchronization between clients.

### Run Integration Tests
Make sure the server is **RUNNING** (Step 1 above) before starting the tests.

```bash
cd server
npm test
```

This will spin up two virtual WebSocket clients and verify that updates propagate correctly.

## API Documentation

- **OpenAPI Spec**: See `server/openapi.yaml` for the rudimentary REST API documentation (mostly health checks, as the app is WebSocket-first).
