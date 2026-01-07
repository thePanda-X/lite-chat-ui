import React from 'react';
import { Zap, Activity, Gauge, Clock } from 'lucide-react';
import { UsageMetadata, Provider } from '../types';

interface StatsDisplayProps {
  usage?: UsageMetadata;
  timing?: number;
  model?: string;
  provider?: Provider;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ usage, timing, model, provider }) => {
  if (!usage && !timing) return null;

  const outputTokens = usage?.candidatesTokenCount || 0;
  const durationInSeconds = timing ? timing / 1000 : 0;
  const tokensPerSecond = durationInSeconds > 0 ? (outputTokens / durationInSeconds).toFixed(1) : null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground/60 select-none">
      {usage && (
        <>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/30" title="Input Tokens">
            <Activity className="h-3 w-3 text-muted-foreground/40" />
            <span className="font-mono font-medium text-foreground/60">{usage.promptTokenCount || 0}</span>
            <span className="text-muted-foreground/40">in</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/30" title="Output Tokens">
            <Zap className="h-3 w-3 text-muted-foreground/40" />
            <span className="font-mono font-medium text-foreground/60">{usage.candidatesTokenCount || 0}</span>
            <span className="text-muted-foreground/40">out</span>
          </div>
        </>
      )}
      
      {timing && (
        <>
          {tokensPerSecond && parseFloat(tokensPerSecond) > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10" title="Generation Speed">
              <Gauge className="h-3 w-3 text-emerald-400/70" />
              <span className="font-mono font-bold text-emerald-400/80">{tokensPerSecond}</span>
              <span className="text-emerald-400/50">t/s</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/30" title="Duration">
            <Clock className="h-3 w-3 text-muted-foreground/40" />
            <span className="font-mono font-medium text-foreground/60">{(timing / 1000).toFixed(2)}s</span>
          </div>
        </>
      )}
    </div>
  );
};
