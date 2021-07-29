import { useQuery, useQueryClient, useMutation } from "react-query";
import {fetchWithJWT} from '../FetchService/FetchService.js'

const REFETCH_INTERVAL = 60*1000

export function useGetSinglePost(id)
{
    const { data, error, isLoading, isError } = useQuery(["post" , { id }], doGetSinglePost, {
            refetchInterval: REFETCH_INTERVAL,
        })

    async function doGetSinglePost({queryKey})
    {
        const [_key, { id }] = queryKey;
        let result = await fetchWithJWT.get('/api/posts/' + id)

        return result.data
    }

    return { data, error, isLoading, isError }

}

export function useGetPostsByThread(thread_id, currentPage=1, postsPerPage=5 )
{
    const { data, error, isLoading, isError } = useQuery(["posts" , { thread_id, offset:(postsPerPage * (currentPage-1)), limit:postsPerPage }], doGetPostsByThread)

    async function doGetPostsByThread({queryKey})
    {
        const [_key, { thread_id, offset, limit }] = queryKey;
        let result = await fetchWithJWT.get('/api/posts?thread_id=' + thread_id +'&offset='+ offset + '&limit='+limit)

        console.log('posts result', result)

        return {total: +result.headers['-total'] , posts: result.data}
    }

    return { data, error, isLoading, isError };

}

export function useUpdatePost()
{
    const queryClient = useQueryClient()
    const { mutateAsync, isLoading } = useMutation(doUpdatePost)

    async function updatePost(post_body, id)
    {
        await mutateAsync({post_body: post_body, id: id})
        queryClient.invalidateQueries('posts')
        queryClient.invalidateQueries('post')

    }

    async function doUpdatePost({...data})
    {
        console.log('data for editpost', data)
        const result = await fetchWithJWT.patch('/api/posts/'+data.id, {post_body: data.post_body})

        return result.data
    }

    return {isLoading, updatePost}
}

export function useCreatePost()
{
    const queryClient = useQueryClient()
    const { mutateAsync, isLoading } = useMutation(doCreatePost)

    async function doCreatePost({...data})
    {
        console.log('CREATE DATA', data)
        const result = await fetchWithJWT.post('/api/posts/', data)

        return result.data
    }

    async function createPost(post_body, thread_id)
    {
        await mutateAsync({post_body: post_body, thread_id: thread_id})
        queryClient.invalidateQueries('thread')
        queryClient.invalidateQueries('posts')
    }

    return {isLoading, createPost}
}

export function useDeletePost()
{
    const { mutateAsync, isLoading } = useMutation(doDeletePost)
    const queryClient = useQueryClient()

    async function doDeletePost({...data})
    {
        let result = await fetchWithJWT.delete('/api/posts/'+data.id)
        return result.data
    }

    async function deletePost(id)
    {
        await mutateAsync({id:id})
        queryClient.invalidateQueries('posts')
    }

    return {isLoading, deletePost}
}