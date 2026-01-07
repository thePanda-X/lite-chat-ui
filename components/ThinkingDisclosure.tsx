import React, { useState } from 'react';
import { ChevronDown, BrainCircuit, Lightbulb } from 'lucide-react';

interface ThinkingDisclosureProps {
  content: string;
}

export const ThinkingDisclosure: React.FC<ThinkingDisclosureProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!content) return null;

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl transition-all duration-200 group ${
          isOpen 
            ? 'bg-primary/10 text-primary/80' 
            : 'bg-secondary/30 text-muted-foreground/60 hover:bg-secondary/50 hover:text-foreground/80'
        }`}
      >
        <BrainCircuit className={`h-4 w-4 transition-colors ${isOpen ? 'text-primary/70' : 'text-muted-foreground/50 group-hover:text-foreground/60'}`} />
        <span className="text-[11px] uppercase tracking-wider font-semibold">Thinking Process</span>
        <ChevronDown className={`h-4 w-4 transition-all duration-200 ${isOpen ? 'rotate-180 text-primary/70' : 'text-muted-foreground/50 group-hover:text-foreground/60'}`} />
      </button>

      <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="mt-3 relative">
            {/* Content Box - No hard borders */}
            <div className="bg-secondary/20 rounded-2xl p-4 shadow-inner">
              <div className="flex items-start gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-amber-400/70 flex-shrink-0 mt-0.5" />
                <span className="text-[10px] uppercase tracking-wider text-amber-400/60 font-semibold">Internal Reasoning</span>
              </div>
              <div className="text-sm text-muted-foreground/70 font-mono whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                {content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
