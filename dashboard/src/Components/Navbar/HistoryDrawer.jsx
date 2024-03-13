import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { blueGrey } from "@mui/material/colors";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import { useSelector, useDispatch } from "react-redux";
import { removeTravelCard } from "../../state";
import ItineraryCard from "../Display/ItineraryCard";

export default function SwipeableTemporaryDrawer({
  openHistoryDrawer,
  setOpenHistoryDrawer,
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const travelCards = useSelector((state) => state.travelCards);
  const dispatch = useDispatch();

  const deleteItinerary = (index) => {
    // Dispatch an action to remove the card by index
    dispatch(removeTravelCard(index));
  };

  const preferredMode = useSelector((state) => state.mode);

  React.useEffect(() => {
    setIsOpen(openHistoryDrawer); // Sync internal state with external prop
  }, [openHistoryDrawer]);

  const toggleDrawer = (open) => (event) => {
    // if (
    //   event &&
    //   event.type === "keydown" &&
    //   (event.key === "Tab" || event.key === "Shift")
    // ) {
    //   return;
    // }

    setIsOpen(open); // Update internal state
    setOpenHistoryDrawer(open); // Notify external state of the change
  };


  const list = (
    <Box
      sx={{
        width: 400,
        height: '100%',
        display: "flex", // Explicitly state the display type for clarity
        flexDirection: "column", // Stack items vertically
        alignItems: "center", // Center items horizontally
        // justifyContent: "center", // Center items vertically (if there is extra space)
        textAlign: "center",
        backgroundColor: preferredMode === "dark" ? blueGrey[900] : "#fff"
      }}
      role="presentation"
      //   onClick={toggleDrawer(false)}
      //   onKeyDown={toggleDrawer(false)}
    >
      <h3 style={{ fontFamily: "Comic Sans MS", marginTop: '20px'}} className="h3-text">History</h3>
      {travelCards && travelCards.length > 0 && (
        <>
          <List>
            {travelCards.map((itinerary, index) => (
              <div style={{ marginTop: "20px" }}>
                <ItineraryCard
                  key={index}
                  index={index}
                  itineraryData={itinerary} // Pass the individual itinerary array
                  onClick={(event) => event.stopPropagation()} // Stop click events from propagating
                  onDelete={() => deleteItinerary(index)} // Pass the index if you want to enable deleting
                />
              </div>
            ))}
          </List>
          <Divider />
        </>
      )}
      {
        !travelCards || travelCards.length == 0 && (
            <h2 style={{color: "grey"}}>
                Not Available
            </h2>
        )
      }
    </Box>
  );

  return (
    <div>
      {/* <Button onClick={toggleDrawer(true)}>Right</Button> */}
      <SwipeableDrawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {list}
      </SwipeableDrawer>
    </div>
  );
}
