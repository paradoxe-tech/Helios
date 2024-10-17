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

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function flatten<T>(array: T[][]): T[] {
  return array.reduce((acc, val) => acc.concat(val), []);
}

// preload CSV once when app starts
await preloadTournesol(path.join(ROOT, "/assets/tournesol.csv"));

export default class Video {
  id!: string;
  title!: string;
  author!: string;
  channel!: string;
  thumbnail!: string;
  language!: string;
  tags!: Array<string>;
  views!: Array<string>;
  release!: Date;
  duration!: string;
  avatar!: string;
  sensitive!: boolean;
  childish!: boolean;

  constructor() {
    this.views = [];
  }

  static async request(ids: string[], apiKey:string): Promise<Video[]> {
    let videos = await Promise.all(chunkArray(ids, 50).map(async subIds => {
      return await Video.request50max(subIds, apiKey);
    }))

    return flatten(videos)
  }

  static async request50max(ids: string[], apiKey: string): Promise<Video[]> {
    let url = "https://youtube.googleapis.com/youtube/v3/videos";
    url += `?key=${apiKey}&id=${ids.join(',')}`;
    url += `&part=snippet,statistics,contentDetails,status`;

    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`YTGET(V) fail: ${response.statusText}`);
      const data = await response.json();

      if (data.items.length === 0) throw new Error(`No videos found`);

      const videos = await Promise.all(
        data.items.map(async (result: any) => {
          let video = new Video();
          video.fill(result);

          let channelUrl = `https://www.googleapis.com/youtube/v3/channels`
          channelUrl += `?part=snippet&id=${result.snippet.channelId}&key=${apiKey}`;

          try {
            const channelResponse = await fetch(channelUrl);
            if (!channelResponse.ok)
              throw new Error(`YTGET(C) fail: ${channelResponse.statusText}`);
            const channelData = await channelResponse.json();

            if (channelData.items.length === 0)
              throw new Error(`No channel for ${result.snippet.channelId}`);
            const avatarUrl = channelData.items[0].snippet.thumbnails.default.url;

            video.avatar = avatarUrl;
          } catch (error) {
            video.avatar = "none";
          }

          return video;
        })
      );

      return videos;
    } catch (error) {
      throw new Error(`Error fetching video data: ${error}`);
    }
  }

  fill(ytvid) {
    this.id = ytvid.id;
    this.title = ytvid.snippet.title;
    this.author = ytvid.snippet.channelTitle;
    this.channel = ytvid.snippet.customUrl;
    this.tags = ytvid.snippet.tags;
    this.thumbnail = ytvid.snippet.thumbnails.high.url;
    this.language = ytvid.snippet.defaultAudioLanguage;
    this.release = new Date(ytvid.snippet.publishedAt);
    this.duration = parseDuration(ytvid.contentDetails.duration);
    this.sensitive = !ytvid.status.embeddable;
    this.childish = ytvid.status.madeForKids;
  }

  // checks if user saw this video
  isSeenBy(user:types.User): boolean {
    return !!user.history.find((v) => v.id == this.id);
    // return this.views.includes(user.username)
  }
}

function parseDuration(duration: string): string {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = duration.match(regex);

  const hours = parseInt(matches?.[1] || '0', 10);
  const minutes = parseInt(matches?.[2] || '0', 10);
  const seconds = parseInt(matches?.[3] || '0', 10);

  const formatted = [
    hours > 0 ? String(hours).padStart(2, '0') : null,
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0')
  ].filter(Boolean).join(':');

  return formatted;
}