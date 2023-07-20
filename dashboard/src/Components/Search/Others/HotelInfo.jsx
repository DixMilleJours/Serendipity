import React from "react";
import { useSelector } from "react-redux";

function HotelInfo({setModalOpen}) {
  const hotels = useSelector((state) => state.hotels);

  return (
    <div>Hotel Info</div>
  );
}

export default HotelInfo;
