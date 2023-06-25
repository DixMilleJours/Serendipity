import React, {useState}from 'react';
import './Register.css';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';

import {FaUserShield} from 'react-icons/fa';
import {BsFillShieldLockFill} from 'react-icons/bs';
import {AiOutlineSwapRight} from 'react-icons/ai';
import {MdMarkEmailRead} from 'react-icons/md';

const Register = () => {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigateTo = useNavigate();

  const createUser = (e) => {
    e.preventDefault();
    Axios.post('http://localhost:3002/register', {
      Email: email,
      UserName: userName, 
      Password: password
    }).then(()=>{
      navigateTo('/');
      setEmail('');
      setUserName('');
      setPassword('');
    });
  };

  return (
    <div className='registerPage'>
      <div className="container">
        <div className="registerPanel">
          <h2 className="registerHeading">Join Us Today!</h2>

          <form className='registerForm' onSubmit={createUser}>
            <div className="inputWrapper">
              <MdMarkEmailRead className='inputIcon'/>
              <input 
                type="email" 
                id='email' 
                placeholder='Email'
                onChange={(event) => setEmail(event.target.value)}
                className="inputField"
              />
            </div>

            <div className="inputWrapper">
              <FaUserShield className='inputIcon'/>
              <input 
                type="text" 
                id='username' 
                placeholder='Username'
                onChange={(event) => setUserName(event.target.value)}
                className="inputField"
              />
            </div>

            <div className="inputWrapper">
              <BsFillShieldLockFill className='inputIcon'/>
              <input 
                type="password" 
                id='password' 
                placeholder='Password'
                onChange={(event) => setPassword(event.target.value)}
                className="inputField"
              />
            </div>

            <button type='submit' className='registerBtn'>
              Register <AiOutlineSwapRight className='btnIcon'/>
            </button>

            <div className='registerFooter'>
              <span className="text">Already have an account?</span>
              <Link to='/' className='loginLink'>Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
