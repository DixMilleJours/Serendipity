import React from "react";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";

function Canvas({ children }) {
  const windowHeight = window.innerHeight;
  const boxHeight = windowHeight * 0.6; // 30% of the window's height
  const preferredMode = useSelector((state) => state.mode);

  return (
    <Box
      height={`${boxHeight}px`}
      width="100%"
      sx={{
        background:
          preferredMode === "dark"
            // ? "linear-gradient(180deg,rgba(0,0,0,255) 0,rgba(0,0,0,0) 100%),linear-gradient(90deg,rgba(80,227,194,0.2) 0,rgba(0,112,243,0.2) 100%)"
            // : "linear-gradient(181deg,rgba(255,255,255,255) 0,rgba(255,255,255,0) 100%),linear-gradient(90deg,rgba(80,227,194,0.08) 0,rgba(0,112,243,0.08) 100%)",
            ? "linear-gradient(180deg, rgba(0,0,0,255) 0%, rgba(0,0,0,0) 100%), linear-gradient(90deg, #37474f 0%, #37474f 100%)"
            : "linear-gradient(181deg, rgba(255,255,255,255) 0%, rgba(255,255,255,0) 100%), linear-gradient(90deg, rgba(255,105,180,0.08) 0%, rgba(255,182,193,0.08) 100%)"
          }}
    >
      {children}
    </Box>
  );
}

export default Canvas;
