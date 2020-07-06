import React, { useState } from 'react' ; 
import Navbar from './navbar' ; 
import {UserEmail, UserUid, Username, Userdata} from "../database/funcs";
import db from '../database/db';


function Header(props)
{
    return (
        <div>
            <header className= "row myheader">
                <h1>{props.title}</h1>
            </header>
            <Navbar  Username = {localStorage.getItem("username")}/>
           
        </div>
    
        
    ); 
}
export default Header ; 