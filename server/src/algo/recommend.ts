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
  const videos = await Promise.all(
    vidIds.map(async (id) => {
      try {
        // instanciate video (and request youtube API)
        const video = await Video.create(id, process.env["YOUTUBE_API_KEY"]);

        // filter according to provided parameters
        if (params.strict_child_mode && !video.childish) return null;
        if (!params.allow_sensitive && video.sensitive) return null;
        if (params.content_language.length !== 0) {
          if (!params.content_language.includes(video.language)) return null;
        } 

        // compute scores and return the results
        const scores = await video.score(user, params);
        return { video, scores };
      } catch (error) {
        return null;
      }
    }),
  );

  // keep only the existant ones and sort by score
  return videos
    .filter(v => v !== null)
    .sort((a, b) => b.scores.score - a.scores.score)
    .slice(0, n);
}

export default recommend;