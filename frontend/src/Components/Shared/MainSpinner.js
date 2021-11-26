import React from 'react';

function MainSpinner({ margin = true }) {
    if (margin)
        return (
            <div className="container">
                <div className="row justify-content-md-center">
                    <div
                        role="status"
                        className="spinner-border"
                        style={{
                            'marginTop': 150,
                            'marginBottom': 150,
                            'width': '3rem',
                            'height': '3rem'
                        }}>
                        <span className="sr-only">
                            Loading...
                        </span>
                    </div>
                </div>
            </div>
        )

    return (
        <div className="container">
            <div className="row justify-content-md-center">
                <div role="status" className="spinner-border" > <span className="sr-only">Loading...</span></div>
            </div>
        </div>
    )
}

export default MainSpinner