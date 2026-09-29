import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Bell, Timer as TimerIcon } from 'lucide-react';

export const KitchenTimer: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasFinished, setHasFinished] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setHasFinished(true);
            // Play gentle browser beep if possible
            try {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
              gain.gain.setValueAtTime(0.15, ctx.currentTime);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + 0.5);
            } catch (e) {
              // ignore audio ctx restrictions
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  const setTimerPreset = (minutes: number) => {
    setSecondsLeft(minutes * 60);
    setIsRunning(true);
    setHasFinished(false);
  };

  const toggleRun = () => {
    if (secondsLeft === 0) {
      setTimerPreset(3);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(0);
    setHasFinished(false);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-amber-900 text-amber-50 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TimerIcon className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-bold tracking-wide uppercase text-amber-200">
            廚房隨身計時器
          </span>
        </div>
        {hasFinished && (
          <span className="flex items-center gap-1 text-xs text-amber-300 font-bold animate-pulse">
            <Bell className="w-3.5 h-3.5" /> 時間到！
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Big Display */}
        <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-wider text-white">
          {formatTime(secondsLeft)}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleRun}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold transition-all shadow-xs cursor-pointer"
            title={isRunning ? '暫停' : '開始計時'}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-stone-900" />}
          </button>
          <button
            type="button"
            onClick={resetTimer}
            className="p-2.5 rounded-xl bg-amber-800/80 hover:bg-amber-700 text-amber-200 transition-all cursor-pointer"
            title="歸零"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-amber-800/60">
        <span className="text-[11px] text-amber-300/80 mr-1">快捷設定：</span>
        {[1, 3, 5, 10, 15].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setTimerPreset(m)}
            className="px-2 py-0.5 rounded-lg bg-amber-800 hover:bg-amber-700 text-xs font-medium text-amber-100 transition-colors cursor-pointer"
          >
            {m}分
          </button>
        ))}
      </div>
    </div>
  );
};
