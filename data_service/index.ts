import express from "express";
import http from "http";
import bodyParser from "body-parser";

import { UsersTopicsListening } from "./kafka/index";
import { UsersNats } from "./nats/index";
import { connect } from "nats";
import { nat_server } from "./admin";

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const usersNats = new UsersNats();

async function getNatsServer() {
  const nc = await connect({ servers: nat_server });
  usersNats.usersNatsSubscriber(nc);
}
getNatsServer();
const usersTopicsListening = new UsersTopicsListening();
usersTopicsListening.notesTopicsListening();
