import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ value, onChange, options, placeholder = "Select..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="relative flex-1" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-full items-center justify-between rounded-xl bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 min-w-[160px] hover:bg-white/5 transition-all duration-200 group"
      >
        <span className="truncate font-medium text-foreground/90">
          {selectedOption ? selectedOption.label : <span className="text-muted-foreground/50">{placeholder}</span>}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground/50 transition-transform duration-200 ${isOpen ? 'rotate-180 text-foreground/70' : ''} group-hover:text-foreground/70`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 max-h-72 w-full min-w-[200px] overflow-hidden rounded-2xl bg-popover/95 backdrop-blur-xl text-popover-foreground shadow-2xl shadow-black/20 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
          <div className="p-2 max-h-64 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground/50">
                No models available
              </div>
            ) : (
              options.map((option) => (
                <div
                  key={option.value}
                  className={`relative flex cursor-pointer select-none items-center rounded-xl py-2.5 px-3 text-sm outline-none transition-all duration-150 ${
                    option.value === value 
                      ? 'bg-primary/15 text-foreground' 
                      : 'hover:bg-white/5 text-foreground/80 hover:text-foreground'
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="font-medium truncate">{option.label}</span>
                    {option.description && (
                      <span className="text-xs text-muted-foreground/50 truncate">{option.description}</span>
                    )}
                  </div>
                  {option.value === value && (
                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                      <Check className="h-3 w-3 text-primary" />
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
