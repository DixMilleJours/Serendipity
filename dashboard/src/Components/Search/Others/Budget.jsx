import * as React from "react";
import PropTypes from "prop-types";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

const AirbnbSlider = styled(Slider)(({ theme }) => ({
  height: 3,
  padding: "13px 0",
  "& .MuiSlider-thumb": {
    height: 27,
    width: 27,
    backgroundColor: "#fff",
    border: "1px solid currentColor",
    "&:hover": {
      boxShadow: "0 0 0 8px rgba(58, 133, 137, 0.16)",
    },
    "& .airbnb-bar": {
      height: 9,
      width: 1,
      backgroundColor: "currentColor",
      marginLeft: 1,
      marginRight: 1,
    },
  },
  "& .MuiSlider-track": {
    height: 3,
  },
  "& .MuiSlider-rail": {
    color: theme.palette.mode === "dark" ? "#bfbfbf" : "#d8d8d8",
    opacity: theme.palette.mode === "dark" ? undefined : 1,
    height: 3,
  },
  "& .MuiSlider-valueLabel": {
    fontSize: 12,
    fontWeight: "normal",
    top: -6,
    backgroundColor: "transparent",
    color: theme.palette.text.secondary,
    "&:before": {
      display: "none",
    },
  },
}));

function AirbnbThumbComponent(props) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
    </SliderThumb>
  );
}

AirbnbThumbComponent.propTypes = {
  children: PropTypes.node,
};

export default function CustomizedSlider({setPrice}) {
  return (
    <Box sx={{ width: "250px", marginTop:"25px" }}>
      <AirbnbSlider
        slots={{ thumb: AirbnbThumbComponent }}
        onChange={(event, newValue) => {
          setPrice(newValue);
        }}
        min={1000}
        step={1000}
        max={10000}
        valueLabelDisplay="on"
        getAriaLabel={(index) =>
          index === 0 ? "Minimum price" : "Maximum price"
        }
        defaultValue={[3000, 6000]}
      />
    </Box>
  );
}
