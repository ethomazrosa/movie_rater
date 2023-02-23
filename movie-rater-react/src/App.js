import React, { useState, useEffect } from 'react';
import './App.css';
import MovieList from './components/movie-list';
import MovieDetails from './components/movie-details';
import MovieForm from './components/movie-form';
import { API } from './api-service';
import { useCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm, faSignOut } from '@fortawesome/free-solid-svg-icons'

function App() {

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [editedMovie, setEditedMovie] = useState(null);
  const [token, setToken, removeToken] = useCookies([API.TOKEN_NAME]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/movies/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token[API.TOKEN_NAME]}`
      }
    })
      .then((response) => response.json())
      .then((response) => setMovies(response))
      .catch((error) => console.log(error));
  }, [token]);

  useEffect(() => {
    if (!token[API.TOKEN_NAME] | token[API.TOKEN_NAME] === undefined)
      window.location.href = '/';
  }, [token])

  const loadMovie = movie => {
    const newMovies = movies.map(mov => {
      if (mov.id === movie.id) {
        return movie;
      }
      return mov;
    });
    setMovies(newMovies);
    setSelectedMovie(movie);
    setEditedMovie(null);
  }

  const editClicked = (movie) => {
    setEditedMovie(movie);
    setSelectedMovie(null);
  }

  const updatedMovie = movie => {
    const newMovies = movies.map(mov => {
      if (mov.id === movie.id) {
        return movie;
      }
      return mov;
    });
    setMovies(newMovies);
  }

  const newMovie = () => {
    setEditedMovie({ title: '', description: '' });
    setSelectedMovie(null);
  }

  const movieCreated = (movie) => {
    const newMovies = [...movies, movie];
    setMovies(newMovies);
  }

  const removeClicked = (movie) => {
    // const newMovies = movies.filter((mov) => {
    //   if (mov.id === movie.id) {
    //     return false;
    //   }
    //   return true;
    // });
    const newMovies = movies.filter((mov) => mov.id !== movie.id)
    setMovies(newMovies);
  }

  const logoutUser = () => {
    console.log('removeToken');
    removeToken([API.TOKEN_NAME], { path: '/' });
  }

  return (
    <div className="App">
      <header className="App-header">
        <FontAwesomeIcon icon={faSignOut} onClick={logoutUser} />
        <h1>
          <FontAwesomeIcon icon={faFilm} />
          <span> Movie Rater</span>
        </h1>
      </header>
      <div className="layout">
        <div>
          <MovieList
            movies={movies}
            movieClicked={loadMovie}
            editClicked={editClicked}
            removeClicked={removeClicked} />
          <button onClick={newMovie}>New Movie</button>
        </div>
        <MovieDetails movie={selectedMovie} updateMovie={loadMovie} />
        {editedMovie ?
          <MovieForm movie={editedMovie} updatedMovie={updatedMovie} movieCreated={movieCreated} />
          : null}
      </div>
    </div>
  );
}

export default App;
