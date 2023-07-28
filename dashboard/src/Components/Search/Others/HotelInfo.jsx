import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import HouseIcon from "@mui/icons-material/House";

function HotelInfo() {
  const hotels = useSelector((state) => state.hotels);
  const destination = useSelector((state) => state.destination);

  function getPlace(fullString) {
    // console.log(fullString.length)


    if (fullString === null || fullString === "") {
      return "";
    }
    // if(fullString.description.length === 3){
    //   return fullString;
    // }
    const description = fullString.description.split(",")[0];
    const match = description.match(/\((.*?)\)/);

    if (match) {
      return match[1];
    }
    console.log(fullString);

    return description;
  }

  return (
    <>
      <Box sx={{ alignContent: "center", textAlign: "center" }}>
        {getPlace(destination)} &nbsp;
        <HouseIcon />
        &nbsp; {hotels[0]}&nbsp;
        <GroupIcon /> {hotels[1]}&nbsp;
        <ChildFriendlyIcon /> {hotels[2]}&nbsp;
      </Box>
    </>
  );
}

export default HotelInfo;
