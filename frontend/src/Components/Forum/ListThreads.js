import React, { useState, useContext } from 'react'
import { Table, Button, Container, Row, Col } from 'react-bootstrap'
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';


import { useQuery } from "react-query";
import axios from 'axios'

import ShowThreadRow from './ShowThreadRow.js'

import MainSpinner from '../Shared/MainSpinner.js'

const THREADS_PER_PAGE = 10

function getCurrentPage(location) {
    let query = new URLSearchParams(location.search);
    return +query.get("page") || 1

}

async function getThreads({queryKey})
{
    const [_key, { offset, limit }] = queryKey;

    let result = await axios.get('/api/threads/?offset='+offset+'&limit='+limit)

    console.log("result", result)
    return { total:+result.headers['-total'] , threads:result.data }
}

function ListThreads()
{

    const history = useHistory();

    const params = useParams();

    const page = getCurrentPage(useLocation())//+params?.page || 1

    const [total, setTotal] = useState(THREADS_PER_PAGE*2)

    const [isLoading, setIsLoading] = useState(true)

    function createThread()
    {
        history.push('/create-thread/')
    }
    
    const pages = []
    for(let a=1; a<=page; a++)
    {
        pages.push(a)
    }

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
                {pages.map(x =>
                    <ThreadLoader key={x} page={x} lastPage={page} setTotal={setTotal} setIsLoading={setIsLoading} />               
                )}
            </tbody>
        </Table>
        {(isLoading==false) && 
            <div className="d-flex justify-content-between">
                <div className="">
                    <Button variant="primary" onClick={createThread}>
                        New Thread
                    </Button>
                </div>
            
                <div className="align-self-center">
                {(total>THREADS_PER_PAGE * page) && 

                        <Button 
                            variant="outline-success" 
                            onClick={()=>{history.push('/?page='+(page+1));setIsLoading(true) }}>
                            Load More
                        </Button>
                }
                </div>

                <div style={{'width':100}}>

                </div>

            </div>
        }

        {isLoading && page==1 && <MainSpinner/>}
        {isLoading && page!=1 && <MainSpinner margin={false}/>}       

        </>
)

}

function ThreadLoader({page, lastPage, setTotal, setIsLoading})
{
    const offset = (page-1)*THREADS_PER_PAGE
    const limit  = THREADS_PER_PAGE

    const { data, isLoading, isError } = useQuery(["threads", {limit:limit, offset:offset}], getThreads);

    if(isLoading)
        return (<></>)
    
    if(page == lastPage)
    {
        setTotal(data.total)
        setIsLoading(false)
    }

    return data.threads.map(thread =>
        <ShowThreadRow key={thread.id} thread={thread} />               
    )
}

export default ListThreads