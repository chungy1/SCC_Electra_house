// in this file, set up the environment and websocket

import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();
const port = 80;

const portName = "/dev/cu.usbserial-10"; //use the right port on your laptop/PC
const serialPort = new SerialPort({ path: portName, baudRate: 9600 });

const parser = serialPort.pipe(new ReadlineParser({ delimiter: "\n" }));

parser.on("data", (id) => {
  console.log(`${id}`);
  primaryWs.send(id);
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let primaryWs = {
  send: () => null,
};

wss.on("connection", (ws) => {
  console.log("connected");
  ws.on("message", (message) => {
    console.log(`Messeage Recieved => ${message}`);
  });
  ws.send("Welcome to Websocket server");
  primaryWs = ws;
});

server.listen(port, () => {
  console.log(`it's running at http://localhost:${port}/`);
});
