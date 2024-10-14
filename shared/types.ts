export type User = {
  username: string;
  history: Array<{id: string, author: string}>;
  following: Array<string>;
  followers: Array<string>;
}

export type VideoData = {
  scores: ScoreParams
}

export type ScoreParams = {
  lG:number, 
  lU:number, 
  lA:number,
  allow_sensitive: boolean,
  content_language: string
};

export type Criterias = {
  [key: string]: { 
    score:number, 
    uncertainty:number 
  }
};

export type TournesolRow = {
  video: string,
  criteria: string,
  score: string,
  uncertainty: string
};

export type VideoScore = {
  platform_performance: number,
  predicted_appreciation: number,
  tournesol_recommendability: number,
  score: number
};