import React from 'react'

import { Link, useParams } from 'react-router-dom';

import { useGetSearch } from '../../QueryHooks/search.js'

import MainSpinner from '../Shared/MainSpinner.js'


function SearchResults() {
    const { query } = useParams()

    const { data, isLoading, isError } = useGetSearch(query)

    let title = <h2>Results for <span style={{ color: 'green' }}>{query}</span></h2>

    if (isLoading)
        return <>{title} <MainSpinner /></>

    if (isError)
        return <>{title} error</>

    return <>
        {title}
        {data.map(item => <div key={item.id}>
            <h5><Link to={"/thread/" + item.id}>{item.title}</Link></h5>
        </div>)
        }
    </>

}

export default SearchResults