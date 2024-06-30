import './PageNotFound.scss'
import React from 'react';
import { Link } from 'react-router-dom';

// Als een url niet bestaat wordt verbruiker doorverwezen naar deze pagina
const PageNotFound = () => {
    return(
        <div data-testid="pagenotfound-test" className='PageNotFound-container'>
            <div>
                <h1>Page not found...</h1>
            </div>
            <div>
                <p>
                    The page you are trying to reach is unavailable or doesn't exist.
                </p>
            </div>
            <div>
                <Link to={"./"}>Back to home</Link>
            </div>
            
        </div>
    )
    
}

export default PageNotFound;