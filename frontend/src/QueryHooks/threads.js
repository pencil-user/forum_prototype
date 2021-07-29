import { useQuery, useQueryClient, useMutation } from "react-query";
import {fetchWithJWT} from '../FetchService/FetchService.js'

const REFETCH_INTERVAL = 60*1000

export function useGetSingleThread(id)
{
    const { data, error, isLoading, isError } = useQuery(["thread" , { id }], doGetSingleThread,  {
            refetchInterval: REFETCH_INTERVAL,
        })

    async function doGetSingleThread({queryKey})
    {
        const [_key, { id }] = queryKey;
        let result = await fetchWithJWT.get('/api/threads/' + id)

        return result.data
    }

    return { data, error, isLoading, isError }
}

export function useGetThreadPage(offset, limit)
{
    const queryKey = ["threads", {limit:limit, offset:offset}]

    const { data, isLoading, isError } = useQuery(queryKey, DoGetThreads,  {
        refetchInterval: REFETCH_INTERVAL,
    });

    async function DoGetThreads({queryKey})
    {
        const [_key, { offset, limit }] = queryKey;

        let result = await fetchWithJWT.get('/api/threads/?offset='+offset+'&limit='+limit)

        console.log("result", result)
        return { total:+result.headers['-total'] , threads:result.data }
    }

    return { data, isLoading, isError }

}

export function useCreateThread(id)
{
    const queryClient = useQueryClient()
    const { mutateAsync, isLoading } = useMutation(doCreateThread)

    async function doCreateThread({...data})
    {
        console.log('data for createThread', data)
        let result = await fetchWithJWT.post('/api/threads/', data)
    
        return result.data
    }

    async function createThread({...data})
    {
        await mutateAsync({title: data.title, thread_body: data.thread_body, id})
        queryClient.invalidateQueries('threads')
    }

    return {isLoading, createThread}    
}


export function useUpdateThread(id, offset=null, limit=null)
{
    const queryClient = useQueryClient()
    const { mutateAsync, isLoading } = useMutation(doUpdateThread)

    async function alterQuery(values)
    {
        let previousValues = queryClient.getQueryData(["threads", {limit:limit, offset:offset}]).threads
        let currentValues = previousValues.map(x => x.id===id ? {...x, ...values} : x)
        queryClient.setQueryData(["threads", {limit:limit, offset:offset}], {threads: currentValues})
    }

    async function doUpdateThread({...data})
    {
        let result = await fetchWithJWT.patch('/api/threads/'+data.id, data.data)
        return result.data
    }

    async function lockThread(toggle)
    {
        await mutateAsync({id, data: { locked: toggle}})
        queryClient.invalidateQueries('threads')
        if(offset !== null && limit !== null ) alterQuery({ locked: toggle})
    }

    async function pinThread(toggle)
    {
        await mutateAsync({id, data: { pinned: toggle}})
        queryClient.invalidateQueries('threads')
        if(offset !== null && limit !== null ) alterQuery({ locked: toggle})
    }

    async function updateThread(data)
    {
        await mutateAsync({id, data: {title: data.title, thread_body: data.thread_body}})
        queryClient.invalidateQueries('threads')
        queryClient.invalidateQueries('thread')

        if(offset !== null && limit !== null ) alterQuery(data)
    }

    return {isLoading, lockThread, pinThread, updateThread}
}

export function useDeleteThread(id, offset, limit)
{
    const queryClient = useQueryClient()
    const { mutateAsync, isLoading } = useMutation(doDeleteThread)

    async function doDeleteThread({...data})
    {
        let result = await fetchWithJWT.delete('/api/threads/'+data.id)
        return result.data
    }

    async function deleteThread()
    {
        await mutateAsync({id:id})
        queryClient.invalidateQueries('threads')
        let previousValues = queryClient.getQueryData(["threads", {limit:limit, offset:offset}]).threads
        let currentValues = previousValues.filter(x => x.id!=id )
        queryClient.setQueryData(["threads", {limit:limit, offset:offset}], {threads: currentValues})
    }

    return {isLoading, deleteThread}

}