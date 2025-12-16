import React, { useState, useEffect } from "react";

const BAD_WORDS = [
  "sex",
  "nude",
  "naked",
  "porn",
  "xxx",
  "fuck",
  "shit",
  "bitch",
  "ass",
  "dick",
  "pussy",
  "cock",
  "toy",
  "vibrator",
  "drug",
  "cocaine",
  "heroin",
  "kill",
  "murder",
  "blood",
];

const AccessoriesForm = ({ onAccessoriesChange }) => {
  // 5 Inputs by default
  const [inputs, setInputs] = useState(["", "", "", "", ""]);
  const [errors, setErrors] = useState({});

  // Validate and update parent
  useEffect(() => {
    const validAccessories = inputs
      .map((val) => val.trim())
      .filter((val) => val.length > 0 && !isProfane(val));

    onAccessoriesChange(validAccessories);
  }, [inputs]);

  const isProfane = (text) => {
    const lower = text.toLowerCase();
    return BAD_WORDS.some((word) => lower.includes(word));
  };

  const handleChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);

    // Validation logic
    const newErrors = { ...errors };
    if (value.trim() && isProfane(value)) {
      newErrors[index] = "Please use appropriate words.";
    } else {
      delete newErrors[index];
    }

    // Check active count
    const activeCount = newInputs.filter((v) => v.trim().length > 0).length;
    if (activeCount > 3) {
      // If this exact input is making it go over 3, warn
      // This is a bit tricky UX. User asked: "User can enter a maximum of 3 accessories" but "In UI we can add 5 inputs".
      // Maybe we should disable empty slots if 3 are filled?
    }

    setErrors(newErrors);
  };

  const filledCount = inputs.filter((i) => i.trim().length > 0).length;

  return (
    <div style={{ width: "100%", maxWidth: "480px", margin: "0 auto" }}>
      <h3 style={{ textAlign: "left", marginBottom: "1rem", color: "#d1d1d1" }}>
        Add Accessories (Max 3)
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        {inputs.map((val, idx) => {
          const isError = !!errors[idx];
          const isFilled = val.trim().length > 0;
          // Disable if 3 slots are already filled AND this one is empty
          const isDisabled = filledCount >= 3 && !isFilled;

          return (
            <div key={idx} style={{ position: "relative" }}>
              <input
                type="text"
                placeholder={`Accessory ${idx + 1} (e.g. Shoes, Watch)`}
                value={val}
                onChange={(e) => handleChange(idx, e.target.value)}
                disabled={isDisabled}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  borderRadius: "8px",
                  border: isError
                    ? "1px solid #ff4444"
                    : "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(0,0,0,0.3)",
                  color: "white",
                  fontSize: "1rem",
                  opacity: isDisabled ? 0.5 : 1,
                }}
              />
              {isError && (
                <span
                  style={{
                    color: "#ff4444",
                    fontSize: "0.8rem",
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  Invalid
                </span>
              )}
            </div>
          );
        })}
      </div>
      {filledCount >= 3 && (
        <p
          style={{ color: "#9d4edd", fontSize: "0.9rem", marginTop: "0.5rem" }}
        >
          Maximum 3 accessories reached.
        </p>
      )}
    </div>
  );
};

export default AccessoriesForm;
