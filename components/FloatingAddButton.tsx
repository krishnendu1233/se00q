import Link from "next/link";

export default function FloatingAddButton() {
  return (
    <Link 
      href="/submit"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-14 h-14 bg-cyan-600 hover:bg-cyan-500 text-black flex items-center justify-center rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-transform hover:scale-105 active:scale-95"
      aria-label="Add new analysis"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={2.5} 
        stroke="currentColor" 
        className="w-7 h-7"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </Link>
  );
}
