import React from "react";
import { Button } from "@mui/material/";
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
import { useAuth } from "../../AuthContext";
import SendIcon from "@mui/icons-material/Send";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import dayjs from "dayjs";

// the user will be allowed to proceed to use search bar only when they are logged in
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function SearchBar(loggedin) {
  const [isLoading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(true);
  const [destination, setDestination] = React.useState("");
  const [departure, setDeparture] = React.useState("");
  const [oStartDate, setStartDate] = React.useState(dayjs(""));
  const [oEndDate, setEndDate] = React.useState(dayjs(""));
  const [rate, setRating] = React.useState(5);
  const [price, setPrice] = React.useState([3000, 6000]);


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
              marginTop: "50px",
              marginRight: "0px",
            }}
            onClick={() => {
              if (loggedin.loggedin == true) {
                setLoading(true);
                setVisible(false);
              }
            }}
          >
            Generate Trip!
          </Button>
        </Bounce>
      )}
      {isLoading && loggedin && (
        <div className="contentBox">
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
                    />
                    <Destination
                      placeholder={"Destination"}
                      setDestination={setDestination}
                      marginLeft={"5px"}
                    />
                  </Item>
                </Grid>
                <Grid xs={3}>
                  <Item>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Start date"
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
                        onChange={(newValue) => setEndDate(newValue)}
                      />
                    </LocalizationProvider>
                  </Item>
                </Grid>
                <Grid xs={6}>
                  <Item style={{ display: "flex", flexDirection: "row" }}>
                    <CustomizedSlider setPrice={setPrice} />
                    <Button
                      sx={{
                        width: "150px",
                        textAlign: "center",
                        alignContent: "center",
                        marginLeft: "65px",
                      }}
                      variant="contained"
                    >
                      Travel Details
                    </Button>
                  </Item>
                </Grid>
                <Grid xs={6}>
                  <Item style={{ display: "flex", flexDirection: "row" }}>
                    <BasicRating rate={rate} setRating={setRating} />
                    <Button
                      sx={{
                        width: "150px",
                        textAlign: "center",
                        alignContent: "center",
                        marginLeft: "120px",
                      }}
                      variant="contained"
                    >
                      Hotel Details
                    </Button>
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
                onClick={generateTrip}
              >
                Let's go!
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchBar;
