import * as React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { blueGrey, green, grey, pink } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import CheckIcon from "@mui/icons-material/Check";
import { useDispatch } from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import { setLocation, setHotel, setTravel } from "../../../state";
import SaveIcon from "@mui/icons-material/Save";

export default function Reset() {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef();

  const buttonSx = {
    ...(success && {
      bgcolor: "primary",
      "&:hover": {
        bgcolor: blueGrey[700],
      },
    }),
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        dispatch(setLocation({ departure: "", destination: "" }));
        dispatch(setHotel({ room: 0, adults: 0, children: 0 }));
        dispatch(
          setTravel({ way: "", classOption: "", adults: 0, children: 0 })
        );
        setSuccess(true);
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ m: 1, position: "relative" }}>
        <Tooltip title="Reset">
          <Fab
            aria-label="save"
            color="primary"
            sx={buttonSx}
            style={{ marginTop: "6px" }}
            onClick={handleButtonClick}
          >
            {success ? <CheckIcon /> : <SaveIcon color={grey[100]} />}
          </Fab>
        </Tooltip>
        {loading && (
          <CircularProgress
            size={68}
            sx={{
              color: blueGrey[400],
              position: "absolute",
              top: -6,
              left: -6,
              zIndex: 1,
            }}
          />
        )}
      </Box>
    </Box>
  );
}
