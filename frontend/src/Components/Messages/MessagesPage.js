import React, { useState, useContext } from 'react'
import { Table, Button, Container, Row, Col } from 'react-bootstrap'
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
import {UserStore} from '../../UserService/UserService.js';
import axios from 'axios'
import MainSpinner from '../Shared/MainSpinner.js'
import UserHighlight from '../Shared/UserHighlight.js'

import FormAddMessages from "./FormAddMessages.js"


import SingleConvo from './SingleConvo.js'

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

    const [formVisible, setFormVisible] = useState(false)

    const { data, error, isLoading, isError } = useQuery(["convos", {userid:user.id}], getConvos);

    const params = useParams()

    const history = useHistory()

    const convoid = params.convoid ? params.convoid : null

    function handleClose()
    {
        setFormVisible(false)
    }

    function showForm()
    {
        setFormVisible(true)
    }

    if(user.level<1)
    {
        history.replace('/')
        return <></>
    }

    if(isLoading)
        return <MainSpinner />
    
    return <>
        <button type="button" class="btn btn-primary" onClick={showForm}>New Conversation</button>
        {formVisible && <FormAddMessages sender_id={user.id} handleClose={handleClose}/>}
        {data.map(
            (x)=>
            {
                if(x.id != convoid)
                    return <div className="card mt-1" >
                            <div className="card-header">
                                <span 
                                    class="rounded-circle bg-info text-white mr-2"
                                    style={{'paddingLeft':6, 'paddingRight':6, 'paddingTop':1, 'paddingBottom':1,}}
                                >
                                    {x.message_count}
                                </span>

                                From <UserHighlight id={x.sender_id} user={x.sender_name} level={x.sender_level}/>
                                To <UserHighlight id={x.recipient_id} user={x.recipient_name} level={x.recipient_level}/>
                            </div>
                            <div className="card-body">

                                 <Link to={"/messages/"+x.id} key={x.id}>                              
                                    <h5 className="mb-2">{x.title} </h5>                               
                                    {x.message_body.substring(0,300) + ' . . .'}

                                 </Link> 
                            </div>

                        </div>
                   
                else
                    return <>
                        <div className="card mt-1" key={x.id}>
                        <div className="card-header">
                                <span 
                                    class="rounded-circle bg-info text-white mr-2"
                                    style={{'paddingLeft':6, 'paddingRight':6, 'paddingTop':1, 'paddingBottom':1,}}
                                >
                                    {x.message_count}
                                </span>
                                From <UserHighlight id={x.sender_id} user={x.sender_name} level={x.sender_level}/>
                                To <UserHighlight id={x.recipient_id} user={x.recipient_name} level={x.recipient_level}/>
                        </div>
                            <div className="card-body">
                                <h5 className="mb-2">{x.title}</h5>
                                {x.message_body} 
                            </div>
                        </div>

                        <SingleConvo convoid={convoid} placeholder={x} key={x.id} />
                    </>
            }

        )}
    </>
}

export default MessagesPage