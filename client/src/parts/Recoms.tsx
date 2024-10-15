import { useEffect, useState } from "react";
import { VideoPreview } from "./VideoPreview";
import { Tags } from "./Tags";
import { Switch } from "../aria/Switch";
import * as types from '../../../shared/types';
import * as defaults from '../../../shared/defaults';

const tags = defaults.tags;

export function Recoms() {
  const [selectedTag, setSelectedTag] = useState("All");
  const [videos, setVideos] = useState<types.VideoData[]>([]);

  useEffect(() => {
    fetch("/api/videos/10")
      .then((response) => response.json())
      .then((data) => setVideos(data))
      .catch((error) => console.error("Error fetching videos:", error));
  }, []);

  return (
    <div className="px-6 w-full py-4 min-h-screen bg-white">
      <div className="flex justify-between mb-3">
        <Tags tags={tags} selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
        <Switch>
          <div className="indicator" />
          Tournesol
        </Switch>
      </div>
      <VideoGrid videos={videos} />
    </div>
  );
}

function VideoGrid({ videos }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {videos.map((videoData:types.VideoData, index: number) => {
        return (
          <VideoPreview
            key={index}
            videoData={videoData}
          />
        );
      })}
    </div>
  );
}
