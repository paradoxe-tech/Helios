export function VideoPreview({ videoData, onMouseEnter }) {
  let video = videoData.video;
  let scores = videoData.scores;

  return (
    <div className="max-w-xs relative" onMouseEnter={onMouseEnter}>
      {/* Thumbnail */}
      <div className="relative">
        <img src={video.thumbnail} alt={video.title}
          className="w-full aspect-[16/9] object-cover rounded-2xl" />
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