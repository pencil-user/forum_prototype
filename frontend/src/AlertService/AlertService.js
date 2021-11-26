import { Store } from "pullstate";

export const AlertStore = new Store({
    Alerts: [],
});

export function AddAlert(content, type = "info") {
    let key = Math.random();
    AlertStore.update(s => {
        s.Alerts.push(
            {
                content: content,
                type: type,
                key: key
            })
    })
}


/////
// deleting old messages

let curTimeout = null

AlertStore.subscribe(s => s.Alerts,
    s => {
        if (s.length > 0 && !curTimeout) {
            curTimeout = setTimeout(() => {
                curTimeout = null
                AlertStore.update(s1 => { s1.Alerts.length > 0 && s1.Alerts.shift() })
            }, 4000)
        }

        if (s.length == 0 && curTimeout) {
            clearTimeout(curTimeout)
            curTimeout = null
        }
    }
)

