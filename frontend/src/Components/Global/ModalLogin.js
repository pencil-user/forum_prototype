import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import { LoginUser } from '../../UserService/UserService.js';

import axios from 'axios'



function ModalLogin({ show, handleClose }) {

    return <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Login
                </Modal.Title>
            </Modal.Header>
            <FormLogin handleClose={handleClose} />
        </Modal>

    </>
}

function FormLogin({ handleClose }) {
    const [isSending, setIsSending] = useState(false);
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm();

    async function onSubmit(data) {
        console.log('login data', data)

        setIsSending(true)
        try {
            let result = await axios.post('/api/login/', data)
            LoginUser(result.data)
            handleClose()
        }
        catch (error) {
            console.log('error in error', error.response.data)
            setError(error.response.data?.field, {
                type: "manual",
                message: error.response.data?.error
            })
        }
        setIsSending(false)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body>
                {errors.username && <div style={{ color: 'red' }}>{errors.username.message}</div>}
                Username: <br />
                <input type="text" {...register('username')} minLength={5} required />
                <br />
                {errors.password && <div style={{ color: 'red' }}>{errors.password.message}</div>}
                Password: <br />
                <input type="password" {...register('password')} minLength={6} required />
                <br />
                <span style={{ color: 'green' }}>Try 'admin', 'admin123' or 'SomeGuy', 'SomeGuy123'</span>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                {
                    isSending ?
                        <button className="btn btn-primary">
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Sending...
                        </button>
                        :
                        <button className="btn btn-primary" type="submit">
                            Login
                        </button>
                }
            </Modal.Footer>
        </form>
    )
}

export default ModalLogin