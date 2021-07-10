import React from 'react'
import {Nav, Navbar} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {UserStore } from '../../UserService/UserService.js';

import ApproveLink from './ApproveLink.js'
import UserNav from './UserNav.js'

function ForumNavbar()
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

            </Nav >
            <UserNav />

        </Navbar>
    )
}

export default ForumNavbar