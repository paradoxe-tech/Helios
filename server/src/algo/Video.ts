import * as Norm from "./Normalize";
import Papa from "papaparse";
import fs from "fs";
import * as types from "../../../shared/types";

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = path.resolve(__dirname, '../../../');

const tournesolMap = new Map();

async function preloadTournesol(csvPath:string) {
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
}

// preload CSV once when app starts
await preloadTournesol(path.join(ROOT, "/assets/tournesol.csv"));

export default class Video {
  id: string;
  title!: string;
  author!: string;
  thumbnail!: string;
  language!: string;
  tags!: Array<string>;
  views!: Array<string>;
  release!: Date;
  duration!: string;
  avatar!: string;
  sensitive!: boolean;
  childish!: boolean;

  constructor(id: string) {
    this.id = id;
    this.views = [];
  }

  static async create(id: string, apiKey: string): Promise<Video> {
    let video = new Video(id);
    let url = "https://www.googleapis.com/youtube/v3/videos";
    url += `?id=${id}&key=${apiKey}`;
    url += `&part=snippet,statistics,contentDetails,status`;

    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`YTGET(V) fail: ${response.statusText}`);
      const data = await response.json();

      // if no items, video doesn't exist
      if (data.items.length == 0) throw new Error(`No video for ${id}`);
      const result = data.items[0];

      // setting all the video properties from youtube data
      video.id = id;
      video.title = result.snippet.title;
      video.author = result.snippet.channelTitle;
      video.tags = result.snippet.tags;
      video.thumbnail = result.snippet.thumbnails.high.url;
      video.language = result.snippet.defaultAudioLanguage;
      video.release = new Date(result.snippet.publishedAt);
      video.duration = result.contentDetails.duration;
      video.sensitive = !result.status.embeddable;
      video.childish = result.status.madeForKids;

      url = `https://www.googleapis.com/youtube/v3/channels`;
      url += `?part=snippet&id=${result.snippet.channelId}&key=${apiKey}`;

      try {
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`YTGET(C) fail: ${response.statusText}`);
        const data = await response.json();
        if (data.items.length === 0)
          throw new Error(`No channel for ${result.snippet.channelId}`);
        const avatarUrl = data.items[0].snippet.thumbnails.default.url;

        video.avatar = avatarUrl;
      } catch (error) {
        video.avatar = "none";
      }

      // a new Video instance will be returned
      return video;
    } catch (error) {
      throw new Error(`Error fetching video data: ${error}`);
    }
  }

  // checks if user saw this video
  isSeenBy(user:types.User): boolean {
    return !!user.history.find((v) => v.id == this.id);
    // return this.views.includes(user.username)
  }

  /**
   * this method calculates the platform performance of the
   * video, using metrics like : clicks/impression ratio,
   * watchtime, comments, likes and followings (amongst others).
   * @returns {Promise<number>} : the plaform performance component
   */
  async G(): Promise<number> {
    return 0.5;
  }

  /**
   * this method retrives the Tournesol recommandability bias
   * by finding its value through the CSV database provided by
   * the association on their website, using the video id.
   * @returns {Promise<number>} : the recommendability score component
   */
  async U(): Promise<number> {
    const tournesol = tournesolMap.get(this.id);

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
  async A(user:types.User): Promise<number> {
    let proba = 0;

    if (user.following.length == 0 && user.history.length == 0) return -2;

    // user is following the author
    if (user.following.includes(this.author)) proba += 0.5;

    // user saw a lot of videos from the author
    proba += Norm.minmax(
      user.history.filter((v) => {
        return v.author == this.author && v.id !== this.id;
      }).length, 0, 3, 0, 0.5,
    );

    // video is already seen by user
    if (this.isSeenBy(user)) proba *= 0.2;

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
  async score(user:types.User, params:types.ScoreParams): Promise<types.VideoScore> {
    let res = 0;
    let parameters = { ...params };

    const [G, A, U] = await Promise.all([this.G(), this.A(user), this.U()]);

    // update scalars if scores are not available
    if (G == -2) parameters.lG = 0;
    if (A == -2) parameters.lA = 0;
    if (U == -2) parameters.lU = 0;

    // scale each value by its prodived scalar
    if (params.lG > 0) res += parameters.lG * G;
    if (params.lU > 0) res += parameters.lU * U;
    if (params.lA > 0) res += parameters.lA * A;

    // defines the total as the sum of coefficients
    let total = parameters.lG + parameters.lU + parameters.lA;

    return {
      platform_performance: G,
      predicted_appreciation: A,
      tournesol_recommendability: U,
      score: total > 0 ? Norm.minmax(res, 0, total) : 0,
    };
  }
}
