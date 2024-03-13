import { pink, grey } from "@mui/material/colors";
import React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TravelDeparture from "./TravelDepature";
import { TravelDestination } from "./TravelDestination";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Modal from "@mui/material/Modal";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useSelector, useDispatch } from "react-redux";
import { setTravel } from "../../../state";
import "../../../static/css/modal.css";
import "../../../static/css/login.css";


function TravelDetails({ setTravelModalOpen, setTravelDetails }) {
  const preferredMode = useSelector((state) => state.mode);
  const travels = useSelector((state) => state.travels);
  const [bgcolor, setBgcolor] = React.useState("");
  const [containerColor, setContainerColor] = React.useState("");
  const [departure, setDeparture] = React.useState(travels[4]);
  const [destination, setDestination] = React.useState(travels[5]);
  const dispatch = useDispatch();
  const [way, setWay] = React.useState(travels[0]);
  const [classOption, setClassOption] = React.useState(travels[1]);
  const [adults, setAdults] = React.useState(travels[2]);
  const [children, setChildren] = React.useState(travels[3]);

  React.useEffect(() => {
    if (preferredMode === "dark") {
      setBgcolor("black");
      setContainerColor(grey[900]);
    }
    console.log(departure);
    console.log(destination);
  }, []);

  const handleWays = (event) => {
    setWay(event.target.value);
  };

  const handleClass = (event) => {
    setClassOption(event.target.value);
  };

  function handleClose() {
    // dispatch(setLocation({ departure, destination }));
    dispatch(
      setTravel({
        way: way,
        classOption: classOption,
        adults: adults,
        children: children,
        departure: departure,
        destination: destination,
      })
    );
    setTravelModalOpen(false);
    setTravelDetails(true);
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
            className="h3-text"
          >
            Travel&nbsp;&nbsp;&nbsp;&nbsp;Details
          </h3>
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
                      value={classOption}
                      onChange={handleClass}
                    >
                      <FormControlLabel
                        value="ECONOMY"
                        control={<Radio />}
                        label="Economy"
                      />
                      <FormControlLabel
                        value="PREMIUM_ECONOMY"
                        control={<Radio />}
                        label="Premium"
                      />
                      <FormControlLabel
                        value="BUSINESS"
                        control={<Radio />}
                        label="Business"
                      />
                      <FormControlLabel
                        value="FIRST"
                        control={<Radio />}
                        label="First"
                      />
                    </RadioGroup>
                  </FormControl>
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
                    />
                    &nbsp;
                    <span>Children</span>&nbsp;
                    <RemoveCircleOutlineIcon
                      sx={{ color: pink[500] }}
                      onClick={removeChildren}
                    />
                    &nbsp;
                    {children}&nbsp;
                    <AddCircleIcon
                      sx={{ color: pink[500] }}
                      onClick={addChildren}
                    />
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
                    <TravelDeparture
                      placeholder={"Departure"}
                      setDeparture = {setDeparture}
                      defaultValue = {departure}
                    />
                  </FormControl>
                  <FormControl style={{ marginTop: "20px" }}>
                    <TravelDestination
                      placeholder={"Destination"}
                      setDestination = {setDestination}
                      defaultValue = {destination}
                    />
                  </FormControl>

                  <button
                    className="saveBtn"
                    type="submit"
                    id="bt-register"
                    style={{ marginTop: "50px" }}
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

export default TravelDetails;
