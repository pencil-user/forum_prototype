import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import axios from 'axios'

function SearchField() {
    const [input, setInput] = useState('')
    const [status, setStatus] = useState('idle')
    const [prevInput, setPrevInput] = useState('')
    const [data, setData] = useState([])

    const history = useHistory();

    useEffect(
        async () => {

            if (input.length >= 3 && input != prevInput && status != 'loading') {
                setPrevInput(input)
                setStatus('loading')
                let result = await axios.get('/api/search/' + input + '?offset=0&limit=8')

                if (result.data) {
                    setData(result.data.map(x => ({ id: x.id, label: x.title })))
                }
                setStatus('idle')

            }

        }
        , [input])

    function change(query, e) {
        console.log('CHANGE')
        setInput(query)

    }

    function change2(query, e) {
        if (query[0]?.id) {
            history.push('/thread/' + query[0].id + '/page/1')
            setInput('')
        }

    }

    function keyDown(e) {
        console.log('KEY DOWN')
        if (e.code === 'Enter' && input.length >= 3) {
            console.log('KEY DOWN ENTER')
            let i = input
            setInput(x => '')
            history.push('/search/' + i)
        }
    }

    function submit(e) {
        e.preventDefault()
        history.push('/search/' + input)
    }

    function handleSearch(query) {
        console.log('handleSearch', query)
    }


    return (
        <span>
            <form onSubmit={submit}>
                <AsyncTypeahead
                    id='MainSearch'
                    isLoading={status === 'loading'}
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