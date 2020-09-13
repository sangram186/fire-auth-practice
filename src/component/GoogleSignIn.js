import React, { useState } from 'react';
import * as firebase from 'firebase/app';
import "firebase/auth";
import { firebaseConfig } from '../firebase.config';
import { Button } from 'react-bootstrap';


firebase.initializeApp(firebaseConfig);

const GoogleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    const [googleUser, setGoogleUser] = useState({
        isSignIn: false,
        name: '',
        email: '',
        photo: '',
    })
    const handleSignIn = () => {
        firebase.auth().signInWithPopup(provider)
        .then(res => {
            console.log(res)
            const {displayName, email, photoURL} = res.user;
            const signInUser = {
                isSignIn: true,
                name: displayName,
                email: email,
                photo: photoURL
            }
            setGoogleUser(signInUser);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const handleSignOut = () => {
        firebase.auth().signOut()
        .then(res => {
            const signOutUser = {
                isSignIn: false,
                name: '',
                email: '',
                photo: ''
            }
            setGoogleUser(signOutUser);
        })
        .catch(err => {
            console.log(err);
        })
    }
    return (
        <div>
            {
                googleUser.isSignIn ? <Button onClick={handleSignOut} className='mt-2' variant="primary" type="submit">Sign out</Button> :
                <Button className='mt-2' onClick={handleSignIn} variant="primary" type="submit">Sign in with Google</Button>
            }
            {
                googleUser.isSignIn && <div>
                    <h2>Name: {googleUser.name}</h2>
                    <p>Email: {googleUser.email}</p>
                    <img src={googleUser.photo} alt=""/>
                </div>
            }
        </div>
    );
};

export default GoogleSignIn;