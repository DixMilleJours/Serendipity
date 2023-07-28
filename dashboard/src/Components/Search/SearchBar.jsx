import React from "react";
import { Button, TextField } from "@mui/material/";
import { blueGrey } from "@mui/material/colors";
import { Bounce } from "../../Animations/Bounce";
import Departure from "./Others/Departure";
import Destination from "./Others/Destination";
import CustomizedSlider from "./Others/Budget";
import BasicRating from "./Others/Hotel";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import EditNoteIcon from "@mui/icons-material/EditNote";
import TravelDetails from "./Others/TravelDetails";
import HotelDetails from "./Others/HotelDetails";
import TravelInfo from "./Others/TravelInfo";
import HotelInfo from "./Others/HotelInfo";
import { useAuth } from "../../AuthContext";
import SendIcon from "@mui/icons-material/Send";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setLocation } from "../../state";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

import MenuItem from '@mui/material/MenuItem';

import {
  httpsCallable,
  getFunctions,
  connectFunctionsEmulator,
} from "firebase/functions";
import { getApp } from "firebase/app";

// the user will be allowed to proceed to use search bar only when they are logged in
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function SearchBar({ loggedin, setError }) {
  const [isLoading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(true);
  const [destination, setDestination] = React.useState("");
  const [departure, setDeparture] = React.useState("");
  const [oStartDate, setStartDate] = React.useState(dayjs(dayjs().toDate()));
  const [oEndDate, setEndDate] = React.useState(dayjs(dayjs().toDate()));
  const [rate, setRating] = React.useState(5);
  const [price, setPrice] = React.useState([3000, 6000]);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [isTravelDetails, setTravelDetails] = React.useState(false);
  const [isTravelModalOpen, setTravelModalOpen] = React.useState(false);
  const [isHotelDetails, setHotelDetails] = React.useState(false);
  const [iconColor, setIconColor] = React.useState(blueGrey[500]);

  const dispatch = useDispatch();
  const defaultDestination = useSelector((state) => state.destination);
  const defaultDeparture = useSelector((state) => state.departure);

  const travels = useSelector((state) => state.travels); // array
  const hotels = useSelector((state) => state.hotels); // array

  // Preference
  const [food, setFood] =React.useState("");
  const [POI, setPOI] = React.useState("");

  function setEditorColor() {
    setIconColor(blueGrey[900]);
  }

  const handleChangeDiningPreference = (event) => {
    setFood(event.target.value);
  };

  const handleChangePOI =(event) =>{
    setPOI(event.target.value);
  }

  const splitContent = (content) => {
    // Regular expression to match the day numbers (assuming they are in the format "Day X")
    const dayRegex = /Day\s+\d+ [^:]+:\s+/g;
    return content.split(dayRegex);
  };

  async function generateTrip(e) {
    e.preventDefault();
    // dictionary value
    const startDate = dayjs(oStartDate).format("YYYY-MM-DD");
    const endDate = dayjs(oEndDate).format("YYYY-MM-DD");

    if (dayjs(startDate).isBefore(endDate)) {
      const tripValue = {
        departure,
        destination,
        startDate,
        endDate,
        rate,
        price,
        travels,
        hotels,
      };
      console.log(tripValue);
      try {
        // Send date to backend
      } catch (error) {}
    } else {
      alert("date format error");
      window.location.href = "/home";
    }
  }

  // Testing connection to back-end
  const [storage, setStorage] = React.useState();
  let navigate = useNavigate();

  const handleClick = async () => {
    // reset storage
    setStorage();
    setStorage();

    const startDate = dayjs(oStartDate).format("YYYY-MM-DD");
    const endDate = dayjs(oEndDate).format("YYYY-MM-DD");
    // https://us-central1-serendipity-e1c63.cloudfunctions.net/searchFlight
    try {
      // reset storage
      setStorage();

      // const startDate = dayjs(oStartDate).format("YYYY-MM-DD");
      // const endDate = dayjs(oEndDate).format("YYYY-MM-DD");
      // https://us-central1-serendipity-e1c63.cloudfunctions.net/searchFlight

      // ！！！ local testing for now.
      // const response = await axios.get(
      //   "http://127.0.0.1:5001/serendipity-e1c63/us-central1/searchFlightV2"
      // );
      // setStorage(response.data.data);
      // Call getOptimalFlight cloud function with the flight data
      const functions = getFunctions();
      // !!! switch to use deployed function later
      const functionss = getFunctions(getApp());
      connectFunctionsEmulator(functionss, "127.0.0.1", 5001);

      const getFinalResult = httpsCallable(functionss, "generator");
      // !!! harcode budget for now.
      const finalResult = await getFinalResult({
        // flightData: response.data,
        // budget: "1000",
      });

      // Read result of the Cloud Function.
      const optimalResult = finalResult.data.gptResponse.content;
      console.log(optimalResult);
      setStorage(optimalResult);
    } catch (error) {
      console.error(error);
      console.error(error);
    }
  };

  const flightData = {
    departure: departure,
    destination: destination,
    startDate: dayjs(oStartDate).format("YYYY-MM-DD"),
    endDate: dayjs(oEndDate).format("YYYY-MM-DD"),
    travelDetails: travels
  }

  const hotelData = {
    rating: rate,
    destination: destination,
    startDate: dayjs(oStartDate).format("YYYY-MM-DD"),
    endDate: dayjs(oEndDate).format("YYYY-MM-DD"),
    rooms: hotels[0],
    adults: travels[2]
  }

  const userPreference = {
    restaurant: food,
    poi: POI,
  }

  const handleClickV2 = async () => {
    console.log({
      flightData,
      hotelData,
      userPreference
    })
    try {
      setStorage("")
    const functionss = getFunctions();
    connectFunctionsEmulator(functionss, "127.0.0.1", 5001);
    const generator = httpsCallable(functionss, "generator");
    const finalResult = await generator({
      flightData,
      hotelData,
      userPreference
    });
    // Read result of the Cloud Function.
    const result = finalResult.data.finalResult;
    setStorage(result)
    } catch (error) {
      console.error(`Error in handleClickV2: ${error.message}`);
      // Set error message in storage
      setStorage("An error occurred. Please re-enter your information and try again.");
    }
  }

  return (
    <>
      {visible && (
        <Bounce y={-15} timing={150}>
          <Button
            variant="contained"
            style={{
              color: "white",
              fontSize: "18px",
              width: "200px",
              marginRight: "0px",
            }}
            onClick={() => {
              if (loggedin == true) {
                setLoading(true);
                setVisible(false);
              }else{
                setError({
                  open: true,
                  content: "Login is required to view the trip generator",
                });
              }
            }}
          >
            Generate Trip!
          </Button>
        </Bounce>
      )}
      {isLoading && loggedin && (
        <React.Fragment>
          {isTravelModalOpen && !isTravelDetails && (
            <TravelDetails
              setTravelModalOpen={setTravelModalOpen}
              setTravelDetails={setTravelDetails}
            />
          )}
          {isModalOpen && !isHotelDetails && (
            <HotelDetails
              setModalOpen={setModalOpen}
              setHotelDetails={setHotelDetails}
            />
          )}
          {!isModalOpen && !isTravelModalOpen && (
            <div
              className="contentBox"
              style={{
                marginTop: "50px",
              }}
            >
              <div className="formBox">
                <form>
                  {/* <Box sx={{ flexGrow: 1 }}> */}
                  <Grid container spacing={2.5}>
                    <Grid xs={6} flexDirection="row">
                      <Item
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          marginRight: "2px",
                        }}
                      >
                        <Departure
                          placeholder={"Departure"}
                          setDeparture={setDeparture}
                          defaultValue={defaultDeparture}
                        />
                        <Destination
                          placeholder={"Destination"}
                          setDestination={setDestination}
                          marginLeft={"5px"}
                          defaultValue={defaultDestination}
                        />
                      </Item>
                    </Grid>
                    <Grid xs={3}>
                      <Item>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Start date"
                            value={oStartDate}
                            onChange={(newValue) => setStartDate(newValue)}
                          />
                        </LocalizationProvider>
                      </Item>
                    </Grid>
                    <Grid xs={3}>
                      <Item>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="End date"
                            value={oEndDate}
                            onChange={(newValue) => setEndDate(newValue)}
                          />
                        </LocalizationProvider>
                      </Item>
                    </Grid>
                    <Grid xs={6}>
                      <Item style={{ display: "flex", flexDirection: "row" }}>
                        <CustomizedSlider setPrice={setPrice} price={price} />
                        {/* ===== Travel Details Button ===== */}
                        {!isTravelDetails && (
                          <Button
                            sx={{
                              width: "150px",
                              textAlign: "center",
                              alignContent: "center",
                              marginLeft: "65px",
                            }}
                            variant="contained"
                            onClick={() => {
                              if (departure === null || destination === null) {
                                setError({
                                  open: true,
                                  content:
                                    "departure or destination should not be empty",
                                });
                              } else {
                                setTravelModalOpen(true);
                                setTravelDetails(false);
                                dispatch(
                                  setLocation({
                                    departure: departure,
                                    destination: destination,
                                  })
                                );
                              }
                            }}
                          >
                            Travel Details
                          </Button>
                        )}
                        {/* ===== Parse Contents, Editor Button ===== */}
                        {isTravelDetails && (
                          <React.Fragment>
                            <Box
                              sx={{
                                marginTop: "25px",
                                marginLeft: "20px",
                                textAlign: "center",
                                alignItems: "center",
                                pl: 2,
                              }}
                            >
                              <TravelInfo
                                setTravelModalOpen={setTravelModalOpen}
                              />
                            </Box>
                            <Box sx={{ marginTop: "50px" }}>
                              <EditNoteIcon
                                style={{ cursor: "pointer", color: iconColor }}
                                onClick={() => {
                                  if (
                                    departure === null ||
                                    destination === null
                                  ) {
                                    setError({
                                      open: true,
                                      content:
                                        "departure or destination should not be empty",
                                    });
                                  } else {
                                    setTravelModalOpen(true);
                                    setTravelDetails(false);
                                    dispatch(
                                      setLocation({
                                        departure: departure,
                                        destination: destination,
                                      })
                                    );
                                  }
                                }}
                              />
                            </Box>
                          </React.Fragment>
                        )}
                      </Item>
                    </Grid>
                    <Grid xs={6}>
                      <Item style={{ display: "flex", flexDirection: "row" }}>
                        <BasicRating setRating={setRating} rate={rate} />
                        {!isHotelDetails && (
                          <Button
                            sx={{
                              marginLeft: "50px",
                              width: "150px",
                              textAlign: "center",
                              alignContent: "center",
                            }}
                            variant="contained"
                            onClick={() => {
                              if (departure === null || destination === null) {
                                setError({
                                  open: true,
                                  content:
                                    "departure or destination should not be empty",
                                });
                              } else {
                                setModalOpen(true);
                                setHotelDetails(false);
                                dispatch(
                                  setLocation({
                                    departure: departure,
                                    destination: destination,
                                  })
                                );
                              }
                            }}
                          >
                            Hotel Details
                          </Button>
                        )}

                        {isHotelDetails && (
                          <React.Fragment>
                            <Box
                              sx={{
                                marginLeft: "0px",
                                marginTop: "25px",
                                textAlign: "center",
                                alignItems: "center",
                                pl: 2,
                              }}
                            >
                              <HotelInfo />
                            </Box>
                            <Box sx={{ marginTop: "50px" }}>
                              <EditNoteIcon
                                style={{ cursor: "pointer", color: iconColor }}
                                onMouseHover={setEditorColor}
                                onClick={() => {
                                  if (
                                    departure === null ||
                                    destination === null
                                  ) {
                                    setError({
                                      open: true,
                                      content:
                                        "departure or destination should not be empty",
                                    });
                                  } else {
                                    setModalOpen(true);
                                    setHotelDetails(false);
                                    dispatch(
                                      setLocation({
                                        departure: departure,
                                        destination: destination,
                                      })
                                    );
                                  }
                                }}
                              />
                            </Box>
                          </React.Fragment>
                        )}
                      </Item>
                    </Grid>
                    {/* Temporary Addition */}
                    <Grid xs={6}>
                      <Item style={{ display: "flex", flexDirection: "row" }}>
                        <TextField
                          label="Departure"
                          onChange={(event) => {
                            setDeparture(event.target.value);
                          }}
                        ></TextField>
                      </Item>
                    </Grid>
                    <Grid xs={6}>
                      <Item style={{ display: "flex", flexDirection: "row" }}>
                        <TextField
                          label="Destination"
                          onChange={(event) => {
                            setDestination(event.target.value);
                          }}
                        ></TextField>
                      </Item>
                    </Grid>
                    <Grid xs={6}>
                      <Item style={{ display: "flex", flexDirection: "row" }}>
                      <Box sx={{ minWidth: 210 }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">Dining Preference</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={food}
                            label="Dining Preference"
                            onChange={handleChangeDiningPreference}
                          >
                            <MenuItem value={"Chinese"}>🥡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Chinese</MenuItem>
                            <MenuItem value={"Korean"}>🍜&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Korean</MenuItem>
                            <MenuItem value={"French"}>🥖&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;French</MenuItem>
                            <MenuItem value={"Indian"}>🍛&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Indian</MenuItem>
                            <MenuItem value={"Japanese"}>🍣&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Japanese</MenuItem>
                            <MenuItem value={"Mexican"}>🌮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mexican</MenuItem>
                            <MenuItem value={"Thai"}>🥘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Thai</MenuItem>
                            <MenuItem value={"American"}>🍔&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;American</MenuItem>
                            <MenuItem value={"Greek"}>🥙&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Greek</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      </Item>
                    </Grid>
                    <Grid xs={6}>
                      <Item style={{ display: "flex", flexDirection: "row" }}>
                      <Box sx={{ minWidth: 210 }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">Trip Preference</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={POI}
                            label="Trip Preference"
                            onChange={handleChangePOI}
                          >
                            <MenuItem value={"park"}>🎡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Park</MenuItem>
                            <MenuItem value={"art_gallery"}>🎨&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Art Gallery</MenuItem>
                            <MenuItem value={"campground"}>⛺️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Campground</MenuItem>
                            <MenuItem value={"church"}>⛪️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Church</MenuItem>
                            <MenuItem value={"zoo"}>🐘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Zoo</MenuItem>
                            <MenuItem value={"university"}>🎓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;University</MenuItem>
                            <MenuItem value={"shopping_mall"}>🛍&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Shopping Mall</MenuItem>
                            <MenuItem value={"museum"}>🏛&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Museum</MenuItem>
                            <MenuItem value={"bar"}>🍺&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bar</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      </Item>
                    </Grid>
                  </Grid>
                  {/* </Box> */}
                  <Button
                    sx={{
                      width: "150px",
                      marginTop: "50px",
                      textAlign: "center",
                      alignContent: "center",
                    }}
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={handleClickV2}
                  >
                    Let's go!
                  </Button>
                  {storage && (
                    <Grid container spacing={2.5}>
                      <Grid xs={12} flexDirection="column">
                        <Item
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginRight: "2px",
                          }}
                        >
                          <hr></hr>
                          {splitContent(storage).map((part, index) => (
                          <div key={index} style={{
                            fontSize: "16px",
                            color: "#FFFFFF",
                          }}>
                 
                          {index > 0 ? (<div>  <p> Day {index} </p> </div>) : (<br/>)}
                          {part}
                        </div>
                         ))}
                        </Item>
                      </Grid>
                    </Grid>
                  )}
                </form>
              </div>
            </div>
          )}
        </React.Fragment>
      )}
    </>
  );
}

const formatDateTime = (dateTimeString) => {
  // Convert string to Date object
  const dateObj = new Date(dateTimeString);

  // Extract the date and time components
  const date = dateObj.toLocaleDateString("en-US");
  const time = dateObj.toLocaleTimeString("en-US");

  // Concatenate the date and time components
  const formattedString = `${date}, ${time}`;

  return formattedString;
};

export default SearchBar;
