import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { UserStore, LogOut } from '../../UserService/UserService.js';

import ModalLink from '../Shared/ModalLink.js'
import UserHighlight from '../Shared/UserHighlight.js'

function UserNav() {
    const user = UserStore.useState(s => s);

    if (!user.logged)
        return <>
            <Navbar.Collapse className="justify-content-end">
                <ModalLink style={{ color: 'white' }} to={{ pathname: '/login/' }}>
                    Log in
                </ModalLink>
                <Navbar.Text style={{ 'marginLeft': 5, 'marginRight': 5 }}> or </Navbar.Text>
                <ModalLink style={{ color: 'white' }} to={{ pathname: '/register/' }}>
                    Register
                </ModalLink>
            </Navbar.Collapse>
        </>

    if (user.logged)
        return <>
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    Logged in as <UserHighlight user={user.username} id={user.id} level={user.level} />.
                </Navbar.Text>
                <Nav.Link style={{ color: 'white' }} onClick={LogOut}>Log out</Nav.Link>
            </Navbar.Collapse>
        </>

}

export default UserNav