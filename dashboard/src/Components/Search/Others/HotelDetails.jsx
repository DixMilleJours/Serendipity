import { pink, grey } from "@mui/material/colors";
import React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import parse from "autosuggest-highlight/parse";
import { debounce } from "@mui/material/utils";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import FormControl from "@mui/material/FormControl";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useSelector, useDispatch } from "react-redux";
import { setLocation, setHotel } from "../../../state";
import "../../../static/css/modal.css";
import "../../../static/css/login.css";

const GOOGLE_MAPS_API_KEY = "AIzaSyC6ypOzv4pxq3lM4SbI5Mh7MlnJUapoZuQ";

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

function Location({ placeholder, defaultValue }) {
  const [value, setValue] = React.useState(defaultValue);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const loaded = React.useRef(false);

  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
        document.querySelector("head"),
        "google-maps"
      );
    }

    loaded.current = true;
  }

  const fetch = React.useMemo(
    () =>
      debounce((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 400),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      id="google-map-demo"
      sx={{ width: 270 }}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.description
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      disabled={true}
      value={value}
      noOptionsText="No locations"
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label={placeholder} fullWidth />
      )}
      renderOption={(props, option) => {
        const matches =
          option.structured_formatting.main_text_matched_substrings || [];

        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match) => [match.offset, match.offset + match.length])
        );

        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item sx={{ display: "flex", width: 44 }}>
                <LocationOnIcon sx={{ color: "text.secondary" }} />
              </Grid>
              <Grid
                item
                sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
              >
                {parts.map((part, index) => (
                  <Box
                    key={index}
                    component="span"
                    sx={{ fontWeight: part.highlight ? "bold" : "regular" }}
                  >
                    {part.text}
                  </Box>
                ))}
                <Typography variant="body2" color="text.secondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}

function HotelDetails({ setModalOpen, setHotelDetails }) {
  const preferredMode = useSelector((state) => state.mode);
  const dispatch = useDispatch();
  const [bgcolor, setBgcolor] = React.useState("");
  const [containerColor, setContainerColor] = React.useState("");
  const departure = useSelector((state) => state.departure);
  const destination = useSelector((state) => state.destination);
  const hotels = useSelector((state) => state.hotels);
  const [room, setRooms] = React.useState(hotels[0]);
  const [adults, setAdults] = React.useState(hotels[1]);
  const [children, setChildren] = React.useState(hotels[2]);

  React.useEffect(() => {
    if (preferredMode === "dark") {
      setBgcolor("black");
      setContainerColor(grey[900]);
    }
    console.log(bgcolor);
  }, []);

  function handleClose() {
    dispatch(setHotel({ room: room, adults: adults, children: children }));
    setModalOpen(false);
    setHotelDetails(true);
  }

  function removeRooms() {
    if (room > 0) {
      setRooms(room - 1);
    }
  }

  function addRooms() {
    setRooms(room + 1);
  }

  function removeAdults() {
    if (adults > 0) {
      setAdults(adults - 1);
    }
  }
  function removeChildren() {
    if (children > 0) {
      setChildren(children - 1);
    }
  }
  function addAdults() {
    setAdults(adults + 1);
  }
  function addChildren() {
    setChildren(children + 1);
  }


  return (
    // <div className="modalBackground" style={{ backgroundColor: bgcolor }}>
    <Modal
        open={true}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
      
      <div
        className="modalContainer modalBackground"
        style={{ backgroundColor: containerColor }}
      > 

        <div className="title">
          <h3
            style={{
              fontSize: "25pt",
            }}
          >
            Hotel&nbsp;&nbsp;&nbsp;&nbsp;Details
          </h3>
        </div>
        <div className="contentBox">
          <div className="formBox">
            <form>
              <Box>
                <div className="inputContainer">
                  <Box
                    display="flex"
                    flexDirection="row"
                    textAlign="center"
                    alignItems="center"
                  >
                    <span style={{ marginLeft: "0px" }}>Room Quantity</span>
                    &nbsp;
                    <RemoveCircleOutlineIcon
                      sx={{ color: pink[500] }}
                      onClick={removeRooms}
                    />
                    &nbsp;
                    {room}&nbsp;
                    <AddCircleIcon
                      sx={{ color: pink[500] }}
                      onClick={addRooms}
                    />
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="row"
                    textAlign="center"
                    alignItems="center"
                    marginTop="30px"
                  >
                    <span>Adults</span>&nbsp;
                    <RemoveCircleOutlineIcon
                      sx={{ color: pink[500] }}
                      onClick={removeAdults}
                    />
                    &nbsp;
                    {adults}&nbsp;
                    <AddCircleIcon
                      sx={{ color: pink[500] }}
                      onClick={addAdults}
                    />&nbsp;
                    <span>Children</span>&nbsp;
                    <RemoveCircleOutlineIcon
                      sx={{ color: pink[500] }}
                      onClick={removeChildren}
                    />&nbsp;
                    {children}&nbsp;
                    <AddCircleIcon
                      sx={{ color: pink[500] }}
                      onClick={addChildren}
                    />
                  </Box>

                  <FormControl style={{ marginTop: "40px" }}>
                    <Location
                      placeholder={"Departure"}
                      defaultValue={departure.description}
                    />
                  </FormControl>
                  <FormControl style={{ marginTop: "20px" }}>
                    <Location
                      placeholder={"Destination"}
                      defaultValue={destination.description}
                    />
                  </FormControl>

                  <button
                    className="saveBtn"
                    type="submit"
                    id="bt-register"
                    style={{ marginTop: "80px" }}
                    onClick={handleClose}
                  >
                    Save
                  </button>
                </div>
              </Box>
            </form>
          </div>
        </div>
      </div>
      </Modal>
  );
}

export default HotelDetails;
