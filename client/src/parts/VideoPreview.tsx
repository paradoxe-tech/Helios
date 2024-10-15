export function VideoPreview({ videoData }) {
  let video = videoData.video;
  let scores = videoData.scores;

  return (
    <div className="max-w-xs relative">
      {/* Thumbnail */}
      <div className="relative">
        <img src={video.thumbnail} alt={video.title}
          className="w-full aspect-[16/9] object-cover rounded-lg" />

        {/* Score Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <ScoreBadge label="S" color="grey" score={scores.score} />
          <ScoreBadge label="A" color="orange" score={scores.predicted_appreciation} />
          <ScoreBadge label="U" color="yellow" score={scores.tournesol_recommendability} />
          <ScoreBadge label="G" color="red" score={scores.platform_performance} />
        </div>

        <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-1 rounded">
          {video.duration}
        </span>
      </div>

      {/* Video Info */}
      <div className="flex mt-3">
        <img src={video.avatar} alt={video.author} className="w-10 h-10 rounded-full mr-3" />
        <div>
          <h3 className="text-sm font-semibold text-gray-800">{video.title}</h3>
          <p className="text-xs text-gray-600">{video.author}</p>
        </div>
      </div>
    </div>
  );
}

function ScoreBadge({ label, score, color }) {
  if(score == -2) return <></>
  return (
    <div className="relative w-6 h-6 flex items-center justify-center rounded-full bg-black"
      style={{
        background: `conic-gradient(${color} ${score * 360}deg, black ${score * 360}deg)`,
      }}>
    </div>
  );
}