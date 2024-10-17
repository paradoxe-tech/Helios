import Video from "./Video";
import * as types from "../../../shared/types";

 /**
 * returns a list of videos associated with detailed scores, sorted by
 * overall score and limited to `n` elements.
 * @param {number} n : number of elements to be returned
 * @param {ScoreParams} params : dictionnary of the recommender parameters
 * @returns {Array<VideoData>} : a sorted list of scored video
 */
async function recommend(vidIds: string[], n: number, user: types.User, params: types.ScoreParams): Promise<types.VideoData[]> {
  try {
    // fetch all videos in one batch request
    const videos = await Video.request(vidIds, process.env["YOUTUBE_API_KEY"]);

    const filteredVideos = await Promise.all(
      videos.map(async (video) => {
        // apply filters based on parameters
        if (params.strict_child_mode && !video.childish) return null;
        if (!params.allow_sensitive && video.sensitive) return null;
        if (params.content_language.length) {
          if(!params.content_language.includes(video.language)) return null;
        }

        const scores = await video.score(user, params);
        return { video, scores };
      })
    );

    // filter null values, sort by score, and return top N results
    return filteredVideos
      .filter(v => v !== null)
      .sort((a, b) => b.scores.score - a.scores.score)
      .slice(0, n);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default recommend;