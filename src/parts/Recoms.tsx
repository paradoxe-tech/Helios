import { useState } from "react";
import { VideoPreview } from "./VideoPreview";
import HVideo from "../algo/Video";
import { Tags } from "./Tags";
import { Switch } from "../aria/Switch";

const tags = ["All", "Music", "Gaming", "News", "Sports", "Education", "Movies"];
const videosIds = [];
let videos = []

for(let id of videosIds) {
  videos.push(await HVideo.create(id, "AIzaSyC-PFWZcaxi9JKY0-X1D51KiIU-J8NHnqY"))
}

export function Recoms() {
  const [selectedTag, setSelectedTag] = useState("All");

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
      {videos.map((video:HVideo, index:number) => {
      console.log(index, video)
        return (
          <VideoPreview
            key={index}
            thumbnail={video.thumbnail}
            title={video.title}
            views={video.views.length}
            duration={video.duration}
            channel={video.author}
            avatar={video.authorAvatar}
          />
      )
      })}
    </div>
  );
}