import React, { useState, useEffect } from 'react';
import { X, Server, ExternalLink } from 'lucide-react';
import { Button } from './ui/Button';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentBaseUrl: string;
  onSave: (baseUrl: string) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose, currentBaseUrl, onSave }) => {
  const [url, setUrl] = useState(currentBaseUrl);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUrl(currentBaseUrl);
    }
  }, [currentBaseUrl, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop - Softer blur */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div 
        className={`relative w-full max-w-md bg-background/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/30 ring-1 ring-white/10 transition-all duration-300 ease-out overflow-hidden ${
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Server className="h-5 w-5 text-primary/80" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Settings</h2>
              <p className="text-xs text-muted-foreground/60">Configure your connection</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground/50 hover:text-foreground hover:bg-white/5 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="px-6 pb-6 space-y-5">
          <div className="space-y-3">
            <label htmlFor="ollamaUrl" className="block text-sm font-medium text-foreground/80">
              Ollama API URL
            </label>
            <input
              id="ollamaUrl"
              type="url"
              className="w-full h-12 px-4 rounded-xl bg-secondary/60 text-foreground/90 placeholder:text-muted-foreground/40 ring-1 ring-white/10 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all duration-200"
              placeholder="http://localhost:11434"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground/50 leading-relaxed">
              Enter your Ollama server URL. Leave empty for default (<code className="px-1.5 py-0.5 rounded-md bg-secondary/50 text-xs text-foreground/70">localhost:11434</code>).
            </p>
          </div>

          {/* Help Link */}
          <a
            href="https://ollama.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground/50 hover:text-primary/80 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Learn more about Ollama</span>
          </a>
        </div>

        {/* Footer - Softer separation */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-secondary/20">
          <Button variant="ghost" onClick={onClose} className="px-4 text-muted-foreground/70">
            Cancel
          </Button>
          <Button onClick={() => { onSave(url); onClose(); }} className="px-6">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
