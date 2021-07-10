import React from 'react';
// react router
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory,
    useLocation,
    useParams,
    matchPath
  } from "react-router-dom";


function parseQuery(queryString=null) {
    if (queryString=== null) return null
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

function ModalSwitch({children, modals})
{
    let location = useLocation();
    //const {id} = useParams()
    let background = location.state && location.state.background;
    let history = useHistory();

    let handleCloseObject = {}

    modals.map( x=> handleCloseObject[x.pathname] =
        ()=>
        {
            if(matchPath(window.location.pathname,{path:location.pathname}))
            {
                history.goBack()
            }
            else
            {
            }
        })

    console.log('location', location.pathname)
    
    return(
        <>
            <Switch location={background || location}>
                {children}
            </Switch>
            {modals.map(
                x=> <span key={x.pathname}>
                        {x.modal({
                            show:!!matchPath(location.pathname,{path:x.pathname}),
                            handleClose: handleCloseObject[x.pathname],
                            params: matchPath(location.pathname,{path:x.pathname})?.params,
                            query:  parseQuery(matchPath(location.pathname,{path:x.pathname})?.search),
                            ...x.location?.state?.props
                        })}
                    </span>
            )}
        </>
    )
}

export default ModalSwitch