import React from 'react'
import {Nav, Navbar} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {useUser } from '../../UserService/UserService.js';

import ApproveLink from './ApproveLink.js'
import MessagesLink from './MessagesLink.js'
import UserNav from './UserNav.js'

function MainNavbar()
{
    const {isLogged, isAdmin} = useUser()

    return(
        <Navbar bg="dark" variant="dark">
            <Nav>
                <LinkContainer to="/">
                    <Nav.Link>
                        Home 
                    </Nav.Link>
                </LinkContainer>
                {isAdmin &&
                    <ApproveLink/>
                }
                {isLogged &&
                <MessagesLink/>}                

            </Nav >
            <UserNav />

        </Navbar>
    )
}

export default MainNavbar