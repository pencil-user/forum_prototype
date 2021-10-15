import { useQuery, useQueryClient, useMutation } from "react-query";
import {fetchWithJWT} from '../FetchService/FetchService.js'

const REFETCH_INTERVAL = 60*1000

export function useGetConvos(userid)
{
    const { data, isLoading } = useQuery(
        ["convos", {userid:userid}], 

        async ({queryKey}) => {
            const [_key, { userid }] = queryKey;
            let result = await fetchWithJWT.get('/api/messages/' + userid)
            return result.data        
        },

        {refetchInterval: REFETCH_INTERVAL}
    )

    return { data,isLoading}
}

export function useGetConvosCount(userid)
{
    const { data, isLoading } = useQuery(
        ["convos-count", {userid:userid}], 
        async ({queryKey}) => {
            const [_key, { userid }] = queryKey;
            let result = await fetchWithJWT.get('/api/messages/' + userid)
            return result.headers['-unread-count']
        },
        {refetchInterval: REFETCH_INTERVAL}
    )
 
    return {data, isLoading}
}

export function useGetSingleConvo(userid, convoid)
{
    const { data, isLoading } = useQuery(
        ["convos", {userid:userid, convoid}],
        async ({queryKey}) => {
            const [_key, { userid, convoid }] = queryKey;
            let result = await fetchWithJWT.get('/api/messages/' + userid + '/' + convoid)
    
            return result.data
        }, 
        {refetchInterval: REFETCH_INTERVAL}
    )

    return { data, isLoading } 
}

export function useCreateMessage()
{
    const queryClient = useQueryClient()
    const { mutateAsync, isLoading } = useMutation(
        async ({...data}) =>
        {
            console.log('data for message', data)
            let result = await fetchWithJWT.post('/api/messages/', data)

            return result.data
        }
    )

    async function createMessage(data)
    {
        await mutateAsync(data)
        queryClient.invalidateQueries('convos')
    }

    return { createMessage, isLoading }
}