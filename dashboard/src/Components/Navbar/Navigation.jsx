import React, { useState, useLayoutEffect } from "react";
import AccountMenu from "./Profile";
import { blueGrey, grey, pink } from "@mui/material/colors";
import {
  useTheme,
  useMediaQuery,
  IconButton,
  MenuItem,
  Select,
  Typography,
  Box,
  Button,
} from "@mui/material/";
import {
  DarkMode,
  LightMode,
  Menu,
  Help,
  Message,
  Notifications,
  ExpandLess,
} from "@mui/icons-material";
import { setMode, setLogout } from "../../state";
import { useDispatch, useSelector } from "react-redux";
import Login from "../Registration/Login";
import Register from "../Registration/Register";
import "../../static/css/login.css";
import "../../static/css/navbar.css";
import Logo from "../../static/images/logo.png";
import FlexDisplay from "../Display/FlexDisplay";
import { Bounce } from "../../Animations/Bounce";
import { useNavigate } from "react-router-dom";

function useWindowSise() {
  const [windowWidth, setWindowWidth] = React.useState(0);
  useLayoutEffect(() => {
    function updateSize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return windowWidth;
}

function Navigation({ loggedin, username }) {
  const windowWidth = useWindowSise();
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);
  const [iconColor, setIconColor] = useState(blueGrey[500]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const user = useSelector((state) => state.user);
  const [isDroppedDown, setDroppedDown] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const isNonMobileScreens = useMediaQuery("(min-width: 950px)");
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const lHandleMouseOver = () => {
    setIconColor(grey[900]); // Change the color to grey[900] on mouse over
  };

  const lHandleMouseOut = () => {
    setIconColor(blueGrey[500]); // Reset the color on mouse out
  };

  const dHandleMouseOver = () => {
    setIconColor(grey[50]);
  };

  const dHandleMouseOut = () => {
    setIconColor(blueGrey[200]);
  };

  const getResponsiveButtonSize = () => {
    if (windowWidth <= 950 && windowWidth > 600) {
      return "600px";
    } else {
      return "440px";
    }
  };

  React.useEffect(() => {
    if (windowWidth <= 444) {
      window.resizeTo(444, window.innerHeight);
    }
  }, [windowWidth]);

  // const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <>
      <FlexDisplay padding="1rem 6%" backgroundColor={alt}>
        <FlexDisplay gap="1.75rem">
          {/* Edit Logo here ... */}
          <img src={Logo} width="100px" height="80px" />{" "}
          <Typography
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            color="primary"
            onClick={() => navigate("/home")}
            sx={{
              "&:hover": {
                color: primaryLight,
                cursor: "pointer",
              },
            }}
          >
            Serendipity
          </Typography>
        </FlexDisplay>

        {/* Dark Mode */}
        {!isNonMobileScreens && (
          <FlexDisplay gap="2rem">
            <IconButton
              onClick={() => dispatch(setMode())}
              style={{ marginRight: "20px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode
                  sx={{ color: iconColor, fontSize: "25px" }}
                  onMouseOver={dHandleMouseOver}
                  onMouseOut={dHandleMouseOut}
                />
              ) : (
                <LightMode
                  sx={{ color: iconColor, fontSize: "25px" }}
                  onMouseOver={lHandleMouseOver}
                  onMouseOut={lHandleMouseOut}
                />
              )}
            </IconButton>
          </FlexDisplay>
        )}

        {/* DESKTOP NAVIGATION BAR */}
        {isNonMobileScreens ? (
          <FlexDisplay gap="2rem">
            <IconButton
              onClick={() => dispatch(setMode())}
              style={{ marginLeft: "20px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode
                  sx={{ color: iconColor, fontSize: "25px" }}
                  onMouseOver={dHandleMouseOver}
                  onMouseOut={dHandleMouseOut}
                />
              ) : (
                <LightMode
                  sx={{ color: iconColor, fontSize: "25px" }}
                  onMouseOver={lHandleMouseOver}
                  onMouseOut={lHandleMouseOut}
                />
              )}
            </IconButton>
            <Message sx={{ fontSize: "25px" }} />
            <Notifications sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} />
            {!loggedin && (
              <Button
                variant="contained"
                style={{
                  color: "white",
                  fontSize: "18px",
                  width: "135px",
                  marginRight: "0px",
                }}
                onClick={() => {
                  setOpenLogin(true);
                }}
              >
                Login
              </Button>
            )}
            {!loggedin && (
              <Button
                variant="outlined"
                className="button"
                style={{
                  border: "2px solid #fe4066",
                  fontSize: "18px",
                  fontWeight: "bold",
                  width: "135px",
                }}
                onClick={() => {
                  setOpenSignup(true);
                }}
                id="signup-btn"
              >
                Sign Up
              </Button>
            )}
            {loggedin && <AccountMenu username={username} />}
          </FlexDisplay>
        ) : (
          <IconButton
            onClick={() => {
              setOpenMenu(!openMenu);
              setDroppedDown(!isDroppedDown);
            }}
          >
            {!isDroppedDown && (
              <Bounce y={5}>
                <Menu />
              </Bounce>
            )}
            {isDroppedDown && (
              <Bounce y={-5}>
                <ExpandLess />
              </Bounce>
            )}
          </IconButton>
        )}
      </FlexDisplay>

      {/* MOBILE NAVIGATION BAR */}

      {!isNonMobileScreens && openMenu && (
        <Box bgcolor={background}>
          {/* MENU ITEMS */}
          <FlexDisplay
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            {!loggedin && (
              <Button
                variant="contained"
                style={{
                  color: "white",
                  fontSize: "18px",
                  borderColor: "blue",
                  width: getResponsiveButtonSize(),
                }}
                onClick={() => {
                  setOpenLogin(true);
                }}
              >
                Login
              </Button>
            )}
            {!loggedin && (
              <Button
                variant="outlined"
                className="button"
                style={{
                  border: "2px solid #fe4066",
                  fontSize: "18px",
                  fontWeight: "bold",
                  width: getResponsiveButtonSize(),
                  marginTop: "0px",
                }}
                onClick={() => {
                  setOpenSignup(true);
                }}
                id="signup-btn"
              >
                Sign Up
              </Button>
            )}
            {loggedin && <AccountMenu username={username} />}
          </FlexDisplay>
        </Box>
      )}

      {openLogin && <Login setOpenLogin={setOpenLogin} />}
      {openSignup && <Register setOpenSignup={setOpenSignup} />}
    </>
  );
}

export default Navigation;
