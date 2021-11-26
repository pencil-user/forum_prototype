import React from 'react'
import { Nav, Spinner } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import { useGetPendingUsers } from '../../QueryHooks/users.js'

function ApproveLink() {
    const { data, isLoading } = useGetPendingUsers()

    return (
        <LinkContainer to="/approve/">
            <Nav.Link>
                Approve Users
                {isLoading && <Spinner animation="border" size="sm" style={{ 'marginLeft': '3px' }} />}
                {data && data.length > 0 && <span className="badge badge-info" style={{ 'marginLeft': '3px' }}>{data.length}</span>}
            </Nav.Link>
        </LinkContainer>
    )
}

export default ApproveLink