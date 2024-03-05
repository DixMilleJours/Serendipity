import * as React from "react";
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
import { pink } from "@mui/material/colors";
import { grey } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Modal from "@mui/material/Modal";
import NewYork from "../../static/images/newyork.webp";
import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import "../../static/css/modal.css";

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

export default function ItineraryCard({ id, itineraryData, onDelete }) {
  const preferredMode = useSelector((state) => state.mode);
  const [expanded, setExpanded] = React.useState(false);
  const [open, setOpen] = React.useState(false); // Assuming you want to control the open state of the modal
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  console.log(id);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleClose = () => {
    setOpen(false); // This will close the modal when invoked
    setExpanded(false);
  };

  const handleOpen = () => {
    setOpen(true); // This will open the modal when invoked
  };

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
          <Avatar sx={{ bgcolor: pink[500] }} aria-label="recipe">
            S
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={"Travel Card " + id}
        subheader={dateString}
      />
      <CardMedia
        component="img"
        height="194"
        image={NewYork}
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
          }}
        >
          <div
            className="modalContainer modalBackground"
            style={{
              backgroundColor: preferredMode == "dark" ? "#1A2027" : "#fff",
            }}
          >
            {/* Modal content */}
            {/* {itineraryData.map((dayInfo, index) => (
              <Card key={index} sx={{ margin: 2, padding: 2 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {dayInfo.day}
                  </Typography>
                  {dayInfo.activities.map((activity, activityIndex) => (
                    <Typography
                      key={activityIndex}
                      variant="body1"
                      sx={{ marginBottom: 1 }}
                    >
                      {activityIndex + 1}. {activity}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            ))} */}
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
          <ShareIcon />
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
