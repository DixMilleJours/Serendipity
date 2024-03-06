import React, { useState, useCallback, useEffect } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Link from "@mui/material/Link";
import FormControlLabel from "@mui/material/FormControlLabel";
import { CloseRounded } from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import { Boop } from "../../Animations/Boop";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, google, firestore } from "../../firebase";
import { useAuth } from "../../AuthContext";
import Alert from "@mui/material/Alert";
import { doc, setDoc } from "firebase/firestore";

function handleCallbackResponse(response) {
  console.log("Encoded JWT tokens: " + response.credentials);
}

function Login({ setOpenLogin }) {
  useEffect(() => {
    /* global google */
    // google.accounts.id.initiliaze({
    //     client_id: "",
    //     callback: handleCallbackResponse
    // })
  });

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [values, setValues] = useState({
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClose = () => {
    setOpenLogin(false);
  };

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUser = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      // TODO: Success now. Close Modal.
      window.location.href = "/";
    } catch (error) {
      console.log(error.message);
      setError("Sign in failed");
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
    boxShadow: 24,
    p: 4,
  };

  const responseMessage = (response) => {
    console.log(response);
  };
  const errorMessage = (error) => {
    console.log(error);
  };

  async function googleLogIn(e) {
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
        <Box sx={{ ...style, width: 480 }}>
          <Boop rotation={45} timing={300}>
            <CloseRounded onClick={handleClose} className="close" />
          </Boop>

          <div className="contentBox">
            <div className="formBox">
              <h3 className="login">Login</h3>
              {error && <Alert severity="error">{error}</Alert>}
              <form onSubmit={handleSubmit}>
                <FormControl variant="outlined" margin="normal">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Email *
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-username"
                    type="text"
                    required
                    value={credentials.email}
                    sx={{ width: 280 }}
                    onChange={(e) =>
                      setCredentials({ ...credentials, email: e.target.value })
                    }
                    label="Email"
                  />
                </FormControl>
                <FormControl variant="outlined" margin="normal">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password *
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={values.showPassword ? "text" : "password"}
                    required
                    inputProps={{ minLength: 8, maxLength: 300 }}
                    value={credentials.password}
                    sx={{ width: 280 }}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
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
                          {values.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>

                <div className="inputBox">
                  <button type="submit" value="Join" id="bt-login">
                    Login
                  </button>
                </div>
                <div className="info">
                  <FormControlLabel
                    control={
                      <Checkbox color="info" sx={{ color: "#fe4066" }} />
                    }
                    label="Remember Me"
                    id="remember"
                  />
                  <Link href="#" underline="always" color="#fe4066" id="link">
                    <b>{"Forgot Password"}</b>
                  </Link>
                </div>
              </form>
              <form>
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
                    onClick={googleLogIn}
                    value="JoinGoogle"
                    id="signInDiv"
                    style={{ color: "#607d8b" }}
                  >
                    <b>Continue with Google</b>
                  </button>
                </div>
                {/* <GoogleLogin onSuccess={responseMessage} onError={errorMessage} /> */}
              </form>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );


}

export default Login;
