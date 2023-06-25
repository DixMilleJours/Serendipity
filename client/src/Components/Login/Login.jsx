import React, { useEffect, useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';

import { FaUserCircle } from 'react-icons/fa';
import { BsLockFill } from 'react-icons/bs';
import { AiOutlineArrowRight } from 'react-icons/ai';

const UserLogin = () => {
  const [loginID, setLoginID] = useState('');
  const [loginKey, setLoginKey] = useState('');
  const navigation = useNavigate();

  const [loginMsg, setLoginMsg] = useState('');
  const [statusDisplay, setStatusDisplay] = useState('message');

  const validateUser = (e) => {
    e.preventDefault();
    Axios.post('http://localhost:3002/login', {
      LoginUserName: loginID,
      LoginPassword: loginKey,
    }).then((response) => {
      if (response.data.message || loginID === '' || loginKey === '') {
        navigation('/');
        setLoginMsg(`User Not Found!`);
        console.log(`User Not Found!`);
      } else {
        navigation('/dashboard');
      }
    });
  };

  useEffect(() => {
    if (loginMsg !== '') {
      setStatusDisplay('showMessage');
      setTimeout(() => {
        setStatusDisplay('message');
      }, 4000);
    }
  }, [loginMsg]);

  const afterSubmit = () => {
    setLoginID('');
    setLoginKey('');
  };

  return (
    <div className="loginPage">
      <div className="container">
        <div className="loginPanel">
          <h2 className="loginHeading">Welcome Back!</h2>
          <form className="loginForm" onSubmit={afterSubmit}>
            <div className="inputWrapper">
              <FaUserCircle className="inputIcon" />
              <input
                type="text"
                id="username"
                placeholder="Username"
                onChange={(event) => setLoginID(event.target.value)}
                className="inputField"
              />
            </div>
            <div className="inputWrapper">
              <BsLockFill className="inputIcon" />
              <input
                type="password"
                id="password"
                placeholder="Password"
                onChange={(event) => setLoginKey(event.target.value)}
                className="inputField"
              />
            </div>
            <button type="submit" className="loginBtn" onClick={validateUser}>
              Login <AiOutlineArrowRight className="btnIcon" />
            </button>
            <div className="loginFooter">
              <span className={statusDisplay}>{loginMsg}</span>
              <div className="forgotPassword">
                Forgot your password?{' '}
                <Link to="/resetpassword" className="resetLink">
                  Reset here
                </Link>
              </div>
              <div className="registerDiv">
                Don't have an account?{' '}
                <Link to="/register" className="registerLink">
                  Register Now
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
