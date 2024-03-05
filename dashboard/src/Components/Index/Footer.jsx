import React from "react";
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { pink } from '@mui/material/colors';
import "../../static/css/footer.css"; // Assuming you have a separate CSS file for styling

const Footer = () => {
  const preferredMode = useSelector((state) => state.mode);
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <Box
          height={`200px`}
          width="100%"
          sx={{
            background:
              preferredMode === "dark"
                ? // ? "linear-gradient(180deg,rgba(0,0,0,255) 0,rgba(0,0,0,0) 100%),linear-gradient(90deg,rgba(80,227,194,0.2) 0,rgba(0,112,243,0.2) 100%)"
                  // : "linear-gradient(181deg,rgba(255,255,255,255) 0,rgba(255,255,255,0) 100%),linear-gradient(90deg,rgba(80,227,194,0.08) 0,rgba(0,112,243,0.08) 100%)",
                  "linear-gradient(180deg, rgba(0,0,0,255) 0%, rgba(0,0,0,0) 100%), linear-gradient(90deg, rgba(255,105,180,0.2) 0%, rgba(255,182,193,0.2) 100%)"
                : "linear-gradient(181deg, rgba(255,255,255,255) 0%, rgba(255,255,255,0) 100%), linear-gradient(90deg, rgba(255,105,180,0.08) 0%, rgba(255,182,193,0.08) 100%)",
          }}
        >
          <div style={{height: 50}}></div>
          <p style={{color: pink[500]}}>© 2024 Serendipity. All rights reserved.</p>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF  style={{color: pink[700]}}/>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram  style={{color: pink[700]}}/>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn style={{color: pink[700]}}/>
            </a>
          </div>
        </Box>
      </div>
    </footer>
  );
};

export default Footer;
