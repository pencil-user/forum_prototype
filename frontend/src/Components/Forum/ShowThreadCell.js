import React from 'react'
import { Link } from 'react-router-dom';


function ShowThreadCell({thread, disabled})
{
    const title = <>
        {!!thread.locked && <span className="badge bg-primary text-light">locked</span>} 
        {!!thread.pinned && <span className="badge bg-info text-light">pinned</span>}         
        {thread.title} 

    </>


    if(disabled) return (
        <div>
            {title} 
        </div>
    )

    return (
        <div>
             <Link to={"thread/"+thread.id+'/page/1'}>{title}</Link>
        </div>
    )
    
}

export default ShowThreadCell