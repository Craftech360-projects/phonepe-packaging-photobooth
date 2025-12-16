import React, { useRef, useState, useEffect } from "react";

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please allow permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to base64
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      onCapture(dataUrl);
      stopCamera(); // Stop camera after capture
    }
  };

  return (
    <div
      className="camera-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        width: "100%",
      }}
    >
      {error ? (
        <div
          style={{
            color: "#ff4444",
            padding: "2rem",
            border: "1px solid #ff4444",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "480px",
            aspectRatio: "3/4",
            background: "#000",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "scaleX(-1)",
            }}
          />
        </div>
      )}

      <button
        onClick={capturePhoto}
        disabled={!!error}
        style={{
          background: "linear-gradient(45deg, #7b1fa2, #9d4edd)",
          color: "white",
          border: "none",
          padding: "1rem 3rem",
          fontSize: "1.2rem",
          boxShadow: "0 0 15px rgba(123, 31, 162, 0.4)",
        }}
      >
        Capture Photo
      </button>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CameraCapture;
