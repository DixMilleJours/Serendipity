import React from "react";
import Navigation from "../Navbar/Navigation";
import Header from "../Index/Header";
import Footer from "../Index/Footer";
import { Alert, Container } from "@mui/material";
import Stack from "@mui/material/Stack";
import SearchBar from "../Search/SearchBar";
import MediaCard from "../Display/MediaCard";
import Fade from "@mui/material/Fade";
import "../../index.css";
import "../../static/css/login.css";
import { useAuth } from "../../AuthContext";
import Canvas from "./Canvas";
import { useSelector } from "react-redux";
import FeatureStacks from "../Display/FeatureStack";
// need to use mui grid v2 for contents view

export default function Home(prefer) {
  const currentUser = useAuth();
  const [isSelected, setSelected] = React.useState(false);
  const state = useSelector((state) => state.open);
  const [error, setError] = React.useState({ open: false, content: "" });

  React.useEffect(() => {}, [currentUser]);

  return (
    <>
      <Canvas>
        <Navigation
          loggedin={currentUser != null}
          username={"TODO"}
          prefer={prefer}
        />

        <div className="center">
          <Header />
        </div>
      </Canvas>

      {/* CONTENTS */}
      <Container
        sx={{
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "50px",
        }}
      >
        <Stack sx={{ width: "50%" }} spacing={2}>
          <Fade in={error.open} mountOnEnter unmountOnExit>
            <Alert
              severity="error"
              onClose={() => {
                setError({ open: false, content: "" });
              }}
            >
              {error.content}
            </Alert>
          </Fade>
        </Stack>

        <SearchBar
          loggedin={currentUser != null}
          setError={setError}
          setSelected={setSelected}
        />

        {/* put other components here... */}

        {/* <Bounce y={20}><MediaCard /></Bounce> */}
      </Container>

      {!isSelected && <FeatureStacks />}

      <div style={{ height: 200 }}></div>
      <Footer />
    </>
  );
}
