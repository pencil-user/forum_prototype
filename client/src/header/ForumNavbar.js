import React, { useState, useContext } from 'react'
import {Nav, Navbar} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {UserStore, LogOut} from '../UserService/UserService.js';


import UserNav from './UserNav.js'

function ForumNavbar({showModalLogin, showModalRegister})
{
    const user = UserStore.useState(s => s);

    return(
        <Navbar bg="dark" variant="dark">
            <Nav>
                <LinkContainer to="/">
                    <Nav.Link>
                        Home 
                    </Nav.Link>
                </LinkContainer>
                {user.level >=2 &&
                    <LinkContainer to="/approve/">
                        <Nav.Link>
                            Approve Users 
                        </Nav.Link>
                    </LinkContainer>
                }

            </Nav >
            <UserNav showModalLogin={showModalLogin} showModalRegister={showModalRegister}/>

        </Navbar>
    )
}

export default ForumNavbar