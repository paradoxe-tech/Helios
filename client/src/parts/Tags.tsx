import { Button } from "../aria/Button"

export function Tags({ tags, selectedTag, setSelectedTag }) {
  return (
    <div className="flex space-x-3 overflow-x-auto py-2">
      {tags.map((tag) => (
        <button key={tag}
          className={`px-4 py-1 rounded-lg border ${selectedTag === tag ? "bg-black text-white" : "bg-gray-200 text-gray-800"}`}
          onClick={() => setSelectedTag(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}