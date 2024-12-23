import { useEffect, useState } from "react";
import { VideoPreview } from "./VideoPreview";
import { Tags } from "./Tags";
import { Parameters } from "./Parameters";
import * as types from '../../../shared/types';
import * as defaults from '../../../shared/defaults';

const tags = defaults.tags;

export function Recoms({ setScores }) {
  const [selectedTag, setSelectedTag] = useState("Tout");
  const [videos, setVideos] = useState<types.VideoData[]>([]);
  const [parameters, setParameters] = useState(defaults.defaultScoreParams);

  useEffect(() => {
    fetch("/api/videos/dev/50")
      .then((response) => response.json())
      .then((data) => setVideos(data))
      .catch((error) => console.error("Error fetching videos:", error));
  }, []);

  return (
    <div className="px-6 w-full py-4 bg-white overflow-y-clip" style={{
        height: "calc(100vh - 70px)"
      }}>
      <div className="flex justify-between mb-3 items-center">
        <Tags tags={tags} selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
        <Parameters parameters={parameters} setParameters={setParameters} />
      </div>
      <VideoGrid videos={videos} setScores={setScores}/>
    </div>
  );
}

function VideoGrid({ videos, setScores }) {
  return (
    <div className="flex flex-wrap gap-6 h-full overflow-y-scroll">
      {videos.map((videoData:types.VideoData, index: number) => {
        return (
          <VideoPreview
            key={index}
            videoData={videoData}
            onMouseEnter={() => setScores(videoData.scores)}
          />
        );
      })}
    </div>
  );
}