import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'
import UserHighlight from '../Shared/UserHighlight.js'
import { UserStore } from '../../UserService/UserService.js';
import { fetchWithJWT } from '../../FetchService/FetchService.js'

import { useQueryClient, useMutation } from "react-query";

import { useForm } from "react-hook-form";

import ButtonWithSpin from '../Shared/ButtonWithSpin.js'

import '../../css/Markdown.css'


async function createMessage({ ...data }) {
    console.log('data for message', data)
    let result = await fetchWithJWT.post('/api/messages/', data)

    return result.data

}

function FormAddMessage({ handleClose, convo = null, title = null }) {
    const user = UserStore.useState(s => s);

    const { register, handleSubmit, watch } = useForm({ defaultValues: { title } });

    const createMutation = useMutation(createMessage)
    const queryClient = useQueryClient()

    let recipient = {}

    if (convo) {
        if (convo.sender_id === user.id) /// sender is a user
        {
            recipient.id = convo.recipient_id
            recipient.user = convo.recipient_name
            recipient.level = convo.recipient_level
        }
        else {
            recipient.id = convo.sender_id
            recipient.user = convo.sender_name
            recipient.level = convo.sender_level
        }
    }

    async function onSubmit(data) {
        let forSending = { ...data, sender_id: user.id }
        if (convo) {
            forSending.recipient_id = recipient.id
            forSending.replay_to = convo.id
        }
        await createMutation.mutateAsync(forSending)
        queryClient.invalidateQueries('convos')
        handleClose()
    }


    return <>
        <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
            Send to: <br />
            {convo ?
                <UserHighlight user={recipient.user} id={recipient.id} level={recipient.level} /> :
                <input {...register("recipient_id")} required />}
            <br />
            Title: <br />
            <input {...register("title")} required />
            <br />
            Message: <br />
            <textarea {...register("message_body")} rows={8} cols={90} required /> <br />
            <Button variant="secondary" onClick={handleClose} className="mr-2">
                Cancel
            </Button>
            <ButtonWithSpin
                className="btn-primary"
                type="submit"
                spinning={createMutation.isLoading}
                label="Post"
                spinningLabel="Posting..."
            />
        </form>
    </>

}

export default FormAddMessage