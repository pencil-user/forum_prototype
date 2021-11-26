import { useQuery } from "react-query";
//import axios from 'axios'
import { fetchWithJWT } from '../FetchService/FetchService.js'


export const useGetSearch = (query) =>
    useQuery(
        ["searchResults", { query }],
        async ({ queryKey }) => {
            const [_key, { query }] = queryKey;
            const result = await fetchWithJWT.get('/api/search/' + query + '?offset=0')

            return result.data
        }
    )
