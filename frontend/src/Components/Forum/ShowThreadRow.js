import React, { useState, useContext } from 'react'

import { useQueryClient, useMutation } from "react-query";
import UserHighlight from '../Shared/UserHighlight.js'
import {UserStore} from '../../UserService/UserService.js'

import {
    useHistory,
  } from "react-router-dom";

import {AddAlert} from '../../AlertService/AlertService.js'

import ButtonWithSpin from '../Shared/ButtonWithSpin.js'

import ShowThreadCell from './ShowThreadCell'

import axios from 'axios'

async function deleteThread({...data})
{
    let result = await axios.delete('/api/threads/'+data.id)
    return result.data
}

async function alterThread({...params})
{
    let result = await axios.patch('/api/threads/'+params.id, params.data)

    return result.data
}


function ShowThreadRow({thread, queryKey})
{   //{ mutateAsync, isLoading }
    const deleteMutation = useMutation(deleteThread)
    const alterMutation = useMutation(alterThread)   

    const queryClient = useQueryClient()

    const [status, setStatus] = useState(false)

    const User = UserStore.useState()

    const history = useHistory()


    async function clickDelete()
    {
        setStatus('deleting')
        await deleteMutation.mutateAsync({id:thread.id})
        queryClient.invalidateQueries('threads')
        deleteFromQuery(thread.id)
        setStatus(false)

        AddAlert('Thread deleted', 'danger')

    }

    function clickUpdate()
    {
        history.push('/update-thread/'+thread.id)
    }

    async function alterQuery(id, values)
    {
        //console.log('QUERY DATA',queryClient.getQueryData(queryKey))
        let previousValues = queryClient.getQueryData(queryKey).threads
        let currentValues = previousValues.map(x => x.id===id ? {...x, ...values} : x)
        queryClient.setQueryData(queryKey, {threads: currentValues})
    }

    async function deleteFromQuery(id)
    {
        let previousValues = queryClient.getQueryData(queryKey).threads
        let currentValues = previousValues.filter(x => x.id!=id )
        queryClient.setQueryData(queryKey, {threads: currentValues})
    }

    async function clickLock()
    {
        setStatus('toggleLock')

        await alterMutation.mutateAsync({id:thread.id, data: { locked: thread.locked ? 0 : 1}})
        queryClient.invalidateQueries('threads')
        alterQuery(thread.id, { locked: thread.locked ? 0 : 1})

        setStatus(false)
    }

    async function clickPin()
    {
        setStatus('togglePin')

        await alterMutation.mutateAsync({id:thread.id, data: { pinned: thread.pinned ? 0 : 1}})
        queryClient.invalidateQueries('threads')
        alterQuery(thread.id, { pinned: thread.pinned ? 0 : 1})

        setStatus(false)

    }

    return (
        <tr >
            <td>{thread.id}</td>
            <td>
                <div className="d-flex justify-content-between">
                    <div>
                        <ShowThreadCell thread={thread} disabled={status}/>
                    </div>
                    <div>
                        { (User.level >= 2) &&
                            <>
                                <ButtonWithSpin 
                                    className="btn-primary ml-1 mr-1" 
                                    onClick={clickLock}
                                    disabled={deleteMutation.isLoading || status}
                                    spinning={status === 'toggleLock'} 
                                    label={thread.locked ? "Unlock":"Lock"} 
                                />                            
                                <ButtonWithSpin 
                                    className="btn-info ml-1 mr-1" 
                                    onClick={clickPin}
                                    disabled={deleteMutation.isLoading || status}
                                    spinning={status === 'togglePin'}
                                    label={thread.pinned ? "Unpin":"Pin"} 
                                />

                            </>
                        }
                        
                        {(User.logged && (User.level >= 2 || User.id===thread.user_id)) && 

                            <>
                                <ButtonWithSpin 
                                    className="btn-warning ml-1 mr-1" 
                                    onClick={clickUpdate}
                                    disabled={deleteMutation.isLoading || status}
                                    label="Edit"
                                />
                                <ButtonWithSpin 
                                    className="btn-danger ml-1 mr-3" 
                                    onClick={clickDelete}
                                    disabled={status}
                                    spinning={deleteMutation.isLoading} 
                                    label="Delete"
                                />
                            </>
                        }
                    </div>
                </div>

            </td>
            <td>{thread.created_on}</td>
            <td><UserHighlight user={thread.username} id={thread?.created_by_id} level={thread.user_level} /></td>
        </tr> 
    )
}

export default ShowThreadRow