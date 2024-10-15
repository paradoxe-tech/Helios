import Video from "./Video";
import { User, VideoData, ScoreParams } from "../../../shared/types";

/**
 * returns a list of videos associated with detailed scores, sorted by
 * overall score and limited to `n` elements.
 * @param {number} n : number of elements to be returned
 * @param {ScoreParams} params : dictionnary of the recommender parameters
 * @returns {Array<VideoData>} : a sorted list of scored video
 */
async function recommend(
  videosIds: Array<string>,
  n: number,
  user: User,
  params: ScoreParams,
): Promise<Array<VideoData>> {
  let videos = [];

  for (let id of videosIds) {
    let video = await Video.create(id, process.env["YOUTUBE_API_KEY"]);

    // pre-filter the dataset to avoid useless compute units
    if (params.content_language.length == 0) {}
    else if (!params.content_language.includes(video.language)) continue;
    if (!params.allow_sensitive && video.sensitive) continue;
    if (params.strict_child_mode && !video.childish) continue;

    videos.push({
      video: video,
      scores: await video.score(user, params),
    });
  }

  let results = videos.sort((a: VideoData, b: VideoData) => {
    let scoreA: number = a.scores.score;
    let scoreB: number = b.scores.score;

    if (scoreA > scoreB) return -1;
    if (scoreA < scoreB) return 1;
    return 0;
  });

  return results.slice(0, n);
}

export default recommend;