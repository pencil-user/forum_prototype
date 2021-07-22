import React from 'react'
import {Nav, Navbar} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {UserStore } from '../../UserService/UserService.js';

import ApproveLink from './ApproveLink.js'
import MessagesLink from './MessagesLink.js'
import UserNav from './UserNav.js'

function MainNavbar()
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
                    <ApproveLink/>
                }
                {user.level >=1 &&
                <MessagesLink/>}                

            </Nav >
            <UserNav />

        </Navbar>
    )
}

export default MainNavbar