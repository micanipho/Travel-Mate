import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates confetti effect for celebrations
 */
export function createConfetti(container: HTMLElement, amount = 50) {
  const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#A78BFA', '#F9A8D4'];
  
  for (let i = 0; i < amount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'absolute w-2.5 h-2.5 opacity-0 z-50';
    
    // Random styles
    const color = colors[Math.floor(Math.random() * colors.length)];
    const rotation = Math.random() * 360;
    const x = (Math.random() - 0.5) * 500;
    const y = Math.random() * 500;
    
    confetti.style.backgroundColor = color;
    confetti.style.transform = `rotate(${rotation}deg) translate3d(0, 0, 0)`;
    
    // Position randomly
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = '0';
    
    // Animation
    confetti.animate([
      { opacity: 1, transform: `rotate(${rotation}deg) translate3d(0, 0, 0)` },
      { opacity: 0, transform: `rotate(${rotation + 90}deg) translate3d(${x}px, ${y}px, 0)` }
    ], {
      duration: 3000,
      easing: 'ease-in-out',
      fill: 'forwards'
    });
    
    container.appendChild(confetti);
    
    // Remove after animation
    setTimeout(() => {
      confetti.remove();
    }, 3000);
  }
}

/**
 * Returns the appropriate color class for a grade level
 */
export function getGradeColor(grade: number) {
  switch(grade) {
    case 0: return "bg-[#FFD166] text-dark";
    case 1: return "bg-[#F9A8D4] text-white";
    case 2: return "bg-[#A78BFA] text-white";
    case 3: return "bg-[#7ED6DF] text-white";
    case 4: return "bg-[#6BD475] text-white";
    case 5: return "bg-[#4ECDC4] text-white";
    case 6: return "bg-[#FF4757] text-white";
    default: return "bg-[#FF6B6B] text-white";
  }
}

/**
 * Returns the appropriate color class for a subject
 */
export function getSubjectColor(subject: string) {
  switch(subject.toLowerCase()) {
    case "academics": return "bg-blue-400 text-dark";
    case "technology": return "bg-purple-400 text-white";
    case "communication": return "bg-pink-400 text-white";
    case "creativity": return "bg-green-400 text-white";
    default: return "bg-[#6BD475] text-white";
  }
}

/**
 * Format grade level for display
 */
export function formatGradeLevel(grade: number): string {
  return grade === 0 ? "K" : `Grade ${grade}`;
}
