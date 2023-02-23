import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { API } from '../api-service';

function useFetch() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState([]);
    const [token] = useCookies([API.TOKEN_NAME]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError();
            const data = await API.getMovies(token[API.TOKEN_NAME])
                .catch((error) => setError(error));
            setData(data);
            setLoading(false);
        };
        fetchData();
    }, []);
    return [data, loading, error];

}

export { useFetch }