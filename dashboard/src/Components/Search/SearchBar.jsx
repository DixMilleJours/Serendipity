import React from "react";
import { Button, TextField } from "@mui/material/";
import { blueGrey } from "@mui/material/colors";
import { Bounce } from "../../Animations/Bounce";
import Departure from "./Others/Departure";
import Destination from "./Others/Destination";
import CustomizedSlider from "./Others/Budget";
import BasicRating from "./Others/Hotel";
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
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import { setLocation, setTravelCard } from "../../state";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import ItineraryCard from "../Display/ItineraryCard";

import {
  httpsCallable,
  getFunctions,
  connectFunctionsEmulator,
} from "firebase/functions";

// the user will be allowed to proceed to use search bar only when they are logged in
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  justifyContent: "center",
  color: theme.palette.text.secondary,
}));

function checkEmptyOrNull(data) {
  for (let key in data) {
    if (data[key] === "" || data[key] === null) {
      return true; // Returns true if any property is an empty string or null
    }

    // If the property is an object, recursively check its properties
    if (
      typeof data[key] === "object" &&
      !Array.isArray(data[key]) &&
      data[key] !== null
    ) {
      if (checkEmptyOrNull(data[key])) {
        return true; // Returns true if any nested property is an empty string or null
      }
    }
  }
  return false; // Returns false if no properties are empty or null
}

function SearchBar({ loggedin, setError, setSelected }) {
  const [isProgress, setProgress] = React.useState(false);
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
  const [itineraryData, setItineraryData] = React.useState([]);

  const dispatch = useDispatch();
  const defaultDestination = useSelector((state) => state.destination);
  const defaultDeparture = useSelector((state) => state.departure);

  const travels = useSelector((state) => state.travels); // array
  const hotels = useSelector((state) => state.hotels); // array

  // Preference
  const [food, setFood] = React.useState("");
  const [POI, setPOI] = React.useState("");

  const [isScreen, setScreen] = React.useState(window.innerWidth < 1000);

  const groupItineraryData = (data, itemsPerRow) => {
    return data.reduce((rows, item, idx) => {
      const rowIdx = Math.floor(idx / itemsPerRow);
      if (!rows[rowIdx]) {
        rows[rowIdx] = []; // Start a new row
      }
      rows[rowIdx].push(item);
      return rows;
    }, []);
  };

  const rows = groupItineraryData(itineraryData, 3);

  React.useEffect(() => {
    const handleResize = () => {
      // Update the state based on the new window width
      setScreen(window.innerWidth < 1000);
    };

    // Set up the event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function setEditorColor() {
    setIconColor(blueGrey[900]);
  }

  const handleChangeDiningPreference = (event) => {
    setFood(event.target.value);
  };

  const handleChangePOI = (event) => {
    setPOI(event.target.value);
  };

  const deleteItinerary = (indexToDelete) => {
    setItineraryData((currentItineraries) =>
      currentItineraries.filter((_, index) => index !== indexToDelete)
    );
  };

  // Testing connection to back-end
  const [storage, setStorage] = React.useState();

  const flightData = {
    departure: travels[4],
    destination: travels[5],
    startDate: dayjs(oStartDate).format("YYYY-MM-DD"),
    endDate: dayjs(oEndDate).format("YYYY-MM-DD"),
    travelDetails: travels,
  };

  const hotelData = {
    rating: rate,
    destination: travels[5],
    startDate: dayjs(oStartDate).format("YYYY-MM-DD"),
    endDate: dayjs(oEndDate).format("YYYY-MM-DD"),
    rooms: hotels[0],
    adults: travels[2],
  };

  const userPreference = {
    restaurant: food,
    poi: POI,
  };

  const handleClickV2 = async () => {
    if (
      checkEmptyOrNull(flightData) ||
      checkEmptyOrNull(hotelData) ||
      checkEmptyOrNull(userPreference)
    ) {
      setError({
        open: true,
        content: "Fields should not be empty",
      });
      return;
    }
    try {
      setProgress(true);
      const functionss = getFunctions();
      // connectFunctionsEmulator(functionss, "127.0.0.1", 5001);
      const generator = httpsCallable(functionss, "generator");
      const finalResult = await generator({
        flightData,
        hotelData,
        userPreference,
      });
      // Read result of the Cloud Function.
      const result = finalResult.data.finalResult;
      // Remove the ```json and ``` from the string
      const jsonResult = result.replace(/^```json\s*|^```\s*|\s*```$/g, "");
      console.log(jsonResult);
      setProgress(false);
      const data = JSON.parse(jsonResult);
      setStorage(data);
      // Use the parsed array in your state
      const newItinerary = {
        // ... your itinerary data here
        data,
      };

      // Add the new itinerary to the array of itineraries
      setItineraryData([...itineraryData, data]);

      // setItineraryData(data);
      dispatch(
        setTravelCard({
          store: data,
        })
      );
    } catch (error) {
      setProgress(false);
      setError({
        open: true,
        content: `${error.message}`,
      });
    }
  };

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
                setSelected(true);
                setLoading(true);
                setVisible(false);
              } else {
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
                  {!isScreen && (
                    <Grid
                      container
                      spacing={2.5}
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
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
                        <Item style={{ display: "flex", flexDirection: "row" }}>
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
                                  style={{
                                    cursor: "pointer",
                                    color: iconColor,
                                  }}
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
                                  style={{
                                    cursor: "pointer",
                                    color: iconColor,
                                  }}
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
                          <Box sx={{ minWidth: 210 }}>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                Dining Preference
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={food}
                                label="Dining Preference"
                                onChange={handleChangeDiningPreference}
                              >
                                <MenuItem value={"Chinese"}>
                                  🥡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Chinese
                                </MenuItem>
                                <MenuItem value={"Korean"}>
                                  🍜&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Korean
                                </MenuItem>
                                <MenuItem value={"French"}>
                                  🥖&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;French
                                </MenuItem>
                                <MenuItem value={"Indian"}>
                                  🍛&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Indian
                                </MenuItem>
                                <MenuItem value={"Japanese"}>
                                  🍣&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Japanese
                                </MenuItem>
                                <MenuItem value={"Mexican"}>
                                  🌮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mexican
                                </MenuItem>
                                <MenuItem value={"Thai"}>
                                  🥘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Thai
                                </MenuItem>
                                <MenuItem value={"American"}>
                                  🍔&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;American
                                </MenuItem>
                                <MenuItem value={"Greek"}>
                                  🥙&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Greek
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </Item>
                      </Grid>
                      <Grid xs={6}>
                        <Item style={{ display: "flex", flexDirection: "row" }}>
                          <Box sx={{ minWidth: 210 }}>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                Trip Preference
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={POI}
                                label="Trip Preference"
                                onChange={handleChangePOI}
                              >
                                <MenuItem value={"park"}>
                                  🎡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Park
                                </MenuItem>
                                <MenuItem value={"art_gallery"}>
                                  🎨&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Art
                                  Gallery
                                </MenuItem>
                                <MenuItem value={"campground"}>
                                  ⛺️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Campground
                                </MenuItem>
                                <MenuItem value={"church"}>
                                  ⛪️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Church
                                </MenuItem>
                                <MenuItem value={"zoo"}>
                                  🐘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Zoo
                                </MenuItem>
                                <MenuItem value={"university"}>
                                  🎓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;University
                                </MenuItem>
                                <MenuItem value={"shopping_mall"}>
                                  🛍&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Shopping
                                  Mall
                                </MenuItem>
                                <MenuItem value={"museum"}>
                                  🏛&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Museum
                                </MenuItem>
                                <MenuItem value={"bar"}>
                                  🍺&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bar
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </Item>
                      </Grid>
                    </Grid>
                  )}
                  {isScreen && (
                    <Grid
                      container
                      spacing={2}
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid xs={6} flexDirection="row">
                        <Item
                          style={{
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <Departure
                            placeholder={"Departure"}
                            setDeparture={setDeparture}
                            defaultValue={defaultDeparture}
                          />
                        </Item>
                      </Grid>
                      <Grid xs={6} flexDirection="row">
                        <Item
                          style={{
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <Destination
                            placeholder={"Destination"}
                            setDestination={setDestination}
                            defaultValue={defaultDestination}
                          />
                        </Item>
                      </Grid>
                      <Grid xs={6}>
                        <Item style={{ display: "flex", flexDirection: "row" }}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              sx={{
                                width: "auto",
                              }}
                              label="Start date"
                              value={oStartDate}
                              onChange={(newValue) => setStartDate(newValue)}
                            />
                          </LocalizationProvider>
                        </Item>
                      </Grid>
                      <Grid xs={6}>
                        <Item>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              sx={{
                                width: "auto",
                              }}
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
                                  style={{
                                    cursor: "pointer",
                                    color: iconColor,
                                  }}
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
                                marginLeft: "25px",
                                width: "150px",
                                textAlign: "center",
                                alignContent: "center",
                              }}
                              variant="contained"
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
                                  style={{
                                    cursor: "pointer",
                                    color: iconColor,
                                  }}
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
                          {/* <Box sx={{ minWidth: 270 }}> */}
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label" style={{width: 'auto'}}>
                                Dining Preference
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={food}
                                label="Dining Preference"
                                onChange={handleChangeDiningPreference}
                              >
                                <MenuItem value={"Chinese"}>
                                  🥡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Chinese
                                </MenuItem>
                                <MenuItem value={"Korean"}>
                                  🍜&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Korean
                                </MenuItem>
                                <MenuItem value={"French"}>
                                  🥖&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;French
                                </MenuItem>
                                <MenuItem value={"Indian"}>
                                  🍛&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Indian
                                </MenuItem>
                                <MenuItem value={"Japanese"}>
                                  🍣&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Japanese
                                </MenuItem>
                                <MenuItem value={"Mexican"}>
                                  🌮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mexican
                                </MenuItem>
                                <MenuItem value={"Thai"}>
                                  🥘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Thai
                                </MenuItem>
                                <MenuItem value={"American"}>
                                  🍔&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;American
                                </MenuItem>
                                <MenuItem value={"Greek"}>
                                  🥙&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Greek
                                </MenuItem>
                              </Select>
                            </FormControl>
                          {/* </Box> */}
                        </Item>
                      </Grid>
                      <Grid xs={6}>
                        <Item style={{ display: "flex", flexDirection: "row" }}>
                          {/* <Box sx={{ minWidth: 270 }}> */}
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label" style={{width: 'auto'}}>
                                Trip Preference
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={POI}
                                label="Trip Preference"
                                onChange={handleChangePOI}
                              >
                                <MenuItem value={"park"}>
                                  🎡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Park
                                </MenuItem>
                                <MenuItem value={"art_gallery"}>
                                  🎨&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Art
                                  Gallery
                                </MenuItem>
                                <MenuItem value={"campground"}>
                                  ⛺️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Campground
                                </MenuItem>
                                <MenuItem value={"church"}>
                                  ⛪️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Church
                                </MenuItem>
                                <MenuItem value={"zoo"}>
                                  🐘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Zoo
                                </MenuItem>
                                <MenuItem value={"university"}>
                                  🎓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;University
                                </MenuItem>
                                <MenuItem value={"shopping_mall"}>
                                  🛍&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Shopping
                                  Mall
                                </MenuItem>
                                <MenuItem value={"museum"}>
                                  🏛&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Museum
                                </MenuItem>
                                <MenuItem value={"bar"}>
                                  🍺&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bar
                                </MenuItem>
                              </Select>
                            </FormControl>
                          {/* </Box> */}
                        </Item>
                      </Grid>
                    </Grid>
                  )}

                  {/* </Box> */}
                  {isProgress && (
                    <Box sx={{ marginTop: "50px" }}>
                      <CircularProgress />
                    </Box>
                  )}
                  {!isProgress && (
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
                  )}

                  {/* =============================== PARSING RESULTS ========================= */}
                  <div style={{ height: 40 }}></div>
                  {/* <div style={{ display: "flex", overflowX: "auto" }}> */}
                  {storage &&
                    rows.map((row, rowIndex) => (
                      <div
                        key={rowIndex}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          marginBottom: "20px",
                        }}
                      >
                        {row.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            style={{
                              marginLeft: itemIndex > 0 ? "20px" : "0px",
                            }}
                          >
                            <ItineraryCard
                              index={itemIndex}
                              itineraryData={item}
                              onDelete={() => deleteItinerary(itemIndex)}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  {/* </div> */}

                  {/* {travelCards && travelCards.length > 0 && (
                    <ItineraryCard
                      itineraryData={travelCards[0]}
                      // onDelete={() => deleteItinerary(index)}
                    />
                  )} */}
                  {/* </div> */}
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
