import React, { useState, useContext } from 'react'
import { Table, Button, Container, Row, Col } from 'react-bootstrap'
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
import {UserStore} from '../../UserService/UserService.js';
import axios from 'axios'
import MainSpinner from '../Shared/MainSpinner.js'
import UserHighlight from '../Shared/UserHighlight.js'



import { useQuery } from "react-query";

async function getConvo({queryKey})
{
    const [_key, { userid, convoid }] = queryKey;
    let result = await axios.get('/api/messages/' + userid + '/' + convoid)

    return result.data
}

function SingleConvo({convoid, placeholder})
{
    const user = UserStore.useState(s => s);
    const { data, error, isLoading, isError } = useQuery(["convos", {userid:user.id, convoid}], getConvo);

    if(isLoading)
        return <MainSpinner margin={false}/>
    
    return <>

        {data.messages.map(
            (x)=>
            <div style= {{marginLeft:30}} className="card mt-1" key={'single'+x.id}>
                        <div className="card-header">
                            From <UserHighlight id={x.sender_id} user={x.sender_name} level={x.sender_level}/>
                            To <UserHighlight id={x.recipient_id} user={x.recipient_name} level={x.recipient_level}/>
                        </div>                
                <div className="card-body">
                    <h5>{x.title}</h5>

                    {x.message_body}
                </div>
            </div>

        )}

    </>

}

export default SingleConvo