import React, {useState} from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

import signinImage from '../assets/signup.jpg';

const cookies = new Cookies();

const initialState = {
    fullName: '',
    userName: '',
    phoneNumber: '',
    avatarURL: '',
    password: '',
    confirmPassword: '',
}

const Auth = () => {
    const [form,setForm] = useState(initialState);
    const [isSignup, setIsSignup] = useState(true);
 
    const handleChange = (e) => {
        setForm( {...form, [e.target.name]: e.target.value });
    }

    // fill the form, once submitted, handleSubmit works by 
    // getting all the values from the form and url, post it to backend and get the data 
    // store the data in the cookies

    const handleSubmit = async(e) => {
        e.preventDefault();
        const {userName,password,phoneNumber,avatarURL} = form;
        // console.log("inside the lick func",userName)
        const URL = "http://localhost:5000/auth";
        const {data: {token,userId,hashedPassword,fullName} } = await axios.post(`${URL}/${isSignup ? 'signup':'login'}`, {
            userName,password,fullName:form.fullName,phoneNumber,avatarURL
        });
        cookies.set('token',token);
        cookies.set('username',userName);
        cookies.set('fullName',fullName);
        cookies.set('userId',userId);

        if (isSignup) {
            cookies.set('phoneNumber',phoneNumber);
            cookies.set('avatarURL',avatarURL);
            cookies.set('hashedPassword',hashedPassword);
        }

        window.location.reload(); // reloading our page so in app.jsx it will get loggedin in the <Auth> line
        

    }


    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup 
        );
    }
  return (
    <div className='auth__form-container'>
        <div className='auth__form-container_fields'>
            <div className='auth__form-container_fields-content'>
                <p>{isSignup ? 'Sign Up' : 'Sign In'}</p>
                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <div className='auth__form-container_fields-content_input'>
                            <label htmlFor='fullName'>Full Name</label>
                            <input 
                            name = "fullName"
                            type = "text"
                            placeholder='enter full name'
                            onChange={handleChange}
                            required
                            />
                        </div>
                    )} 
                        <div className='auth__form-container_fields-content_input'>
                        <label htmlFor='userName'>User Name</label>
                        <input 
                        name = "userName"
                        type = "text"
                        placeholder='enter username'
                        onChange={handleChange}
                        required
                        />
                    </div>
                    {isSignup && (
                        <div className='auth__form-container_fields-content_input'>
                            <label htmlFor='phoneNumber'>phone number</label>
                            <input 
                            name = "phoneNumber"
                            type = "text"
                            placeholder='enter phone number'
                            onChange={handleChange}
                            required
                            />
                        </div>
                    )}
                    {isSignup && (
                        <div className='auth__form-container_fields-content_input'>
                            <label htmlFor='avatarURL'>avatar URL</label>
                            <input 
                            name = "avatarURL"
                            type = "text"
                            placeholder='Avatar URL'
                            onChange={handleChange}
                            required
                            />
                        </div>
                    )}
                     <div className='auth__form-container_fields-content_input'>
                            <label htmlFor='password'>Password</label>
                            <input 
                            name = "password"
                            type = "password"
                            placeholder='enter password'
                            onChange={handleChange}
                            required
                            />
                        </div>
                    {isSignup && (
                    <div className='auth__form-container_fields-content_input'>
                        <label htmlFor='confirmPassword'>Confirm Password</label>
                        <input 
                        name = "confirmPassword"
                        type = "password"
                        placeholder='confirm password'
                        onChange={handleChange}
                        required
                        />
                    </div>
                    )}
                    <div className='auth__form-container_fields-content_button'>
                        <button>{isSignup ? "Sign Up" : "Sign In" }</button>

                    </div>
                </form>
                <div className='auth__form-container_fields-account'>
                    <p>
                        {isSignup
                         ? "Already have an account?" 
                         : "Don't have an account?" }
                         <span onClick={switchMode}>
                            {isSignup ? 'Sign In': 'Sign Up'}
                         </span>

                    </p>

                </div>
            </div>
        </div>
        <div className='auth__form-container_image'>
            <img src={signinImage} alt="sign in" />
        </div>
      
    </div>
  )
}

export default Auth;
