import React from 'react';

interface CreditCircleProps {
  credits: number;
  maxCredits?: number;
}

export default function CreditCircle({ credits, maxCredits = 100 }: CreditCircleProps) {
  // Calculate percentage, ensuring it stays between 0 and 100
  const percentage = Math.max(0, Math.min(100, (credits / maxCredits) * 100));
  
  // SVG Math for the circular progress
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Dynamic color based on remaining credits
  let strokeColor = 'text-green-500'; // High credits
  if (percentage <= 50 && percentage > 20) strokeColor = 'text-yellow-500'; // Medium credits
  if (percentage <= 20) strokeColor = 'text-red-500'; // Low credits

  return (
    <div 
      className="relative inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 shrink-0"
      title={`${credits} / ${maxCredits} Credits Remaining`}
    >
      {/* 
        The SVG is rotated -90 degrees so the "fill" starts at the 12 o'clock position 
        instead of the default 3 o'clock position.
      */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
        {/* Background Circle (The "not filled" portion) */}
        <circle
          cx="22"
          cy="22"
          r={radius}
          className="text-zinc-800"
          strokeWidth="3"
          stroke="currentColor"
          fill="transparent"
        />
        
        {/* Foreground Circle (The "filled" portion) */}
        <circle
          cx="22"
          cy="22"
          r={radius}
          className={`${strokeColor} transition-all duration-500 ease-in-out`}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
        />
      </svg>

      {/* The number in the center */}
      <span className="absolute text-xs md:text-sm font-bold text-zinc-200 tabular-nums">
        {credits}
      </span>
    </div>
  );
}
