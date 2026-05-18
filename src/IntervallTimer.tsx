import Countdown, { type CountdownRenderProps } from "react-countdown";
import { useState, useRef } from "react";
import './IntervalTimer.css';

type Phase = "idle" | "short" | "countdown" | "long" | "done";

export default function IntervalTimer() {
  const [cycles, setCycles] = useState<number>(1);
  const [currentCycle, setCurrentCycle] = useState<number>(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [targetDate, setTargetDate] = useState<number | null>(null);
  const [isCountdown, setIsCountdown] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const SHORT = 30 * 1000;
  const LONG = 90 * 1000;

  const playSound = () => {
    audioRef.current?.play().catch(() => {});
  };

  const countStart = () => {
    setPhase("countdown");
    setIsCountdown(true);
  }

  const handleCompleteCountdown = () => {
    setIsCountdown(false);
    start();
  }

  const start = () => {
    setCurrentCycle(1);
    setPhase("short");
    setTargetDate(Date.now() + SHORT);
  };

  const handleComplete = () => {
    playSound();

    if (phase === "short") {
      setPhase("long");
      setTargetDate(Date.now() + LONG);
    } else if (phase === "long") {
      if (currentCycle >= cycles) {
        setPhase("done");
        return;
      }
      setCurrentCycle(prev => prev + 1);
      setPhase("short");
      setTargetDate(Date.now() + SHORT);
    }
  };

  const renderer = ({ minutes, seconds, completed }: CountdownRenderProps) => {
    if (completed) return null;

    return (
      <span style={{ fontSize: "5rem" }}>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    );
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2 className="timer-container">
        {phase === "idle" && "Bereit"}
        {phase === "countdown" && "Start in:"}
        {phase === "short" && "30 Sekunden"}
        {phase === "long" && "90 Sekunden"}
        {phase === "done" && "Fertig!"}
      </h2>

      {targetDate && phase !== "done" && (
        <div className="countdown-container">
          <Countdown
            key={targetDate}
            date={targetDate}
            renderer={renderer}
            onComplete={handleComplete}
          />
        </div>
      )}

      {isCountdown && (
        <div className="countdown-container">
          <Countdown 
            key={3}
            date={Date.now() + 3000}
            renderer={renderer}
            onComplete={handleCompleteCountdown}
          />
        </div>
      )}

      {!(phase === "countdown") && (
          <p className="count-container">
              Durchlauf: {currentCycle} / {cycles}
          </p>
      )}

      {phase === "idle" && (
        <>
        <div className="input-container">
          <input
            type="number"
            style={{
              border: "none",
              padding: 5,
              fontSize: 15,
              borderRadius: 3
            }}
            min={1}
            value={cycles}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCycles(Number(e.target.value))
            }
          />
          <br />
          <div className="button-container">
          <div onClick={countStart} className="button-style">
            Start
          </div>
          </div>
          </div>
        </>
      )}

      <audio ref={audioRef} src="/alarm.wav" preload="auto" />
    </div>
  );
}