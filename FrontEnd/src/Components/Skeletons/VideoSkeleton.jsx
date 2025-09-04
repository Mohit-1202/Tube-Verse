
export default function VideoSkeleton() {
  return (
    <div className="animate-pulse rounded-xl overflow-hidden p-2">
      <div className="bg-gray-700 h-40 w-full rounded-xl mb-3"></div>

      <div className="flex">
        
        <div className="bg-gray-700 h-10 w-10 rounded-full mr-3"></div>
        <div className="flex-1 space-y-2">
          <div className="bg-gray-700 h-4 w-3/4 rounded"></div>
          <div className="bg-gray-700 h-3 w-1/2 rounded"></div>
          <div className="bg-gray-700 h-3 w-1/3 rounded"></div>
        </div>
      </div>
    </div>
  );
}
