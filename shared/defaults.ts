import * as types from "../../../shared/types";

export const defaultScoreParams:types.ScoreParams = {
  lU: 1,
  lA: 1,
  lG: 1,
  allow_sensitive: false,
  strict_child_mode: false,
  content_language: []
}

export const devUser:types.User = {
  username: "dev",
  history: [],
  following: [],
  followers: [],
}

export const guestUser:types.User = {
  username: "guest",
  history: [],
  following: [],
  followers: [],
}