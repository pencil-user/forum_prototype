import { useQuery } from "react-query";
//import axios from 'axios'
import {fetchWithJWT} from '../FetchService/FetchService.js'


export function useGetSearch(query)
{
    const { data, error, isLoading, isError } = useQuery(["searchResults" , { query }], doGetSearchResults);

    async function doGetSearchResults({queryKey})
    {
        const [_key, { query }] = queryKey;
        let result = await fetchWithJWT.get('/api/search/' + query +'?offset=0')

        return result.data
    }
    return { data, error, isLoading, isError }

}