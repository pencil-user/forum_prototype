import React, { useState, useContext } from 'react'
import {Container, Row, Table} from 'react-bootstrap'

import {LinkContainer} from 'react-router-bootstrap'
import { Link } from "react-router-dom"


import { QueryClientProvider, QueryClient } from "react-query"


import { useQuery } from "react-query";
import axios from 'axios'

import ListThreads from "../threads/ListThreads.js"

//import 'bootstrap/dist/css/bootstrap.min.css';

async function getThreads()
{
    let result = await axios.get('/api/threads/')

    console.log("result", result)

    return result.data
}

function Home()
{
    const { data, error, isLoading, isError } = useQuery("threads", getThreads);

    if(isLoading)
        return <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>
      
    if(isError)
        return <div>There's an error</div>
    
    return <ListThreads data={data}/>
    
}

export default Home