import recommend from "../algo/recommend";
import randsubset from '../algo/randsubset';
import * as defaults from "../../../shared/defaults";
import fs from 'fs';
import path from 'path';

export default function run(app, ROOT:string) {
  app.get("/api/videos/:n", async (req, res) => {
    let n = +req.params.n ? +req.params.n : 50;

    let _videosIds = fs.readFileSync(
      path.join(ROOT, "assets/videos.txt"), { encoding: "utf-8" }
    ).split("\n");

    const u = Math.floor(_videosIds.length * 0.95)
    _videosIds = Array.from(randsubset(_videosIds, n, u));

    let videos = await recommend(
      _videosIds, n,
      defaults.devUser,
      defaults.defaultScoreParams,
    );

    res.json(videos);
  });
}