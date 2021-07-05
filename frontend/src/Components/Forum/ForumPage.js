import React from 'react'

import { useQuery } from "react-query";
import axios from 'axios'

import ListThreads from "./ListThreads.js"

//import 'bootstrap/dist/css/bootstrap.min.css';

async function getThreads()
{
    let result = await axios.get('/api/threads/')

    console.log("result", result)

    return result.data
}

function Home()
{
    const { data, isLoading, isError } = useQuery("threads", getThreads);

    if(isLoading)
        return <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>
      
    if(isError)
        return <div>There's an error</div>
    
    return <ListThreads data={data}/>
    
}

export default Home