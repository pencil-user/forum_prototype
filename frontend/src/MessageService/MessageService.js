import { Store } from "pullstate";

export const MessageStore = new Store({
    Messages: [],
});

export function AddMessage(content, type = "info")
{
    let key = Math.random();
    MessageStore.update(s=>{s.Messages.push(
        {
            content : content,
            type : type,
            key : key
        })
    })
}


/////
// deleting old messages

let curTimeout = null

MessageStore.subscribe(s => s.Messages,
    s => 
    {
        if(s.length > 0 && !curTimeout)
        {
            curTimeout = setTimeout(() => {
                curTimeout = null
                MessageStore.update(s1=>{s1.Messages.length > 0 && s1.Messages.shift()})
            }, 4000)    
        }

        if(s.length == 0 && curTimeout)
        {
            clearTimeout(curTimeout)
            curTimeout = null
        }
    }
)

