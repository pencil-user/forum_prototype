import React, { useState } from 'react'
import { Link, useParams, useHistory } from 'react-router-dom';
import { UserStore } from '../../UserService/UserService.js';
import MainSpinner from '../Shared/MainSpinner.js'
import UserHighlight from '../Shared/UserHighlight.js'

import FormAddMessages from './FormAddMessages.js'
import { fetchWithJWT } from '../../FetchService/FetchService.js'

import { useGetConvos } from '../../QueryHooks/messages.js'

import SingleConvo from './SingleConvo.js'

//import { useQuery } from "react-query";

async function getConvos({ queryKey }) {
    const [_key, { userid }] = queryKey;
    let result = await fetchWithJWT.get('/api/messages/' + userid)

    return result.data
}

function MessagesPage({ }) {
    const user = UserStore.useState(s => s);

    const [formVisible, setFormVisible] = useState(false)

    const { data, isLoading } = useGetConvos(user.id)

    const params = useParams()

    const history = useHistory()

    const convoid = params.convoid ? params.convoid : null

    function handleClose() {
        setFormVisible(false)
    }

    function showForm() {
        setFormVisible(true)
    }

    if (user.level < 1) {
        history.replace('/')
        return <></>
    }

    if (isLoading)
        return <MainSpinner />

    const unreadCardStyle = { 'borderLeftColor': 'orange', 'borderLeftWidth': 4 }

    return <>
        <button type="button" className="btn btn-primary" onClick={showForm}>New Conversation</button>
        {formVisible && <FormAddMessages sender_id={user.id} handleClose={handleClose} />}
        {data.map(
            (x) =>
                <span key={x.id}>
                    <div
                        className="card mt-1"
                        style={((x.unread_count > 0) || (x.read < 1 && x.recipient_id == user.id)) ? unreadCardStyle : {}}
                    >
                        <div className="card-header">
                            <span
                                className="rounded-circle btn-secondary text-white mr-2"
                                style={{ 'paddingLeft': 6, 'paddingRight': 6, 'paddingTop': 1, 'paddingBottom': 1, }}
                            >
                                {x.message_count + 1}
                            </span>

                            From <UserHighlight id={x.sender_id} user={x.sender_name} level={x.sender_level} />
                            To <UserHighlight id={x.recipient_id} user={x.recipient_name} level={x.recipient_level} />
                        </div>
                        <div className="card-body">

                            {x.id == convoid ?
                                <>
                                    <h5 className="mb-2">{x.title}</h5>
                                    {x.message_body}
                                </>

                                :
                                <Link to={"/messages/" + x.id} key={x.id}>
                                    <h5 className="mb-2">{x.title} </h5>
                                    {x.message_body.substring(0, 300) + ' . . .'}
                                </Link>
                            }
                        </div>
                    </div>
                    {x.id == convoid && <SingleConvo convoid={convoid} placeholder={x} key={x.id} />}
                </span>
        )}
    </>
}

export default MessagesPage