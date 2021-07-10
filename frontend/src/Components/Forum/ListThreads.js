import React from 'react'
import { Table, Button } from 'react-bootstrap'

import { useQuery } from "react-query";
import axios from 'axios'

import {
    useHistory,
  } from "react-router-dom";

import ModalUpdateThread from './ModalUpdateThread.js'
import ShowThreadRow from './ShowThreadRow.js'

import MainSpinner from '../Shared/MainSpinner.js'

async function getThreads()
{
    let result = await axios.get('/api/threads/')

    console.log("result", result)

    return result.data
}



function ListThreads()
{

    const history = useHistory();

    const { data, isLoading, isError } = useQuery("threads", getThreads);

    function createThread()
    {
        history.push('/create-thread/')
    }

    if(isLoading)
        return <MainSpinner/>
      
    if(isError)
        return <div>There's an error</div>

    return ( 
        <>
        <Button variant="primary"  onClick={createThread}>New Thread</Button>
        <Table striped bordered hover className="mt-1">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Thread</th>
                    <th>Created on</th>
                    <th>Username</th>
                </tr>
            </thead>
            <tbody>
                {data.map(thread =>
                    <ShowThreadRow key={thread.id} thread={thread} />               
                )}

            </tbody>
        </Table>
        <Button variant="primary" onClick={createThread}>New Thread</Button>
        </>
)

}

export default ListThreads