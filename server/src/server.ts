import express from 'express';
import recommend from './algo/recommend';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import * as defaults from '../../shared/defaults';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = path.resolve(__dirname, '../../')

const app = express();

// express middlewares for url and json format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/videos/:n', async (req, res) => {
  let n = (+req.params.n) ? (+req.params.n) : 50
  let _videosIds = fs.readFileSync(path.join(ROOT, "assets/videos.txt"), {encoding: "utf-8"}).split('\n')
  let videos = await recommend(_videosIds, n, defaults.devUser, defaults.defaultScoreParams);
  res.json(videos)
});

// serve static files from the React app
app.use(express.static(
  path.join(ROOT, '/client/dist')
));

// serve the React app for any route !== /api
app.get('*', (req, res) => {
  res.sendFile(path.join(ROOT, '/client/dist/index.html'));
});

app.listen(process.env.port || 8080);