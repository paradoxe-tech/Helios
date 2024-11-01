import * as defaults from "../../../shared/defaults";
import fs from 'fs';
import path from 'path';
import getUser from "../data/getUser";

export default function run(app, ROOT:string, database) {
  app.get("/api/user/:username", async (req, res) => {
    try {
      const result = await getUser(database, req.params.username);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).send("Erreur lors de la récupération de l'utilisateur.");
    }
  });
}