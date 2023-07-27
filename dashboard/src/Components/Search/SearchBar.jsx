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
import Reset from "./Others/Reset";

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
  var defaultDestination = useSelector((state) => state.destination);
  var defaultDeparture = useSelector((state) => state.departure);

  const travels = useSelector((state) => state.travels); // array
  const hotels = useSelector((state) => state.hotels); // array

  function setEditorColor() {
    setIconColor(blueGrey[900]);
  }

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

    const startDate = dayjs(oStartDate).format("YYYY-MM-DD");
    const endDate = dayjs(oEndDate).format("YYYY-MM-DD");
    // https://us-central1-serendipity-e1c63.cloudfunctions.net/searchFlight
    try {
      const response = await axios.post(
        "https://us-central1-serendipity-e1c63.cloudfunctions.net/searchFlight",
        {
          data: {
            slices: [
              {
                origin: departure,
                destination: destination,
                departure_date: startDate,
              },
              {
                origin: destination,
                destination: departure,
                departure_date: endDate,
              },
            ],
            passengers: [
              {
                type: "adult",
              },
            ],
            cabin_class: "business",
            max_connections: 0,
          },
        }
      );
      setStorage(response.data.data);
      // console.log(storage)
      // console.log(storage[0].owner.name);
    } catch (error) {
      console.error(error);
    }
  };

  function reset() {
    defaultDeparture = "";
    defaultDestination = "";
    dispatch(setLocation({ departure: null, destination: null }));
    console.log(departure);
  }

  React.useEffect(() => {});

  return (
    <>
      {visible && (
        <Box display="flex" flexDirection="row" sx={{ marginTop: "0px" }}>
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
          {visible && loggedin && <Reset />}
        </Box>
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
                                marginTop: "15px",
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
                                marginLeft: "40px",
                                marginTop: "15px",
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
                    onClick={handleClick}
                  >
                    Let's go!
                  </Button>
                  {storage && (
                    <Grid container spacing={2.5}>
                      <Grid xs={12} flexDirection="row">
                        <Item
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            marginRight: "2px",
                          }}
                        >
                          <div>
                            <h2>Results found...</h2>
                            {storage.map((item, index) => {
                              return (
                                <div key={index}>
                                  <h3>Flight {index + 1}</h3>
                                  <p>
                                    {item.owner.name}
                                    <img
                                      src={`https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${item.owner.iata_code}.svg`}
                                      width={24}
                                      height={24}
                                    />
                                    {item.total_amount +
                                      " " +
                                      item.total_currency}
                                  </p>

                                  <p>
                                    {formatDateTime(
                                      item.slices[0].segments[0].departing_at
                                    )}
                                    <hr width="10px"></hr>
                                    {formatDateTime(
                                      item.slices[0].segments[0].arriving_at
                                    )}
                                  </p>
                                  <hr></hr>
                                  <p>
                                    {formatDateTime(
                                      item.slices[1].segments[0].departing_at
                                    )}
                                    <hr width="10px"></hr>
                                    {formatDateTime(
                                      item.slices[1].segments[0].arriving_at
                                    )}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
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
