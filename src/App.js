import React, { useState, useRef } from "react";
import ReactPlayer from "react-player";
import "./App.css";

const App = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [captions, setCaptions] = useState([]);
  const [currentCaption, setCurrentCaption] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const videoRef = useRef(null);

  const handleAddCaption = () => {
    if (!currentCaption || !startTime || !endTime) {
      alert("Please fill all caption fields.");
      return;
    }
    setCaptions((prev) => [
      ...prev,
      {
        text: currentCaption,
        startTime: parseTime(startTime),
        endTime: parseTime(endTime),
      },
    ]);
    setCurrentCaption("");
    setStartTime("");
    setEndTime("");
  };

  const parseTime = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const renderCaptions = () => {
    if (!videoRef.current) return "";
    const currentTime = videoRef.current.getCurrentTime();
    const activeCaption = captions.find(
      (caption) =>
        currentTime >= caption.startTime && currentTime <= caption.endTime
    );
    return activeCaption ? activeCaption.text : "";
  };

  return (
    <div className="app">
      <h1>Video Caption Editor</h1>

      {/* Video URL Input */}
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      </div>

      {/* Video Player */}
      {videoUrl && (
        <div className="video-player-wrapper">
          <ReactPlayer
            ref={videoRef}
            url={videoUrl}
            controls
            playing={false}
            width="100%"
            height="360px"
          />
          <div className="caption-overlay">{renderCaptions()}</div>
        </div>
      )}

      {/* Caption Input */}
      <div className="caption-editor">
        <textarea
          placeholder="Enter caption text"
          value={currentCaption}
          onChange={(e) => setCurrentCaption(e.target.value)}
        />
        <div className="time-inputs">
          <input
            type="text"
            placeholder="Start (hh:mm:ss)"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <input
            type="text"
            placeholder="End (hh:mm:ss)"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        <button onClick={handleAddCaption}>Add Caption</button>
      </div>

      {/* Display Captions List */}
      <div className="captions-list">
        <h2>Captions</h2>
        <ul>
          {captions.map((caption, index) => (
            <li key={index}>
              <strong>{caption.text}</strong> ({formatTime(caption.startTime)} -{" "}
              {formatTime(caption.endTime)})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
