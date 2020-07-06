import React,{useCallback, useContext} from 'react';
import {withRouter, Redirect} from "react-router";
import db from "../database/db";
import {AuthContext} from "../Auth";
import firebase,{ app } from 'firebase';
import { Username } from '../database/funcs';
import Header from '../components/Header';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

function Login({history}) {


    const handleLogin = useCallback(
        async event =>{
            event.preventDefault();
            const {email, password} =event.target.elements;
            try{
                await db
                .auth()
                .signInWithEmailAndPassword(email.value, password.value);
               
                history.push("/Log0");
            }catch (error){
                console.log(error);
            }
            },[history]                
    );

    const {currentUser} = useContext(AuthContext);

    if(localStorage.getItem("username")){
       return <Redirect to="/" />;
    }


    const uiConfig = {
        signInFlow: "popup",
        
        signInOptions:[
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        ],
        signInSuccessUrl: "/",
        callbacks: {
            signInSuccessWithAuthResult: ()=> true
        }
    }

    return (<div>
    <Header title="Login"/>
    <div className="login-bg">
        <div className="login-bar">

            <div className="col-md-6" style={{ paddingLeft: "4%" }}> 
            <img className="loginlogo" src={process.env.PUBLIC_URL + '/myimage.png'}/>
            <form onSubmit={handleLogin}>
            <div className="form-group" style={{ width: "80%", marginTop: "40%" }} >
                <input type="text" className="form-control" id="email" placeholder="Enter Your Email" />
            </div>
                <div className="form-group" style={{ width: "80%" }}>
                    <input type="password" className="form-control" id="password" placeholder="Enter Your Password" />
                </div><div className="form-group submit" style={{ width: "80%" }}>
                    <input type="submit" className="myshadow mybtn btn btn-default" id="signin" value="Login" />
                </div></form></div>
            <div className="col-md-6 social-login" > 
            <div className="sl-top">
                
            </div>
            <div className="sl-bottom">
            <StyledFirebaseAuth 
                uiConfig={uiConfig}
                firebaseAuth = {firebase.auth()}
            />
            
            <hr className="hr"/><p className="f">Don't have an account yet?</p>
            <button type="submit" className="mybtn sl btn btn-lg btn-default myshadow"  onClick={()=> history.push('/signup')}>Signup</button>
            </div>
            </div>
        </div>
    </div>
    </div>);
}

export default Login;