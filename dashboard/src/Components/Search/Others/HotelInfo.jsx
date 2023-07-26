import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import HouseIcon from '@mui/icons-material/House';

function HotelInfo({setModalOpen}) {
  const hotels = useSelector((state) => state.hotels);

  return (
    <>
    <Box sx={{alignContent:"center", textAlign: "center",}}>
       YYC < HouseIcon />&nbsp; {hotels[0]}&nbsp;
      <GroupIcon /> {hotels[1]}&nbsp;
      <ChildFriendlyIcon /> {hotels[2]}
    </Box>
  </>
  );
}

export default HotelInfo;
