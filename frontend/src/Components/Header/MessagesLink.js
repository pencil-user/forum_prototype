import React from 'react'
import {Nav, Spinner} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {UserStore} from '../../UserService/UserService.js';


import { useQuery } from "react-query";
import axios from 'axios'


async function getConvosCount({queryKey})
{
    const [_key, { userid }] = queryKey;
    let result = await axios.get('/api/messages/' + userid)

    return result.headers['-unread-count']
}


function MessagesLink()
{
    const user = UserStore.useState(s => s);

    const { data, error, isLoading, isError } = useQuery(["convos-count", {userid:user.id}], getConvosCount);

    return (
        <LinkContainer to="/messages/">
            <Nav.Link>
                Messages 
                {isLoading && <Spinner animation="border" size="sm" style={{'marginLeft': '3px'}}/>}
                {data && data>0 && <span class="badge badge-warning" style={{'marginLeft': '3px'}}>{data}</span>}               
            </Nav.Link>
        </LinkContainer>
    )
}

export default MessagesLink