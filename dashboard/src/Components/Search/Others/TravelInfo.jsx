import React from "react";
import { useSelector } from "react-redux";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import GroupIcon from "@mui/icons-material/Group";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import { Box } from "@mui/material";

function TravelInfo({ setTravelModalOpen }) {
  const travels = useSelector((state) => state.travels);

  // const way = useSelector((state) => state.way);
  // React.useEffect(()=>{
  //   console.log(way.way);
  // },[way])

  return (
    <>
      <Box sx={{ alignContent: "center", textAlign: "center" }}>
        {travels[4]} &nbsp; <FlightTakeoffIcon />
        &nbsp; {travels[5]}&nbsp;
        <GroupIcon /> {travels[2]}&nbsp;
        <ChildFriendlyIcon /> {travels[3]}&nbsp;
      </Box>
    </>
  );
}

export default TravelInfo;
