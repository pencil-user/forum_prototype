import React from 'react'
import {Nav, Navbar} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {UserStore } from '../../UserService/UserService.js';

import ApproveLink from './ApproveLink.js'
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
                <LinkContainer to="/messages/">
                    <Nav.Link>
                        Messages 
                    </Nav.Link>
                </LinkContainer>}                

            </Nav >
            <UserNav />

        </Navbar>
    )
}

export default MainNavbar