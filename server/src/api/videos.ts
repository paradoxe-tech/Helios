import recommend from "../algo/recommend";
import randsubset from '../algo/randsubset';
import * as defaults from "../../../shared/defaults";
import fs from 'fs';
import path from 'path';
import getUser from "../data/getUser";

export default function run(app, ROOT:string, database) {
  app.get("/api/videos/:username/:n", async (req, res) => {
    let n = +req.params.n ? +req.params.n : 50;

    try {
      let user = await getUser(database, req.params.username);

      let _videosIds = fs.readFileSync(
        path.join(ROOT, "assets/videos.txt"), { encoding: "utf-8" }
      ).split("\n");

      const u = Math.floor(_videosIds.length * 0.95)
      _videosIds = Array.from(randsubset(_videosIds, n, u));

      let videos = await recommend(
        _videosIds, n,
        user,
        defaults.defaultScoreParams, // to be changed to user's params
      );

      res.json(videos);
    } catch(err) {
      res.status(500).send("Erreur lors de la récupération de l'utilisateur.");
      return null;
    }
  });
}