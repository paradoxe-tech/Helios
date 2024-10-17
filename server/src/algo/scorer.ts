import * as Norm from "./Normalize";
import Papa from "papaparse";
import fs from "fs";
import * as types from "../../../shared/types";
import Video from "./Video";

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = path.resolve(__dirname, '../../../');

const tournesolMap = new Map();

// preload CSV once when app starts
(async (csvPath:string) => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(csvPath);
    Papa.parse(fileStream, {
      header: true,
      step: (result:{data: types.TournesolRow}) => {
        const row = result.data;
        if (row.video && row.criteria == "largely_recommended") {
          tournesolMap.set(row.video, {
            score: +row.score,
            uncertainty: +row.uncertainty,
          });
        }
      },
      complete: () => resolve(null),
      error: (error) => reject(error),
    });
  });
})(path.join(ROOT, "/assets/tournesol.csv"))

/**
 * this method calculates the platform performance of the
 * video, using metrics like : clicks/impression ratio,
 * watchtime, comments, likes and followings (amongst others).
 * @returns {Promise<number>} : the plaform performance component
 */
export async function G(video:Video): Promise<number> {
  return 0.5;
}

/**
 * this method retrives the Tournesol recommandability bias
 * by finding its value through the CSV database provided by
 * the association on their website, using the video id.
 * @returns {Promise<number>} : the recommendability score component
 */
export async function U(video:Video): Promise<number> {
  const tournesol = tournesolMap.get(video.id);

  // if no tournesol data, set scalar to 0
  if (!tournesol || !tournesol.score) return -2;
  let score = tournesol.score;

  return score > 0 ? Norm.cut(score / 100) : 0;
}

/**
 * this method gives the predicted end-user appreciation
 * of the current video ; based on their inferred preferences,
 * their followed channels and their recent activity on Helios.
 * @param {User} user : the platform end-user object
 * @returns {Promise<number>} : the appreciation score component
 */
export async function A(video:Video, user:types.User): Promise<number> {
  let proba = 0;

  if (user.following.length == 0 && user.history.length == 0) return -2;

  // user is following the channel
  if (user.following.includes(video.channel)) proba += 0.5;

  // user saw a lot of videos from the channel
  proba += Norm.minmax(
    user.history.filter((v) => {
      return v.channel == video.channel && v.id !== video.id;
    }).length, 0, 3, 0, 0.5,
  );

  // video is already seen by user
  if (video.isSeenBy(user)) proba *= 0.2;

  return Norm.cut(proba);
}

/**
 * the final score is defined by a sum of the platform
 * performance value (G), the recommendability score (U)
 * and the predicted user appreciation (A) ; weighted by the
 * lambda coefficients provided for each of these values.
 * @param {User} user : the platform end-user object
 * @param {ScoreParams} params : a dictionnary of the lambda scalars
 * @returns {Promise<VideoScore>} : a dictionnary detailing the score
 */
export async function evaluate(
  video:Video, 
  user:types.User, 
  params:types.ScoreParams
): Promise<types.VideoScore> {

  let res = 0;
  let parameters = { ...params };

  const [Gs, As, Us] = await Promise.all([G(video), A(video, user), U(video)]);

  // update scalars if scores are not available
  if (Gs == -2) parameters.lG = 0;
  if (As == -2) parameters.lA = 0;
  if (Us == -2) parameters.lU = 0;

  // scale each value by its prodived scalar
  if (params.lG > 0) res += parameters.lG * Gs;
  if (params.lU > 0) res += parameters.lU * Us;
  if (params.lA > 0) res += parameters.lA * As;

  // defines the total as the sum of coefficients
  let total = parameters.lG + parameters.lU + parameters.lA;

  return {
    platform_performance: Gs,
    predicted_appreciation: As,
    tournesol_recommendability: Us,
    score: total > 0 ? Norm.minmax(res, 0, total) : 0,
  };
}