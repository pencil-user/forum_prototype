import React from 'react'
import {Nav, Spinner} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

import { useQuery } from "react-query";
import axios from 'axios'


async function getPendingUsers()
{
    let result = await axios.get('/api/users/?pending=1')

    return result.data
}


function ApproveLink()
{
    const { data, error, isLoading, isError } = useQuery(["pending_users"], getPendingUsers);

    return (
        <LinkContainer to="/approve/">
            <Nav.Link>
                Approve Users 
                {isLoading &&   <Spinner animation="border" size="sm" style={{'margin-left': '3px'}}/>}
                {data && data.length>0 && <span class="badge badge-info" style={{'margin-left': '3px'}}>{data.length}</span>}               
            </Nav.Link>
        </LinkContainer>
    )
}

export default ApproveLink