import React from 'react';
// react router
import {
    Link,
    useLocation
} from "react-router-dom";

function ModalLink({ children, to, style, className }) {
    let location = useLocation();
    return <Link
        style={style}
        className={className}
        to={{
            ...to,
            state: { ...to.state, background: location }
        }}>
        {children}
    </Link>
}

export default ModalLink