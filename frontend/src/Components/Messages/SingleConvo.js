import React, { useState, useEffect } from 'react'
import { Table, Button, Container, Row, Col } from 'react-bootstrap'
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
import {UserStore} from '../../UserService/UserService.js';
import axios from 'axios'
import MainSpinner from '../Shared/MainSpinner.js'
import UserHighlight from '../Shared/UserHighlight.js'
import FormAddMessages from "./FormAddMessages.js"

import { useQuery, useMutation, queryClient, useQueryClient } from "react-query";

async function getConvo({queryKey})
{
    const [_key, { userid, convoid }] = queryKey;
    let result = await axios.get('/api/messages/' + userid + '/' + convoid)

    return result.data
}

async function setRead({...data})
{
    console.log('/api/messages/?read='+data.id)
    let result = await axios.patch('/api/messages/?read='+data.id)

    return result.data
}


function SingleConvo({convoid, placeholder})
{
    const user = UserStore.useState(s => s);
    const { data, error, isLoading, isError } = useQuery(["convos", {userid:user.id, convoid}], getConvo);
    const updateMutation = useMutation(setRead)

    const queryClient = useQueryClient()

    const [formVisible, setFormVisible] = useState(false)

    async function shouldUpdateRead()
    {
        if(!isLoading && data)
        {
            let unread = false
            if(data.conversation.read)
            {
                const unreadMsg =data.messages.filter(x=>x.read<1)
                unreadMsg.length > 0 && (unread = true)

            }
            else
                unread = true
            
            if(unread)
            {
                console.log("WE ARE IN MUTATION")
                await updateMutation.mutateAsync({id:data.conversation.id})
                queryClient.invalidateQueries("convos")
                queryClient.invalidateQueries("convos-count")

            }

        }
    }

    useEffect( shouldUpdateRead, [])

    useEffect( shouldUpdateRead, [isLoading])


    function handleClose()
    {
        setFormVisible(false)
    }

    function showForm()
    {
        setFormVisible(true)
    }

    if(isLoading)
        return <MainSpinner margin={false}/>
    
    const unreadCardStyle = {'borderLeftColor':'orange', 'borderLeftWidth':4}
    const unreadHeaderStyle = {/*'backgroundColor':'#FFE590'*/ }
    const unreadContentStyle = {/*'backgroundColor':'#FFFDE1'*/ }
    
    return <div style= {{marginLeft:30}}>

        {data.messages.map(
            (x)=>
            <div 
                className="card mt-1" 
                key={'single'+x.id}
                style= {!x.read && x.recipient_id==user.id ? unreadCardStyle : {}} 
            >
                <div 
                    className="card-header"
                    style= {!x.read ? unreadHeaderStyle : {}}
                >
                    From <UserHighlight id={x.sender_id} user={x.sender_name} level={x.sender_level}/>
                    To <UserHighlight id={x.recipient_id} user={x.recipient_name} level={x.recipient_level}/>
                </div>                
                <div 
                    className="card-body"
                    style= {!x.read ? unreadContentStyle : {}}
                >
                    <h5 className="mb-2">{x.title}</h5>
                    {x.message_body}
                </div>
            </div>
        )}
        <button type="button" class="btn btn-primary mt-1" onClick={showForm}>New Replay</button>
        <div className="mt=1 ml-2 mb-3">
            {formVisible && <FormAddMessages 
                convo={data.conversation}
                handleClose={handleClose} />}
        </div>
    </div >

}

export default SingleConvo