import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useForm } from "react-hook-form";

import { AddAlert } from '../../AlertService/AlertService.js'

import axios from 'axios'

function ModalRegister({ show, handleClose }) {

    return <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Register
                </Modal.Title>
            </Modal.Header>
            <FormRegister handleClose={handleClose} />
        </Modal>

    </>
}

function FormRegister({ handleClose }) {
    const [isSending, setIsSending] = useState(false);
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm();

    async function onSubmit(data) {
        console.log('login data', data)

        if (data.password !== data.confirm) {
            setError("password",
                {
                    type: "manual",
                    message: "passwords don't match"
                })
            return;

        }

        setIsSending(true)
        try {
            let result = await axios.post('/api/users/', { username: data.username, email: data.email, password: data.password })
            handleClose()
            AddAlert('Succesfully registered. Wait for the admin to approve you.', 'warning')
        }
        catch (error) {
            setError(error?.response?.data?.field, {
                type: "manual",
                message: error?.response?.data?.error
            })
        }
        setIsSending(false)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body>
                Username: <br />
                {errors.username && <div style={{ color: 'red' }}>{errors.username.message}</div>}
                <input type="text" {...register('username')} required minLength={5} /><br />
                Email: <br />
                {errors.email && <div style={{ color: 'red' }}>{errors.email.message}</div>}
                <input type="email" {...register('email')} required />
                <br />
                Password: <br />
                {errors.password && <div style={{ color: 'red' }}>{errors.password.message}</div>}
                <input type="password" {...register('password')} required minLength={6} /><br />
                Confirm: <br />
                <input type="password" {...register('confirm')} required minLength={6} />
                <br />

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
                            Register
                        </button>
                }
            </Modal.Footer>
        </form>
    )
}

export default ModalRegister