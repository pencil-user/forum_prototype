import React from 'react'

import { Link, useParams } from 'react-router-dom';

import { useQuery } from "react-query";
import axios from 'axios'


async function getSearchResults({queryKey})
{
    const [_key, { query }] = queryKey;
    let result = await axios.get('/api/search/' + query)

    return result.data
}


function SearchResults()
{
    const {query} = useParams()

    const { data, error, isLoading, isError } = useQuery(["searchResults" , { query }], getSearchResults);

    let title =  <h2>Results for <span style={{color:'green'}}>{query}</span></h2>

    if(isLoading)
        return <>{title} loading</>

    if(isError)
        return  <>{title} error</>

    return <>
        {title}
        {data.map(item => <div key={item.id}>
            <Link to={"/thread/"+item.id}>{item.title}</Link>
            </div>)
        }
    </>

}

export default SearchResults