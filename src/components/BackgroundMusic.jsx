"use client";
import { useEffect, useRef, useState } from "react";

export default function BackgroundMusic() {
  const audioRef = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    const startMusic = () => {
      if (!started && audio) {
        audio.play().catch(() => {});
        setStarted(true);
      }
    };

    // window üzerindeki tüm click ve keydown olaylarını dinle
    window.addEventListener("click", startMusic);
    window.addEventListener("keydown", startMusic);
    window.addEventListener("touchstart", startMusic); // mobil için

    return () => {
      window.removeEventListener("click", startMusic);
      window.removeEventListener("keydown", startMusic);
      window.removeEventListener("touchstart", startMusic);
    };
  }, [started]);

  return <audio ref={audioRef} src="/music.mp3" loop style={{ display: "none" }} />;
}
