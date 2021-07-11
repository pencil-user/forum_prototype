import React from 'react'
import { Link } from 'react-router-dom';


function ShowThreadCell({thread, disabled})
{
    const title = <>
        {!!thread.locked && <span className="badge bg-primary text-light">locked</span>} 
        {!!thread.pinned && <span className="badge bg-info text-light">pinned</span>}         
        {thread.title}
    </>

    let pages=[]
    if(thread.post_count>5)
        for(let a=1; a<=Math.ceil(thread.post_count/5); a++)
        {
            pages.push(a)
        }

    if(disabled) return (
        <div>
            {title} 
        </div>
    )

    return (
        <div>
            <Link to={"thread/"+thread.id+'/page/1'}>{title}</Link>
            <span style={{marginLeft:10}}>
                {pages.map(x=> 
                    <Link
                        to={"thread/"+thread.id+'/page/'+x} 
                        class="bg-primary text-white rounded" 
                        style={{margin:'2px', paddingLeft:'5px', paddingRight:'5px'}}
                    >
                        {x}
                    </Link>)}
            </span>
        </div>
    )
    
}

export default ShowThreadCell