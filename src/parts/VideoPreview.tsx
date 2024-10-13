export function VideoPreview({ thumbnail, title, views, duration, channel, avatar }) {
  return (
    <div className="max-w-xs">
      <div className="relative">
        <img src={thumbnail} alt={title} className="w-full aspect-[16/9] object-cover rounded-lg" />
        <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-1 rounded">
          {duration}
        </span>
      </div>

      <div className="flex mt-3">
        <img src={avatar} alt={channel} className="w-10 h-10 rounded-full mr-3" />
        <div>
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-600">{channel}</p>
          <p className="text-xs text-gray-600">{views} views</p>
        </div>
      </div>
    </div>
  );
}