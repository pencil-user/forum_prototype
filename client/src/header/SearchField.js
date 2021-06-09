import React, { useState, useContext } from 'react'
import { useForm } from "react-hook-form";
import { useHistory  } from 'react-router-dom';


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

}

export default SearchField