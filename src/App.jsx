import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { generatePackaging } from "./services/gemini";
import { uploadImage } from "./services/supabase";
import InstallPrompt from "./components/InstallPrompt";

const ResultScreen = ({ generatedImage, userName, onReset }) => {
  const [publicUrl, setPublicUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(true);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    const uploadToSupabase = async () => {
      try {
        setIsUploading(true);
        setUploadError(null);
        const url = await uploadImage(
          generatedImage,
          userName || "action-figure"
        );
        setPublicUrl(url);
      } catch (error) {
        console.error("Failed to upload image:", error);
        setUploadError(error.message);
      } finally {
        setIsUploading(false);
      }
    };

    if (generatedImage) {
      uploadToSupabase();
    }
  }, [generatedImage, userName]);

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `${userName || "action-figure"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: "url(/output_bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "40px",
        padding: "32px",
      }}
    >
      {/* Image Display */}
      <div
        style={{
          border: "10px solid #FFCE00",
          borderRadius: "12px",
          overflow: "hidden",
          width: "500px",
          height: "800px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          background: "#FFFFFF",
        }}
      >
        {generatedImage && (
          <img
            src={generatedImage}
            alt="Generated Action Figure"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </div>

      {/* Two Column Layout */}
      <div
        style={{
          display: "flex",
          gap: "30px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Column 1: QR Code */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {/* Instruction Text */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#FFFFFF",
              padding: "16px",
              borderRadius: "12px",
            }}
          >
            {isUploading ? (
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#5E20C1",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                Generating QR Code...
              </div>
            ) : uploadError ? (
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ff4444",
                  fontSize: "16px",
                  textAlign: "center",
                  padding: "10px",
                }}
              >
                QR Code unavailable
              </div>
            ) : publicUrl ? (
              <QRCodeSVG value={publicUrl} size={125} level="H" />
            ) : null}
          </div>
        </div>

        {/* Column 2: Instructions and Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <p
            style={{
              color: "#FFFFFF",
              fontSize: "22px",
              fontWeight: "bold",
              textAlign: "center",
              margin: 0,
              maxWidth: "450px",
              lineHeight: "26px",
            }}
          >
            Scan the QR to download the image
          </p>
          {/* Download Button */}
          <button
            onClick={handleDownload}
            style={{
              width: "223px",
              height: "55px",
              backgroundColor: "#FFFFFF",
              color: "#5E20C1",
              border: "none",
              fontSize: "26px",
              fontWeight: "bold",
              borderRadius: "100px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            DOWNLOAD
          </button>

          {/* Restart Button */}
          <button
            onClick={onReset}
            style={{
              width: "223px",
              height: "55px",
              backgroundColor: "#FFFFFF",
              color: "#5E20C1",
              border: "none",
              fontSize: "28px",
              fontWeight: "bold",
              borderRadius: "100px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            RESTART
          </button>
        </div>
      </div>
    </div>
  );
};

const Home = ({ onStart }) => (
  <div
    className="welcome-screen"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundImage: "url(/welcome_screen_bg.png)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      margin: 0,
    }}
  >
    <button
      onClick={onStart}
      className="start-button"
      style={{
        position: "absolute",
        bottom: "200px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "277px",
        height: "82px",
        boxSizing: "border-box",
        padding: "0",
        backgroundColor: "#FFFFFF",
        color: "#5E20C1",
        border: "none",
        fontSize: "48px",
        fontWeight: "bold",
        borderRadius: "100px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
        textTransform: "uppercase",
        letterSpacing: "2px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateX(-50%) scale(1.05)";
        e.target.style.boxShadow = "0 12px 32px rgba(94, 32, 193, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateX(-50%) scale(1)";
        e.target.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.3)";
      }}
    >
      START
    </button>
  </div>
);

const CameraScreen = ({ onCapture, capturedImage, onRetake, onSubmit }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(0.7); // Start zoomed out at 70%

  useEffect(() => {
    if (!capturedImage) {
      startCamera();
    }
    return () => stopCamera();
  }, [capturedImage]);

  const startCamera = async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser");
      }

      // Try with flexible constraints first
      let mediaStream;
      try {
        // First attempt: try with ideal constraints
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 1920 },
          },
        });
      } catch (firstError) {
        console.warn(
          "First camera attempt failed, trying with basic constraints:",
          firstError
        );
        // Fallback: try with minimal constraints
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
          },
        });
      }

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);

      // Provide specific error messages
      let errorMessage = "Could not access camera. ";

      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        errorMessage +=
          "Please allow camera permissions in your browser settings.";
      } else if (
        err.name === "NotFoundError" ||
        err.name === "DevicesNotFoundError"
      ) {
        errorMessage += "No camera found on this device.";
      } else if (
        err.name === "NotReadableError" ||
        err.name === "TrackStartError"
      ) {
        errorMessage += "Camera is already in use by another application.";
      } else if (err.name === "OverconstrainedError") {
        errorMessage += "Camera doesn't support the requested settings.";
      } else if (err.name === "NotSupportedError") {
        errorMessage += "Camera access requires HTTPS connection.";
      } else if (err.message.includes("secure origin")) {
        errorMessage =
          "Camera access requires HTTPS. Please use https:// instead of http://";
      } else {
        errorMessage += err.message || "Unknown error occurred.";
      }

      setError(errorMessage);
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
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      // Flip the image horizontally to match the preview
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      onCapture(dataUrl);
      stopCamera();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: "url(/common_bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "40px",
      }}
    >
      {/* Camera Preview or Captured Image */}
      <div
        style={{
          width: "500px",
          height: "700px",
          border: "15px solid #FFCE00",
          borderRadius: "12px",
          overflow: "hidden",
          background: "#000",
          position: "relative",
        }}
      >
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : error ? (
          <div
            style={{
              color: "#ff4444",
              padding: "2rem",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            {error}
          </div>
        ) : (
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
        )}
      </div>

      {/* Buttons */}
      {!capturedImage ? (
        <button
          onClick={capturePhoto}
          disabled={!!error}
          style={{
            width: "277px",
            height: "82px",
            backgroundColor: "#FFFFFF",
            color: "#5E20C1",
            border: "none",
            fontSize: "48px",
            fontWeight: "bold",
            borderRadius: "100px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
            textTransform: "uppercase",
            letterSpacing: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 80px",
          }}
        >
          CAPTURE
        </button>
      ) : (
        <div style={{ display: "flex", gap: "20px" }}>
          <button
            onClick={onRetake}
            style={{
              width: "277px",
              backgroundColor: "#FFFFFF",
              color: "#5E20C1",
              border: "none",
              fontSize: "48px",
              fontWeight: "bold",
              borderRadius: "100px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 50px",
            }}
          >
            RETAKE
          </button>
          <button
            onClick={onSubmit}
            style={{
              height: "82px",
              backgroundColor: "#FFFFFF",
              color: "#5E20C1",
              border: "none",
              fontSize: "48px",
              fontWeight: "bold",
              borderRadius: "100px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 50px",
            }}
          >
            SUBMIT
          </button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

const UserDetailsScreen = ({
  onNext,
  userName,
  setUserName,
  accessories,
  setAccessories,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: "url(/common_bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "40px",
        padding: "40px",
      }}
    >
      <div
        style={{
          width: "550px",
          maxWidth: "90vw",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        {/* Name Input */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0px",
            marginBottom: "20px",
            alignItems: "center",
          }}
        >
          <label
            style={{
              color: "#FFFFFF",
              fontSize: "32px",
              fontWeight: "bold",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            First Name
          </label>
          <p
            style={{
              color: "#FFCE00",
              fontSize: "24px",
              margin: "0 0 10px 0",
              lineHeight: "32px",
              textAlign: "center",
            }}
          >
            This name will appear on your packaging<br></br>(max 10 characters)
          </p>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value.toUpperCase())}
            placeholder="Enter your name"
            maxLength={10}
            style={{
              width: "100%",
              height: "100px",
              fontSize: "28px",
              padding: "0 16px",
              borderRadius: "20px",
              border: "5px solid #FFCE00",
              backgroundColor: "#FFFFFF",
              color: "#5E20C1",
              fontWeight: "bold",
              boxSizing: "border-box",
              textTransform: "uppercase",
            }}
          />
        </div>

        {/* Accessories Textarea */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0px",
            alignItems: "center",
          }}
        >
          <label
            style={{
              color: "#FFFFFF",
              fontSize: "32px",
              fontWeight: "bold",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            Accessories
          </label>
          <p
            style={{
              color: "#FFCE00",
              fontSize: "24px",
              margin: "0 0 10px 0",
              lineHeight: "32px",
              textAlign: "center",
            }}
          >
            List up to five elements you would<br></br>like to be included in
            your package.
          </p>
          <textarea
            value={accessories}
            onChange={(e) => {
              // Prevent newlines - replace with space
              const value = e.target.value.replace(/[\r\n]/g, " ");
              setAccessories(value);
            }}
            onKeyDown={(e) => {
              // Prevent Enter key from creating newlines
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            placeholder="eg. Nike sneakers, Camera, Watch, Cricket bat, Headphones"
            style={{
              width: "100%",
              height: "200px",
              fontSize: "24px",
              padding: "16px",
              borderRadius: "20px",
              border: "5px solid #FFCE00",
              backgroundColor: "#FFFFFF",
              color: "#5E20C1",
              fontWeight: "500",
              boxSizing: "border-box",
              resize: "none",
              fontFamily: "inherit",
            }}
          />
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={!userName.trim()}
        style={{
          width: "277px",
          height: "82px",
          backgroundColor: userName.trim() ? "#FFFFFF" : "#999999",
          color: "#5E20C1",
          border: "none",
          fontSize: "48px",
          fontWeight: "bold",
          borderRadius: "100px",
          cursor: userName.trim() ? "pointer" : "not-allowed",
          transition: "all 0.3s ease",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          textTransform: "uppercase",
          letterSpacing: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          opacity: userName.trim() ? 1 : 0.6,
        }}
      >
        NEXT
      </button>
    </div>
  );
};

const LoadingScreen = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: "url(/common_bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "40px",
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <source src="/loading.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

function App() {
  const [view, setView] = useState("home"); // home, camera, details, loading, result
  const [capturedImage, setCapturedImage] = useState(null);
  const [userName, setUserName] = useState("");
  const [accessories, setAccessories] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);

  const startCamera = () => setView("camera");

  const handleCapture = (imageData) => {
    setCapturedImage(imageData);
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleSubmitPhoto = () => {
    setView("details");
  };

  const handleNext = async () => {
    setView("loading");
    setError(null);

    try {
      // Parse accessories from comma-separated string (trimmed)
      const trimmedAccessories = accessories.trim();
      const accessoriesArray = trimmedAccessories
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      // Pass trimmed userName to the prompt
      const trimmedUserName = userName.trim();

      const resultImage = await generatePackaging(
        capturedImage,
        accessoriesArray,
        trimmedUserName
      );
      setGeneratedImage(resultImage);
      setView("result");
    } catch (err) {
      setError(err.message || "Failed to generate image.");
      setView("details"); // Go back to details screen on error
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setGeneratedImage(null);
    setUserName("");
    setAccessories("");
    setView("home");
  };

  return (
    <div className="app-container">
      <InstallPrompt />

      {view === "home" && <Home onStart={startCamera} />}

      {view === "camera" && (
        <CameraScreen
          onCapture={handleCapture}
          capturedImage={capturedImage}
          onRetake={handleRetake}
          onSubmit={handleSubmitPhoto}
        />
      )}

      {view === "details" && (
        <UserDetailsScreen
          onNext={handleNext}
          userName={userName}
          setUserName={setUserName}
          accessories={accessories}
          setAccessories={setAccessories}
        />
      )}

      {view === "loading" && <LoadingScreen />}

      {view === "result" && (
        <ResultScreen
          generatedImage={generatedImage}
          userName={userName}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;
