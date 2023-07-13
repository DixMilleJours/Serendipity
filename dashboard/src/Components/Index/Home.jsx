import React from "react";
import Navigation from "../Navbar/Navigation";
import Header from "../Index/Header";
import Footer from "../Index/Footer";
import { Container } from "@mui/material";
import SearchBar from "../Search/SearchBar";
import MediaCard from "../Display/MediaCard";
import { Bounce } from "../../Animations/Bounce";
import "../../index.css";
import "../../static/css/login.css";
import { useAuth } from "../../AuthContext";
import Canvas from "./Canvas";
import TravelDetails from "../Search/Others/TravelDetails";
import { useSelector } from "react-redux";
// need to use mui grid v2 for contents view

export default function Home(prefer) {
  const currentUser = useAuth();
  const [isModalOpen, setModalOpen] = React.useState(false);
  const state = useSelector((state) => state.open);
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
        <SearchBar loggedin={currentUser != null} />

        {/* put other components here... */}

        {/* <Bounce y={20}><MediaCard /></Bounce> */}
      </Container>
      {/* <Footer /> */}
    </>
  );
}
