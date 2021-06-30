import React, { useState, useContext } from 'react'
import {Navbar, Nav} from 'react-bootstrap'
import {UserStore, LogOut} from '../UserService/UserService.js';


function UserNav({showModalLogin, showModalRegister})
{
    const user = UserStore.useState(s => s);

    if(!user.logged)
        return <>
            <Navbar.Collapse className="justify-content-end">
                <Nav.Link onClick={showModalLogin}>
                    Log in
                </Nav.Link>
                <Navbar.Text>
                    or
                </Navbar.Text>
                <Nav.Link onClick={showModalRegister}>
                    Register
                </Nav.Link>                
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