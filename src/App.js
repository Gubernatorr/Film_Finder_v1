import React, { useState } from 'react';

export default function Background() {
  const [addedMovies, setAddedMovies] = useState([]);

  const handleAddMovie = (movieData) => {
    const isAlreadyAdded = addedMovies.some(movie => movie.id === movieData.id);
    if (!isAlreadyAdded) {
      setAddedMovies(prevMovies => [...prevMovies, movieData]);
    }
  };

  return (
    <div id='container'>
      <div id='films-window'>
        {addedMovies.map(movie => (
          <FilmBlock key={movie.id} data={movie} />
        ))}
      </div>
      <div id='search-window'>
        <SearchWindow onAddMovie={handleAddMovie} />
      </div>
    </div>
  );
}

export function FindMovie({ title, onSearch, onAddMovie }) {
  const [loading, setLoading] = useState(false);
  const [movieData, setMovieData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [searched, setSearched] = useState(false);

  const apiKey = 'f48e2cc7';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSearched(true);

    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${title}`);
      const data = await response.json();
      if (data.Response === 'False') {
        setMovieData(null);
        setErrorMessage('Movie not found!');
      } else {
        setMovieData(normalizeMovieData(data));
      }
    } catch (error) {
      console.error('Error fetching movie data:', error);
      setMovieData(null);
      setErrorMessage('Error fetching movie data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = () => {
    if (movieData) {
      onAddMovie(movieData);
      setMovieData(null);
      setErrorMessage(''); // Очищуємо повідомлення про помилку при додаванні фільму
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button className='button-style-search' type="submit" disabled={!title || loading}>
          {loading ? 'Loading...' : 'Search'}
        </button>
        <button className='button-style-addtothelist' type="button" onClick={handleAddMovie} disabled={!title || loading}>
          Add to the list
        </button>
        <p style={{textAlign: 'initial', fontWeight: 'bold', fontSize: '16pt'}}>Preview</p>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {movieData && <MovieCard {...movieData} />}
    </div>
  );
}


function normalizeMovieData(data) {
  return {
    id: data.imdbID,
    Title: data.Title,
    Poster: data.Poster === 'N/A' ? 'https://i.imgur.com/y46t63Q.png' : data.Poster,
    Plot: data.Plot,
  };
}

function MovieCard(data) {
  const posterURL = data.Poster === 'N/A' ? 'https://i.imgur.com/y46t63Q.png' : data.Poster;

  return (
    <div className="movie-preview">
      <img src={posterURL} alt={data.Title} style={{ width: '200px', height: '250px', marginLeft: '63px' }} />
      <div style={{ position: 'relative', width: '100%', marginTop: '10px' }}>
        <div className='square' style={{ position: 'absolute', top: 8 }}></div>
        <h2 style={{ marginTop: '0', marginBottom: '0', marginLeft: '22px', textAlign: 'initial', paddingLeft: '55px', overflowWrap: 'anywhere' }}>{data.Title}</h2>
      </div>
      <p style={{ marginTop: '30px', marginLeft: '15px', marginRight: '15px' }}>{data.Plot}</p>
      <a href={`https://www.imdb.com/title/${data.id}`} style={{ textAlign: 'left !important', marginLeft: '15px' }}>IMDB</a>
    </div>
  );
}


export function SearchWindow({ onAddMovie }) {
  const [searchTitle, setSearchTitle] = useState('');
  const [foundMovie, setFoundMovie] = useState(null);

  const handleSearchTitleChange = (value) => {
    setSearchTitle(value);
  };

  const handleFoundMovie = (movieData) => {
    setFoundMovie(movieData);
  };

  return (
    <div id="search-window-block">
      <h3 style={{fontSize: '18pt'}}>Movie Title</h3>
      <input className='search-input'
        type="text"
        value={searchTitle}
        onChange={(e) => handleSearchTitleChange(e.target.value)}
        placeholder="Enter movie title"
      />
      <FindMovie title={searchTitle} onSearch={handleFoundMovie} onAddMovie={onAddMovie} />
      {foundMovie ? <MovieCard {...foundMovie} /> : null}
    </div>
  );
}

function FilmBlock({ data }) {
  return (
    <div className="movie-show-state">
      <img src={data.Poster} alt={data.Title} style={{width: '200px', height: '250px', marginLeft: '63px'}} />
      <div style={{ position: 'relative', width: '100%', marginTop: '10px' }}>
        <div className='square' style={{ position: 'absolute', top: 8}}></div>
        <h2 style={{ marginTop: '0', marginBottom: '0', marginLeft: '22px', textAlign: 'initial', paddingLeft: '55px', overflowWrap: 'anywhere' }}>{data.Title}</h2>
      </div>
      <p style={{marginTop: '30px', marginLeft: '15px', marginRight: '15px'}}>{data.Plot}</p>
      <a href={`https://www.imdb.com/title/${data.id}`} style={{textAlign: 'left !important', marginLeft: '15px'}}>IMDB</a>
    </div>
  );
}
