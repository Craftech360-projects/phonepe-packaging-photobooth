import { useState } from "react";
import CameraCapture from "./components/CameraCapture";
import AccessoriesForm from "./components/AccessoriesForm";
import { generatePackaging } from "./services/gemini";

const Home = ({ onStart }) => (
  <div
    className="glass-panel"
    style={{ marginTop: "10vh", maxWidth: "600px", margin: "10vh auto" }}
  >
    <img
      src="/logo.png"
      alt="Logo"
      style={{ maxWidth: "80%", height: "auto", marginBottom: "2rem" }}
    />
    <div
      style={{
        height: "4px",
        width: "100px",
        background: "#9d4edd",
        margin: "0 auto 2rem",
      }}
    ></div>
    <p
      style={{
        fontSize: "1.2rem",
        marginBottom: "3rem",
        color: "var(--text-secondary)",
      }}
    >
      Immortalize yourself in a custom blister pack.
      <br />
      Capture your photo, choose your gear, and become a collectible.
    </p>
    <button
      onClick={onStart}
      style={{
        backgroundColor: "#7b1fa2",
        color: "white",
        border: "none",
        padding: "1rem 3rem",
        fontSize: "1.2rem",
        boxShadow: "0 0 20px rgba(123, 31, 162, 0.6)",
      }}
    >
      Get Started
    </button>
  </div>
);

function App() {
  const [view, setView] = useState("home"); // home, studio, result
  const [capturedImage, setCapturedImage] = useState(null);
  const [accessories, setAccessories] = useState([]);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const startStudio = () => setView("studio");

  const handleGenerate = async () => {
    if (!capturedImage) return;
    setIsLoading(true);
    setError(null);
    try {
      const resultImage = await generatePackaging(capturedImage, accessories);
      setGeneratedImage(resultImage);
      setView("result");
    } catch (err) {
      setError(err.message || "Failed to generate image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setGeneratedImage(null);
    setAccessories([]);
    setView("home");
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = "my-action-figure.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="app-container" style={{ paddingBottom: "2rem" }}>
      {view === "home" && <Home onStart={startStudio} />}

      {view === "studio" && (
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}
        >
          {/* Loading Overlay */}
          {isLoading && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                gap: "1rem",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  border: "5px solid rgba(157, 78, 221, 0.3)",
                  borderTop: "5px solid #9d4edd",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
              <p
                style={{
                  color: "#9d4edd",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                Generating your action figure...
              </p>
              <p style={{ color: "#d1d1d1", fontSize: "0.9rem" }}>
                This may take 1-3 minutes
              </p>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <h2 style={{ margin: 0 }}>Creation Studio</h2>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2rem",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            {/* Left Column: Camera */}
            <div
              className="glass-panel"
              style={{ flex: "1 1 400px", padding: "1.5rem" }}
            >
              {capturedImage ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <img
                    src={capturedImage}
                    alt="Captured"
                    style={{ width: "100%", borderRadius: "12px" }}
                  />
                  <button
                    onClick={() => setCapturedImage(null)}
                    style={{ background: "#333" }}
                  >
                    Retake Photo
                  </button>
                </div>
              ) : (
                <CameraCapture onCapture={setCapturedImage} />
              )}
            </div>

            {/* Right Column: Key Details */}
            <div
              className="glass-panel"
              style={{ flex: "1 1 400px", padding: "1.5rem" }}
            >
              <AccessoriesForm onAccessoriesChange={setAccessories} />

              <div
                style={{
                  marginTop: "2rem",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  paddingTop: "2rem",
                }}
              >
                <button
                  onClick={handleGenerate}
                  disabled={!capturedImage || isLoading}
                  style={{
                    width: "100%",
                    padding: "1.2rem",
                    fontSize: "1.2rem",
                    background:
                      !capturedImage || isLoading
                        ? "#333"
                        : "linear-gradient(45deg, #7b1fa2, #9d4edd)",
                    cursor:
                      !capturedImage || isLoading ? "not-allowed" : "pointer",
                    opacity: !capturedImage || isLoading ? 0.6 : 1,
                  }}
                >
                  {isLoading ? "Generating Magic..." : "Generate Action Figure"}
                </button>
                {error && (
                  <div
                    style={{
                      color: "#ff4444",
                      marginTop: "1rem",
                      background: "rgba(255,0,0,0.1)",
                      padding: "0.5rem",
                      borderRadius: "4px",
                    }}
                  >
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "result" && (
        <div
          className="glass-panel"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <h2>Your Action Figure</h2>
          <div
            style={{
              margin: "2rem 0",
              boxShadow: "0 0 30px rgba(0,0,0,0.5)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {generatedImage && (
              <img
                src={generatedImage}
                alt="Result"
                style={{ width: "100%", display: "block" }}
              />
            )}
          </div>
          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
          >
            <button onClick={handleDownload} style={{ background: "#2e7d32" }}>
              Download Image
            </button>
            <button onClick={handleReset} style={{ background: "#333" }}>
              Create New
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
