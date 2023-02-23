import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { API } from '../api-service';
import { useCookies } from 'react-cookie';

function MovieDetails(props) {

    const [highlighted, setHighlighted] = useState(-1);
    const [token] = useCookies([API.TOKEN_NAME]);

    const mov = props.movie;

    const highlightRate = (high) => evt => {
        setHighlighted(high);
    };

    const rateClicked = (rate) => evt => {
        fetch(`http://127.0.0.1:8000/api/movies/${mov.id}/rate_movie/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token[API.TOKEN_NAME]}`
            },
            body: JSON.stringify({ stars: rate + 1 })
        })
            .then(() => getDetails())
            .catch((error) => console.log(error));
    }

    const getDetails = () => {
        fetch(`http://127.0.0.1:8000/api/movies/${mov.id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token[API.TOKEN_NAME]}`
            }
        })
            .then((response) => response.json())
            .then((response) => props.updateMovie(response))
            .catch((error) => console.log(error));
    };

    return (
        <React.Fragment>
            {mov ? (
                <div>
                    <h1>{mov.title}</h1>
                    <p>{mov.description}</p>
                    <FontAwesomeIcon icon={faStar} className={mov.average_rating > 0 ? 'orange' : ''} />
                    <FontAwesomeIcon icon={faStar} className={mov.average_rating > 1 ? 'orange' : ''} />
                    <FontAwesomeIcon icon={faStar} className={mov.average_rating > 2 ? 'orange' : ''} />
                    <FontAwesomeIcon icon={faStar} className={mov.average_rating > 3 ? 'orange' : ''} />
                    <FontAwesomeIcon icon={faStar} className={mov.average_rating > 4 ? 'orange' : ''} />
                    ({mov.ratings_count})

                    <div className="rate-container">
                        <h2>Rate it</h2>
                        {[...Array(5)].map((e, i) => {
                            return <FontAwesomeIcon key={i} icon={faStar}
                                className={highlighted > i - 1 ? 'purple' : ''}
                                onMouseEnter={highlightRate(i)}
                                onMouseLeave={highlightRate(-1)}
                                onClick={rateClicked(i)} />;
                        })}
                    </div>
                </div>
            ) : null}
        </React.Fragment>
    );
}

export default MovieDetails;