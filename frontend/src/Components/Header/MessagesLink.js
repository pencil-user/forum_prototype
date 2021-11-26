import React from 'react'
import { Nav, Spinner } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { UserStore } from '../../UserService/UserService.js';
import { fetchWithJWT } from '../../FetchService/FetchService.js'
import { useGetConvosCount } from '../../QueryHooks/messages.js'

function MessagesLink() {
    const user = UserStore.useState(s => s);

    const { data, isLoading } = useGetConvosCount(user.id);

    return (
        <LinkContainer to="/messages/">
            <Nav.Link>
                Messages
                {isLoading && <Spinner animation="border" size="sm" style={{ 'marginLeft': '3px' }} />}
                {data && data > 0 && <span className="badge badge-warning" style={{ 'marginLeft': '3px' }}>{data}</span>}
            </Nav.Link>
        </LinkContainer>
    )
}

export default MessagesLink