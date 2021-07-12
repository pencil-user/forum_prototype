import React, { useState, useContext, useEffect } from 'react'
import { useForm } from "react-hook-form";
import { useHistory  } from 'react-router-dom';
import { AsyncTypeahead, Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useQuery } from "react-query";
import axios from 'axios'

/*
function SearchField()
{
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
      } = useForm();
    
    const history = useHistory();
    
    async function onSubmit(data)
    {
        console.log('search data', data)

        if(data.search.length > 3)
            history.push("/search/"+data.search)
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="Search..." {...register('search')} minlength={3}/>
        </form>

    )

}*/

function SearchField()
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
                let result = await axios.get('/api/search/'+input+'?offset=0&limit=8')

                if(result.data)
                {
                    setData(result.data.map(x=>({id:x.id, label:x.title })))
                }
                setStatus('idle')

            }       

        }
    ,[input])

    function change(query, e)
    {
        console.log('CHANGE')
        setInput(query)

    }

    function change2(query, e)
    {
        if(query[0]?.id)
        {
            history.push('/thread/'+ query[0].id + '/page/1')
            setInput('')
        }

    }  
    
    function keyDown(e)
    {
        console.log('KEY DOWN')
        if(e.code === 'Enter' && input.length>=3)
        {
            console.log('KEY DOWN ENTER')           
            let i = input
            setInput(x=>'')
            history.push('/search/'+i)
        }
    }

    function submit(e)
    {
        e.preventDefault()
        history.push('/search/'+input)
    }

    function handleSearch(query)
    {
        console.log('handleSearch', query)
    }


    return (
    <span>
        <form onSubmit={submit}>
            <AsyncTypeahead
                id='MainSearch'
                isLoading={status ==='loading'}
                query={input}
                options={data}
                onSearch={handleSearch}
                maxResults={100}
                minLength={3}
                onInputChange={change}
                onKeyDown={keyDown}
                onChange={change2}
                placeholder='Search'
                filterBy={() => true}
            ></AsyncTypeahead>
        </form>            
    </span>
    )

}

export default SearchField