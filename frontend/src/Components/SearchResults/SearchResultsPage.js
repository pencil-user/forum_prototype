import React from 'react'

import { Link, useParams } from 'react-router-dom';

import { useQuery } from "react-query";
import axios from 'axios'

import MainSpinner from '../Shared/MainSpinner.js'

async function getSearchResults({queryKey})
{
    const [_key, { query }] = queryKey;
    let result = await axios.get('/api/search/' + query +'?offset=0')

    return result.data
}


function SearchResults()
{
    const {query} = useParams()

    const { data, error, isLoading, isError } = useQuery(["searchResults" , { query }], getSearchResults);

    let title =  <h2>Results for <span style={{color:'green'}}>{query}</span></h2>

    if(isLoading)
        return <>{title} <MainSpinner/></>

    if(isError)
        return  <>{title} error</>

    return <>
        {title}
        {data.map(item => <div key={item.id}>
            <h5><Link to={"/thread/"+item.id}>{item.title}</Link></h5>
            </div>)
        }
    </>

}

export default SearchResults