import Video from "../server/src/algo/Video";

export type User = {
  username: string;
  history: Array<{ id: string; author: string }>;
  following: Array<string>;
  followers: Array<string>;
};

export type VideoData = {
  scores: VideoScore;
  video: Video;
};

export type ScoreParams = {
  lG: number;
  lU: number;
  lA: number;
  allow_sensitive: boolean;
  content_language: Array<string>;
  strict_child_mode: boolean;
};

export type TournesolRow = {
  video: string;
  criteria: string;
  score: string;
  uncertainty: string;
};

export type VideoScore = {
  platform_performance: number;
  predicted_appreciation: number;
  tournesol_recommendability: number;
  score: number;
};
