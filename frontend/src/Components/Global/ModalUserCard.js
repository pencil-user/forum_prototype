import React, { useState } from 'react'
import {Modal, Button } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import {LoginUser} from '../../UserService/UserService.js';
import { useQuery } from "react-query";


import axios from 'axios'

function ModalUserCard({show, handleClose, params=null})
{
    const id = params?.id

    return <>       
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Modal User Card {id}
                </Modal.Title>
            </Modal.Header>
            
            {show && <Loader handleClose={handleClose} id={id}/>}
        </Modal>

    </> 
}

async function getUsers({queryKey})
{
    const [_key, { id }] = queryKey;
    let result = await axios.get('/api/users/' + id)

    return result.data
}

function Loader({handleClose, id})
{
    const { data, isLoading, isError } = useQuery(["users", {id}], getUsers);

    return <>
        <Modal.Body>
            {data && 
                    <div>
                    <div>
                        Username: {data.username}
                    </div>
                    <div>
                        Level: {['Anonymous', 'User', 'Administrator'][data.level]}
                    </div>
                </div>
            }
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
        </Modal.Footer>    
    </>
}

export default ModalUserCard