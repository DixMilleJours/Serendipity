import React from "react";
import { useSelector } from "react-redux";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import GroupIcon from "@mui/icons-material/Group";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import { Box } from "@mui/material";

function TravelInfo() {
  const travels = useSelector((state) => state.travels);

  return (
    <>
      <Box sx={{ alignContent: "center", textAlign: "center", display: 'flex', flexWrap: 'wrap'}}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          {travels[4]}&nbsp;<FlightTakeoffIcon />&nbsp;{travels[5]}&nbsp;&nbsp;
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <GroupIcon />{travels[2]}&nbsp;&nbsp;
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <ChildFriendlyIcon />{travels[3]}&nbsp;&nbsp;
        </Box>
      </Box>
    </>
  );
}

export default TravelInfo;
