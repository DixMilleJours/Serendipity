import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import HouseIcon from "@mui/icons-material/House";

function HotelInfo() {
  const hotels = useSelector((state) => state.hotels);
  const travels = useSelector((state) => state.travels);
  const destination = useSelector((state) => state.destination);

  function getPlace(fullString) {
    // console.log(fullString.length)


    if (fullString === null || fullString === "" || fullString === undefined) {
      return "";
    }
    // if(fullString.description.length === 3){
    //   return fullString;
    // }
    const description = fullString.split(",")[0];
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
        {getPlace(destination.description)} &nbsp;
        <HouseIcon />
        &nbsp; {hotels[0]}&nbsp;
        <GroupIcon /> {travels[2]}&nbsp;
        <ChildFriendlyIcon /> {travels[3]}&nbsp;
      </Box>
    </>
  );
}

export default HotelInfo;