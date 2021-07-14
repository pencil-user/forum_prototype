import React, { useState, useContext } from 'react'
import { Table, Button, Container, Row, Col } from 'react-bootstrap'
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
import {UserStore} from '../../UserService/UserService.js';
import axios from 'axios'


import { useQuery } from "react-query";

async function getConvos({queryKey})
{
    const [_key, { userid }] = queryKey;
    let result = await axios.get('/api/messages/' + userid)

    return result.data
}

function MessagesPage({})
{
    const user = UserStore.useState(s => s);

    const { data, error, isLoading, isError } = useQuery(["convos", {userid:user.id}], getConvos);

    if(isLoading)
        return <>loading</>
    
    return <>
        {data.map(
            (x)=>
            <div>
                <div>{x.title}</div>
                <div>
                    {x.message_body}
                </div>
            </div>

        )}

    </>
}

export default MessagesPage