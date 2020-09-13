import React, { useState } from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import GoogleSignIn from './GoogleSignIn';


const Login = () => {
    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        isLoggedIn: false,
        name: '',
        email: '',
        password: '',
        newUser: false,
        error: '',
        success: false
    })
    
    const handleChange = (e) => {
        let isValid = true;
        if(e.target.name === 'email'){
            const isEmailValid = /\S+@\S+\.\S+/.test(e.target.value);
            isValid = isEmailValid;
        }
        if(e.target.name === 'password') {
            const isPasswordValid = /\d{1}/.test(e.target.value);
            isValid = isPasswordValid;
        }
        if(isValid) {
            const newUserInfo = {...user};
            newUserInfo[e.target.name] = e.target.value;
            setUser(newUserInfo);
        }
    }
    const handleSubmit = (e) => {

        if(user.email && user.password) {
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            .then(res => {
                const newUserInfo = {...user};
                newUserInfo.error = '';
                newUserInfo.success = true;
                setUser(newUserInfo);
                userName(user.name);
            })
            .catch(error => {
                const newUserInfo = {...user};
                newUserInfo.error = error.message;
                newUserInfo.success = false;
                setUser(newUserInfo);
              });
        }

        if(!newUser && user.email && user.password) {
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
            .then(res => {
                const newUserInfo = {...user};
                newUserInfo.error = '';
                newUserInfo.success = true;
                setUser(newUserInfo);
                console.log('Signed in successfully');
            })
            .catch(function(error) {
                var errorMessage = error.message;
                const newUserInfo = {...user};
                newUserInfo.error = errorMessage;
                newUserInfo.success = false;
                setUser(newUserInfo);
                console.log(errorMessage);
              });
        }
        const userName = name => {
            const user = firebase.auth().currentUser;
            user.updateProfile({
                displayName: name,
              }).then(function() {
                console.log('Update successfully')
              }).catch(function(error) {
                console.log(error)
              });
        }
        e.preventDefault();
    }

    return (
        <div>
            <h1>Our own Authentication </h1>
            <input onChange={() => setNewUser(!newUser)} type="checkbox" name="newUser" id=""/>
            <label htmlFor="newUser">New User Sign in</label>
            <form onSubmit={handleSubmit}>
                {
                    newUser && <input onBlur={handleChange} type="text" name='name' placeholder='Your Name'/>
                }
                <br/>
                <input onBlur={handleChange} type="text" name='email' placeholder='Your email' required/> 
                <br/>
                <input onBlur={handleChange} type="password" name='password' placeholder='Your password' required/>
                <br/>
                <input type="submit" value={newUser ? 'Sign up' : 'Log in'}/>
            </form>
            <p style={{color: 'red'}}>{user.error}</p>
            {
                user.success && <p style={{color: 'green'}}>User Successfully {newUser ? 'Signed up' : 'Logged in'}</p>
            }
            <GoogleSignIn></GoogleSignIn>
        </div>
    );
};

export default Login;