import * as Norm from './Normalize';
import Papa from 'papaparse';
import * as fs from 'fs';
import { User, VideoData, VideoScore, Criterias, ScoreParams } from './types';

export default class Video {

  id: string;
  title!: string;
  author!: string;
  thumbnail!: string;
  language!: string;
  tags!: Array<string>;
  views!: Array<string>;
  release!: Date;

  constructor(id:string) {
    this.id = id;
    this.views = []
  }

  static async create(id:string, apiKey:string) : Promise<Video> {
    let video = new Video(id)
    let url = 'https://www.googleapis.com/youtube/v3/videos'
    url += `?id=${id}&key=${apiKey}`;
    url += `&part=snippet,statistics,contentDetails`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`YTGET(V) fail: ${response.statusText}`)
      const data = await response.json();

      // if no items, video doesn't exist
      if (data.items.length == 0) throw new Error(`No video for ${id}`);
      const result = data.items[0];

      console.log(result)

      // setting all the video properties from youtube data
      video.id = id;
      video.title = result.snippet.title;
      video.author = result.snippet.channelTitle;
      video.tags = result.snippet.tags;
      video.thumbnail = result.snippet.thumbnails.high.url;
      video.language = result.snippet.defaultAudioLanguage;
      video.release = new Date(result.snippet.publishedAt);
      video.duration = result.contentDetails.duration;

      url = `https://www.googleapis.com/youtube/v3/channels`
      url +=`?part=snippet&id=${result.snippet.channelId}&key=${apiKey}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`YTGET(C) fail: ${response.statusText}`);
        const data = await response.json();
        if (data.items.length === 0) throw new Error(`No channel for ${channelId}`);
        const avatarUrl = data.items[0].snippet.thumbnails.default.url;

        video.authorAvatar = avatarUrl
      } catch (error) {
        video.authorAvatar = "none"
      }
      
      // a new Video instance will be returned
      return video
    } catch (error) {
      throw new Error(`Error fetching video data: ${error}`);
    }
  }

  // checks if user saw this video
  isSeenBy(user:User): boolean {
    return !!user.history.find(v => v.id == this.id)
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
    let tournesol:Criterias = await new Promise((resolve, reject) => {
      const criterias:Criterias = {};

      // will search video scores through Tournesol CSV file
      const fileStream = fs.createReadStream("./tournesol.csv");
      Papa.parse(fileStream, {
        header: true, // will use first line to name columns
        step: (result:{data: VideoData}) => {
          const row = result.data as VideoData;

          // is one of the video criterias
          if(row.video === this.id) {
            criterias[row.criteria] = {
              score: +row.score, // converted to numbers
              uncertainty: +row.uncertainty
            }
          }
        }, // promise resolving / rejection handling
        complete: () => resolve(criterias),
        error: (error:string) => reject(error)
      });

    })

    // if no tournesol data, set scalar to 0
    if(!tournesol['largely_recommended']) {
      console.info(`No Tournesol score found ; setting lU to 0.`)
      return -2;
    };

    // keep the sign while /100 and normalizing to [0,1]
    let score = tournesol['largely_recommended'].score;
    let sign = score > 0 ? 1 : -1;

    return Norm.cut(Math.abs(score) / 100) * sign;
  }

  /**
  * this method gives the predicted end-user appreciation
  * of the current video ; based on their inferred preferences,
  * their followed channels and their recent activity on Helios.
  * @param {User} user : the platform end-user object
  * @returns {Promise<number>} : the appreciation score component
  */
  async A(user:User): Promise<number> {
    let proba = 0;

    if(user.following.length == 0 && user.history.length == 0) {
      console.info(`Nothing can be inferred from user data ; setting lA to 0.`)
      return -2;
    }

    // user is following the author
    if(user.following.includes(this.author)) proba += 0.5;

    // user saw a lot of videos from the author
    proba += Norm.minmax(user.history.filter(v => {
      return v.author == this.author && v.id !== this.id;
    }).length, 0, 3, 0, 0.5);

    // video is already seen by user
    if(this.isSeenBy(user)) proba *= 0.2;

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
  async score(user:User, params:ScoreParams): Promise<VideoScore> {
    let res = 0
    let parameters = {...params}

    // compute the values asynchronously
    let G = await this.G()
    if(G == -2) parameters.lG = 0;
    let A = await this.A(user)
    if(A == -2) parameters.lA = 0;
    let U = await this.U()
    if(U == -2) parameters.lU = 0;

    // scale each value by its prodived scalar
    if(params.lG > 0) res += parameters.lG * G
    if(params.lU > 0) res += parameters.lU * U
    if(params.lA > 0) res += parameters.lA * A

    // defines the total as the sum of coefficients
    let total = parameters.lG + parameters.lU + parameters.lA

    return {
      platform_performance: G,
      predicted_appreciation: A,
      tournesol_recommendability: U,
      score: total > 0 ? Norm.minmax(res, 0, total) : 0
    }
  }
}