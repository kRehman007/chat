import http from "http";
import { app } from "./index.js";
import { initializeSocket } from "./socket.js";

const server = http.createServer(app);
initializeSocket(server);

const port = process.env.PORT || 8000;
server.listen(port, (): void =>
  console.log(`Server is running on port no: ${port as number}`)
);
