export default function HoverVideoCard({ tool }: { tool: Tool }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);

  const handleStart = () => {
    setIsActive(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleStop = () => {
    setIsActive(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      // aspect-square রাখা হয়েছে যাতে বক্সগুলো ১:১ রেশিওতে থাকে
      className={`relative overflow-hidden bg-zinc-950 border border-zinc-800 rounded-2xl md:rounded-3xl cursor-pointer select-none aspect-square`}
      style={{ 
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none" 
      }}
      onMouseEnter={handleStart}
      onMouseLeave={handleStop}
      onTouchStart={handleStart}
      onTouchEnd={handleStop}
      onTouchCancel={handleStop}
      onContextMenu={(e) => e.preventDefault()} 
    >
      <img 
        src={tool.imagePath} 
        alt={tool.name} 
        draggable={false}
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
          isActive ? "opacity-0" : "opacity-100"
        }`}
      />
      
      <video
        ref={videoRef}
        src={tool.videoPath}
        muted
        loop
        playsInline 
        draggable={false}
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 md:p-6 flex flex-col justify-end pointer-events-none">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-1 drop-shadow-md">
          {tool.name}
        </h3>
        <p className={`text-sm text-zinc-300 drop-shadow-md transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-0"
        } line-clamp-2`}>
          {tool.description}
        </p>
      </div>
    </div>
  );
}
