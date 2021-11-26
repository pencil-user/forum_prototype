import React, { useState } from 'react'

import UserHighlight from '../Shared/UserHighlight.js'
import {useUser} from '../../UserService/UserService.js'

import {
    useHistory,
    useLocation
  } from "react-router-dom";

import {AddAlert} from '../../AlertService/AlertService.js'

import ButtonWithSpin from '../Shared/ButtonWithSpin.js'

import ShowThreadCell from './ShowThreadCell'

import {useUpdateThread, useDeleteThread} from '../../QueryHooks/threads.js'


function ShowThreadRow({thread, offset, limit})
{   
    const deleteThreadHook = useDeleteThread(thread.id, offset, limit)
    const updateThreadHook = useUpdateThread(thread.id, offset, limit)

    const [status, setStatus] = useState(false)

    const {user, isLogged, isAdmin} = useUser()

    const history = useHistory()

    const location = useLocation()


    async function clickDelete()
    {
        setStatus('deleting')
        await deleteThreadHook.deleteThread()
        setStatus(false)

        AddAlert('Thread deleted', 'danger')

    }

    function clickUpdate()
    {
        history.push('/update-thread/'+thread.id, {background: location})
    }

    async function clickLock()
    {
        setStatus('toggleLock')

        await updateThreadHook.lockThread(thread.locked ? 0 : 1)

        setStatus(false)
    }

    async function clickPin()
    {
        setStatus('togglePin')

        await updateThreadHook.pinThread(thread.pinned ? 0 : 1)

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
                        { isAdmin &&
                            <>
                                <ButtonWithSpin 
                                    className="btn-primary ml-1 mr-1" 
                                    onClick={clickLock}
                                    disabled={deleteThreadHook.isLoading || status}
                                    spinning={status === 'toggleLock'} 
                                    label={thread.locked ? "Unlock":"Lock"} 
                                />                            
                                <ButtonWithSpin 
                                    className="btn-info ml-1 mr-1" 
                                    onClick={clickPin}
                                    disabled={deleteThreadHook.isLoading || status}
                                    spinning={status === 'togglePin'}
                                    label={thread.pinned ? "Unpin":"Pin"} 
                                />

                            </>
                        }
                        
                        {isLogged && (isAdmin || user.id===thread.user_id) && 

                            <>
                                <ButtonWithSpin 
                                    className="btn-warning ml-1 mr-1" 
                                    onClick={clickUpdate}
                                    disabled={deleteThreadHook.isLoading || status}
                                    label="Edit"
                                />
                                <ButtonWithSpin 
                                    className="btn-danger ml-1 mr-3" 
                                    onClick={clickDelete}
                                    disabled={status}
                                    spinning={deleteThreadHook.isLoading} 
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