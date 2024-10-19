import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";
import { MongoClient, ServerApiVersion } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = path.resolve(__dirname, "../../");
const app = express();

// express middlewares for url and json format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoClient = new MongoClient(process.env['MDB_CONNECTION_STRING'], {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

await mongoClient.connect();
let database = mongoClient.db("helios-users");

// express middleware to check for DB availability
app.use((req, res, next) => {
  if (!database) {
    return res.status(500).send("Database not connected yet.");
  } else next();
})

const apiPath = path.join(ROOT, '/server/src/api');
for(let endpoint of fs.readdirSync(apiPath)) {
  let imported = await import(path.join(apiPath, endpoint));
  imported.default(app, ROOT, database);
}

// serve static files from the React app
app.use(express.static(path.join(ROOT, "/client/dist")));

// serve the React app for any route !== /api
app.get("*", (req, res) => {
  res.sendFile(path.join(ROOT, "/client/dist/index.html"));
});

app.listen(process.env.port || 8080);