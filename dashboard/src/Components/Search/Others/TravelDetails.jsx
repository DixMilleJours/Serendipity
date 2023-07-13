import { pink } from "@mui/material/colors";
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
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Departure from "./Departure";
import Destination from "./Destination";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useSelector, useDispatch } from "react-redux";
import { setLocation, setWay } from "../../../state";
import "../../../static/css/modal.css";
import "../../../static/css/login.css";
import { Button } from "@mui/material";

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




function TravelDetails({ setTravelDetails, setModalOpen  }) {
  const dispatch = useDispatch();
  const departure = useSelector((state) => state.departure);
  const destination = useSelector((state) => state.destination);
  const [way, setWay] = React.useState("");
  const [adults, setAdults] = React.useState(0);
  const [children, setChildren] = React.useState(0);

  const handleWays = (event) => {
    setWay(event.target.value);
    // dispatch(setWay({ way }));
  };

  function save() {
    // dispatch(setLocation({ departure, destination }));
    // dispatch(setWay({ way }));
    setModalOpen(false);
    setTravelDetails(true);
  }

  function removeAdults(){
    if(adults > 0){
      setAdults(adults-1);
    }
  }
  function removeChildren(){
    if(children > 0){
      setChildren(children-1);
    }
  }
  function addAdults(){
    setAdults(adults+1);
  }
  function addChildren(){
    setChildren(children+1);
  }

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="title">
          <h2
            style={{
              fontSize: "25pt",
              color: pink[400],
            }}
          >
            Travel&nbsp;&nbsp;&nbsp;&nbsp;Details
          </h2>
        </div>
        <div className="contentBox">
          <div className="formBox">
            <form>
              <Box>
                <div className="inputContainer">
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                    >
                      <FormControlLabel
                        value="Economy"
                        control={<Radio />}
                        label="Economy"
                      />
                      <FormControlLabel
                        value="Business"
                        control={<Radio />}
                        label="Business"
                      />
                    </RadioGroup>
                  </FormControl>
                  <Box display="flex" flexDirection="row">
                    <h4>Adults</h4>
                    <RemoveCircleOutlineIcon sx={{ color: pink[500] }} onClick={removeAdults} />
                    {adults}
                    <AddCircleIcon  sx={{ color: pink[500] }}  onClick={addAdults}/>
                   
                    <h4>Children</h4>
                    <RemoveCircleOutlineIcon sx={{ color: pink[500] }} onClick={removeChildren}/>
                    {children}
                    <AddCircleIcon sx={{ color: pink[500] }} onClick={addChildren}/>
                  </Box>
                  <FormControl
                    variant="outlined"
                    margin="normal"
                    style={{ marginTop: "40px", width: "270px" }}
                  >
                    <InputLabel htmlFor="filled-adornment-travel">
                      Travel Options
                    </InputLabel>
                    <Select
                      labelId="filled-adornment-travel"
                      id="demo-simple-select"
                      value={way}
                      label="Travel Options"
                      onChange={handleWays}
                    >
                      <MenuItem value={"Airplane"}>Airplane</MenuItem>
                      <MenuItem value={"Train"}>Train</MenuItem>
                      <MenuItem value={"Bus"}>Bus</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl style={{ marginTop: "20px" }}>
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
                    onClick={save}
                  >
                    Save
                  </button>
                </div>
              </Box>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TravelDetails;
