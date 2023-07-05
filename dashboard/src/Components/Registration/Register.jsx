import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FilledInput from "@mui/material/FilledInput";
import { CloseRounded } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormGroup from "@mui/material/FormGroup";
import { Boop } from "../../Animations/Boop";
import { useAuth } from "../../AuthContext";
import Alert from "@mui/material/Alert";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, firestore, google } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

function Register({ setOpenSignup, modeColor }) {
  const [credentials, setCredentials] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClose = () => {
    setOpenSignup(false);
  };


  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUser = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    if (credentials.password != credentials.password2) {
      return setError("Passwords don't match");
    }
    try {
      setError("");
      setLoading(true);
      await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      // Upload the rest of the user information to FireStore
      await setDoc(doc(firestore, "Profiles", auth.currentUser.uid), {
        firstName: credentials.first_name,
        lastName: credentials.last_name,
        UID: auth.currentUser.uid,
      });
      // Success now. Close Modal.
      window.location.href = "/";
    } catch (error) {
      console.log(error.message);
      setError("Failed to create a new account");
    }
    setLoading(false);
  }

  const style = {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    marginTop: "100px",
    boxShadow: 24,
    p: 4,
  };

  async function googleSignUp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    signInWithPopup(auth, google)
      .then((result) => {
        const user = result.user;
        // Upload the rest of the user information to FireStore
        setDoc(doc(firestore, "Profiles", auth.currentUser.uid), {
          firstName: user.displayName.split(" ")[0],
          lastName: user.displayName.split(" ")[1],
          UID: auth.currentUser.uid,
        });
        // Success now. Close Modal.
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error.message);
        setError("Failed to create a new account");
      });
    setLoading(false);
  }

  return (
    <>
      <Modal
        open={true}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{ ...style, width: 480 }}
          component="form"
          onSubmit={handleSubmit}
        >
          <Boop rotation={45} timing={300}>
            <CloseRounded onClick={handleClose} className="close" />
          </Boop>
          <div className="contentBox">
            <div className="formBox">
              <h3>Sign Up</h3>
              {error && <Alert severity="error">{error}</Alert>}
              <FormControl variant="filled" margin="normal">
                <InputLabel htmlFor="filled-adornment-firstName">
                  First Name
                </InputLabel>
                <FilledInput
                  id="outlined-adornment-firstName"
                  type="text"
                  required
                  value={credentials.first_name}
                  sx={{ width: 280 }}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      first_name: e.target.value,
                    })
                  }
                  label="First Name"
                />
              </FormControl>
              <FormControl variant="filled" margin="normal">
                <InputLabel htmlFor="filled-adornment-lastName">
                  Last Name
                </InputLabel>
                <FilledInput
                  id="outlined-adornment-lastName"
                  type="text"
                  required
                  value={credentials.last_name}
                  sx={{ width: 280 }}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      last_name: e.target.value,
                    })
                  }
                  label="Last Name"
                />
              </FormControl>
              <FormControl variant="filled" margin="normal">
                <InputLabel htmlFor="filled-adornment-email">Email</InputLabel>
                <FilledInput
                  id="outlined-adornment-email"
                  type="email"
                  required
                  value={credentials.email}
                  sx={{ width: 280 }}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  label="Email"
                />
              </FormControl>
              <FormControl variant="filled" margin="normal">
                <InputLabel htmlFor="filled-adornment-password">
                  Password
                </InputLabel>
                <FilledInput
                  id="filled-adornment-password"
                  type={showPassword ? "text" : "password"}
                  required
                  inputProps={{ minLength: 8, maxLength: 300 }}
                  value={credentials.password}
                  sx={{ width: 280 }}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <FormControl variant="filled" margin="normal">
                <InputLabel htmlFor="filled-adornment-password">
                  Password Confirmation
                </InputLabel>
                <FilledInput
                  id="filled-adornment-password"
                  type={showPassword ? "text" : "password"}
                  required
                  inputProps={{ minLength: 8, maxLength: 300 }}
                  value={credentials.password2}
                  sx={{ width: 280 }}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      password2: e.target.value,
                    })
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password2"
                />
              </FormControl>
              <div className="inputBox">
                <button
                  disabled={loading}
                  type="submit"
                  value="SignUp"
                  id="bt-register"
                >
                  Sign Up
                </button>
              </div>
              <FormGroup>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox color="info" sx={{ color: "#fe4066" }} />
                      }
                      label={
                        <Typography
                          sx={{ fontSize: "14px", fontFamily: "sans-serif" }}
                        >
                          Accept
                        </Typography>
                      }
                      id="accept"
                    />
                  </Grid>
                  <Grid item>
                    <Link href="#" underline="always" color="#fe4066" id="link">
                      <b>{"Term and Conditions"}</b>
                    </Link>
                  </Grid>
                </Grid>

                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox color="info" sx={{ color: "#fe4066" }} />
                      }
                      label={
                        <Typography
                          sx={{ fontSize: "14px", fontFamily: "sans-serif" }}
                        >
                          Remember Me
                        </Typography>
                      }
                      id="accept"
                    />
                  </Grid>
                  <Grid item>
                    <Link href="#" underline="always" color="#fe4066" id="link">
                      <b>{"Forgot Password"}</b>
                    </Link>
                  </Grid>
                </Grid>
              </FormGroup>
              <div className="google-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="36"
                  height="36"
                  viewBox="0 0 48 48"
                  id="google-icon"
                >
                  <path
                    fill="#fbc02d"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#e53935"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4caf50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1565c0"
                    d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
                <button
                  type="submit"
                  disabled={loading}
                  onClick={googleSignUp}
                  value="Google"
                  style={{ color: "#607d8b" }}
                >
                  <b>Sign up with Google</b>
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      {/* } */}
    </>
  );


}

export default Register;
