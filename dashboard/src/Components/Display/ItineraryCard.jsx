import React, { useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { useSelector, useDispatch } from "react-redux";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Modal from "@mui/material/Modal";
import B1 from "../../static/images/bg1.jpg";
import B2 from "../../static/images/bg2.jpg";
import B3 from "../../static/images/bg3.jpg";
import B4 from "../../static/images/bg4.jpg";
import B5 from "../../static/images/bg5.jpg";
import Typography from "@mui/material/Typography";
import "../../static/css/modal.css";
import { blueGrey, pink, teal } from "@mui/material/colors";
import { useInView } from "react-intersection-observer";
import Checkbox from '@mui/material/Checkbox';
import useVisible from "./useVisible";

function getImageSrc(randomNumber) {
  switch (randomNumber) {
    case 1:
      return B1;
    case 2:
      return B2;
    case 3:
      return B3;
    case 4:
      return B4;
    case 5:
      return B5;
    default:
      return ''; // Default image or empty string if none is selected
  }
}

const FadeInCard = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <Card ref={ref} className={`fade-in ${inView ? "fade-in-visible" : ""}`}>
      {children}
    </Card>
  );
};

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ItineraryCard({ index, itineraryData = [], onDelete }) {
  const preferredMode = useSelector((state) => state.mode);
  const [expanded, setExpanded] = React.useState(false);
  const [open, setOpen] = React.useState(false); // Assuming you want to control the open state of the modal
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };


  // console.log(itineraryData);

  const handleClose = () => {
    setOpen(false); // This will close the modal when invoked
    setExpanded(false);
  };

  const handleOpen = () => {
    setOpen(true); // This will open the modal when invoked
  };

  const [visibility, setVisibility] = useState(
    new Array(itineraryData.length).fill(false)
  );

  // Refs for each of the items
  const itemRefs = useRef(
    new Array(itineraryData.length).fill().map(() => React.createRef())
  );

  const [randomNumber, setRandomNumber] = useState(null);

  React.useEffect(() => {
    // Generate a random number between 1 and 5 only once when the component mounts
    setRandomNumber(Math.floor(Math.random() * 5) + 1);
  }, []);

  const imageSrc = getImageSrc(randomNumber);

  // Effect to attach the IntersectionObserver to each ref
  // React.useEffect(() => {
  //   const observerCallback = (entries, observer) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         // Use the entry's target to find the index and update visibility state
  //         const index = itemRefs.current.indexOf(entry.target);
  //         setVisibility((prevVisibility) => ({
  //           ...prevVisibility,
  //           [index]: true, // Set visible
  //         }));
  //       }
  //     });
  //   };

  //   const observerOptions = {
  //     root: null,
  //     rootMargin: "0px",
  //     threshold: 0.1,
  //   };

  //   const observer = new IntersectionObserver(
  //     observerCallback,
  //     observerOptions
  //   );

  //   itemRefs.current.forEach((ref) => {
  //     if (ref.current) {
  //       observer.observe(ref.current);
  //     }
  //   });

  //   // Cleanup observer on unmount
  //   return () => {
  //     if (itemRefs.current) {
  //       itemRefs.current.forEach((ref) => {
  //         if (ref.current) {
  //           observer.unobserve(ref.current);
  //         }
  //       });
  //     }
  //   };
  // }, [itineraryData]);

  if (!Array.isArray(itineraryData)) {
    console.error('itineraryData is not an array', itineraryData);
    // Handle the case when itineraryData is not an array
    return;
  }

  return (
    <Card
      sx={{
        maxWidth: 345,
        backgroundColor: preferredMode == "dark" ? "#1A2027" : "#fff",
      }}
    >
      {/* Card content */}
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: pink[300] }} aria-label="recipe">
            S
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={"Travel Card " + index} 
        subheader={dateString}
      />
      <CardMedia
        component="img"
        height="194"
        image= {imageSrc}
        alt="Travel Card"
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflowY: "scroll", // This makes the whole modal area potentially scrollable, depending on the modal implementation
          }}
        >
          <div
            style={{
              backgroundColor: preferredMode == "dark" ? "#1A2027" : "#fff",
              borderRadius: "12px",
              overflowY: "auto", // Enables scrolling for overflow content
              maxHeight: "80vh", // Sets a maximum height for the modal content (80% of the viewport height)
              width: "1200px", // Or a specific width if needed
              margin: "20px", // Adds some space around the modal to ensure it doesn't touch the edges of the viewport
            }}
          >
            {/* Modal content */}
            {/* <FadeInCard> */}
            {itineraryData.map((item, index) => {
              return (
                <div
                  key={index}
                  sx={{ margin: 2, padding: 2 }}
                  ref={itemRefs.current[index]}
                  // className={`fade-in ${visibility[index] ? 'visible' : ''}`}
                >
                  <CardContent style={{ alignContent: "center" }}>
                    {/* Display the title if it exists */}
                    {item.title && (
                      <Typography
                        variant="h3"
                        gutterBottom
                        style={{
                          fontFamily: "Comic Sans MS",
                          marginLeft: "10%",
                          marginRight: "10%",
                          marginTop: 20,
                          textAlign: 'center'
                        }}
                      >
                        {item.title}
                      </Typography>
                    )}

                    {/* Display the day and its activities if they exist */}
                    {item.day && (
                      <>
                        <div style={{marginLeft: '10%'}}>
                          <Typography
                            variant="h5"
                            gutterBottom
                            style={{ color: pink[500],fontFamily: "Comic Sans MS", }}
                          >
                            {item.day}
                          </Typography>
                          {item.activities.map((activity, activityIndex) => (
                            <Typography
                              key={activityIndex}
                              variant="body1"
                              sx={{ marginBottom: 1 }}
                              style={{fontFamily: 'Montserrat', fontSize: "18px"}}
                            >
                              -- {activity}
                            </Typography>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Display the ending note if it exists */}
                    {item.ending && (
                      <Typography
                        variant="body1"
                        style={{
                          fontFamily: "Comic Sans MS",
                          marginLeft: '10%',
                          marginRight: '10%',
                          color: teal[700],
                        }}
                      >
                        {item.ending}
                      </Typography>
                    )}
                  </CardContent>
                </div>
              );
            })}
            {/* </FadeInCard> */}
          </div>
        </Modal>
      </Collapse>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton
          aria-label="share"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <DeleteForeverIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={() => {
            handleExpandClick();
            handleOpen();
          }} // Open the modal when the expand button is clicked
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
    </Card>
  );
}
