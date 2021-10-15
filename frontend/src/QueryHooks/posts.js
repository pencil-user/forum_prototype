import { useQuery, useQueryClient, useMutation } from "react-query";
import {fetchWithJWT} from '../FetchService/FetchService.js'

const REFETCH_INTERVAL = 60*1000

export function useGetSinglePost(id)
{
    const { data, error, isLoading, isError } = useQuery(
        ["post" , { id }], 
        async ({queryKey}) =>{
            const [_key, { id }] = queryKey;
            let result = await fetchWithJWT.get('/api/posts/' + id)

            return result.data
        },
        {refetchInterval: REFETCH_INTERVAL}
    )

    return { data, error, isLoading, isError }

}

export function useGetPostsByThread(thread_id, currentPage=1, postsPerPage=5 )
{
    const { data, error, isLoading, isError } = useQuery(
        ["posts" , { thread_id, offset:(postsPerPage * (currentPage-1)), limit:postsPerPage }], 
        async ({queryKey}) => {
            const [_key, { thread_id, offset, limit }] = queryKey;
            let result = await fetchWithJWT.get('/api/posts?thread_id=' + thread_id +'&offset='+ offset + '&limit='+limit)

            return {total: +result.headers['-total'] , posts: result.data}
        }
    )

    return { data, error, isLoading, isError };
}

export function useUpdatePost()
{
    const queryClient = useQueryClient()
    const { mutateAsync, isLoading } = useMutation(
        async ({...data}) =>
        {
            const result = await fetchWithJWT.patch('/api/posts/'+data.id, {post_body: data.post_body})
            return result.data
        }
    )

    async function updatePost(post_body, id)
    {
        await mutateAsync({post_body: post_body, id: id})
        queryClient.invalidateQueries('posts')
        queryClient.invalidateQueries('post')
    }

    return {isLoading, updatePost}
}

export function useCreatePost()
{
    const queryClient = useQueryClient()
    const { mutateAsync, isLoading } = useMutation(
        async ({...data}) =>
        {
            const result = await fetchWithJWT.post('/api/posts/', data)
            return result.data
        }        
    )

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
    const { mutateAsync, isLoading } = useMutation(
        async ({...data})=>
        {
            let result = await fetchWithJWT.delete('/api/posts/'+data.id)
            return result.data
        }
    )
    const queryClient = useQueryClient()

    async function deletePost(id)
    {
        await mutateAsync({id:id})
        queryClient.invalidateQueries('posts')
    }

    return {isLoading, deletePost}
}