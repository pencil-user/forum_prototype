import React, { useState, useContext } from 'react'
import {Navbar, Nav} from 'react-bootstrap'
import {UserStore, LogOut} from '../../UserService/UserService.js';
import {
    Link,
  } from "react-router-dom";
import ModalLink from '../Shared/ModalLink.js'

function UserNav()
{
    const user = UserStore.useState(s => s);

    if(!user.logged)
        return <>
            <Navbar.Collapse className="justify-content-end">
                <ModalLink to={{pathname:'/login/' }}>
                    Log in 
                </ModalLink>
                <Navbar.Text style={{'margin-left':5,'margin-right':5}}> or </Navbar.Text>
                <ModalLink to={{pathname:'/register/'}}>
                    Register 
                </ModalLink>                
            </Navbar.Collapse>
        </>
    
    if(user.logged)
        return <>
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    Logged in as {user.username}. 
                </Navbar.Text>
                <Nav.Link onClick={LogOut}>Log out</Nav.Link>
            </Navbar.Collapse>
        </>

}

export default UserNav