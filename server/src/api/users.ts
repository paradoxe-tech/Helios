import * as defaults from "../../../shared/defaults";
import fs from 'fs';
import path from 'path';

export default function run(app, ROOT:string, database) {
  app.get("/api/users", async (req, res) => {
    try {
      const result = await database.collection('helios-users-collection').find({}).toArray();
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).send("Erreur lors de la récupération des utilisateurs.");
    }
  });
}