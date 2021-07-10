import React from 'react';

function MainSpinner()
{
    return (
        <div className="container">
            <div className="row justify-content-md-center">
                <div role="status" className="spinner-border" style={{'marginTop':150, 'marginBottom':150, 
    }}> <span className="sr-only">Loading...</span></div>
            </div>
        </div>
    )
}

export default MainSpinner