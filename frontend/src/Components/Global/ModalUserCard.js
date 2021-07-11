import React, { useState } from 'react'
import {Modal, Button } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import {LoginUser} from '../../UserService/UserService.js';

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
            
            {show && <Loader handleClose={handleClose}/>}
        </Modal>

    </> 
}

function Loader()
{
    return <>

    
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
        </Modal.Footer>    
    </>
}

export default ModalUserCard