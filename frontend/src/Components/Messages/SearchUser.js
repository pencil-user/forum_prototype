import React, { useState, useContext, useEffect } from 'react'
import { useForm, Controller } from "react-hook-form";
import { useHistory  } from 'react-router-dom';
import { AsyncTypeahead, Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useQuery } from "react-query";
import axios from 'axios'


function SearchUser({ref=null})
{
    const [input, setInput] = useState('')
    const [status, setStatus] = useState('idle') 
    const [sentInput, setSentInput] = useState('')
    const [data, setData] = useState([])

    const history = useHistory();

    useEffect(
        async ()=>{

            if(input.length>=3 && input != sentInput && status!='loading')
            {
                setSentInput(input)
                setStatus('loading')
                let result = await axios.get('/api/users/?username='+input+'&offset=0&limit=8')

                if(result.data)
                {
                    setData(result.data.map(x=>({id:x.id, label:x.username })))
                }
                setStatus('idle')

            }       

        }
    ,[input])

    function change(query, e)
    {
        console.log('CHANGE')
        setInput(query)
        console.log("QUERY", e)
    }

    function handleSearch(query)
    {
        console.log('handleSearch', query)
    }


    return (
    <span>
       
        <AsyncTypeahead
            id='UserSearch'
            isLoading={status ==='loading'}
            query={input}
            options={data}
            onSearch={handleSearch}
            maxResults={100}
            minLength={3}
            onInputChange={change}
            placeholder='Search'
            filterBy={() => true}
        ></AsyncTypeahead>           
    </span>
    )

}

export default SearchUser