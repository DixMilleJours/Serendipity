import React from "react";
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import Wave from "react-wavify";
import { pink, blueGrey } from "@mui/material/colors";
import "../../static/css/footer.css"; // Assuming you have a separate CSS file for styling

const Footer = () => {
  const preferredMode = useSelector((state) => state.mode);
  const waveColor = preferredMode === "dark" ? blueGrey[800] : pink[50]
  const fontColor = preferredMode === "dark" ? pink[50] : blueGrey[800]
  return (
    <>
      <Wave
        fill={waveColor}
        paused={false}
        options={{
          height: 80,
          amplitude: 20,
          speed: 0.4,
          points: 4,
        }}
        style={{ marginBottom: 0 }}
      />
      <footer className="footer-container" >
        <div className="footer-content" style={{ marginTop: '-10px' }}>
          <Box
            height={`200px`}
            width="100%"
            sx={{
              background: waveColor,
            }}
          >
            <div style={{ height: 50 }}></div>
            <p style={{ color: fontColor, fontSize: "20px" }}>
              © 2024 Serendipity. All rights reserved.
            </p>
            <div className="social-icons">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF style={{ color: fontColor }} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram style={{ color: fontColor }} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn style={{ color: fontColor }} />
              </a>
            </div>
          </Box>
        </div>
      </footer>
    </>
  );
};

export default Footer;
