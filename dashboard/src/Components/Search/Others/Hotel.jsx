import * as React from "react";
import Rating from "@mui/material/Rating";

export default function BasicRating({rate, setRating}) {

  return (
    <Rating
      name="simple-controlled"
      sx={{ 
      '& .MuiRating-iconFilled': {
        color: '#ff6d75',
      },
      marginTop:"20px",
      marginLeft: "40px"
      
     }}
      size="large"
      value={rate}
      onChange={(event, newValue) => {
        setRating(newValue);
      }}
    />
  );
}
