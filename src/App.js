
import React, { useState } from 'react';

export default function Background() {

  const films = [
    {
      id: 1,
      title: 'Film 1',
      photo: 'url_to_movie_photo_1',
      logo: 'url_to_movie_logo_1',
      description: 'Description of film 1.'
    },
    {
      id: 2,
      title: 'Film 2',
      photo: 'url_to_movie_photo_2',
      logo: 'url_to_movie_logo_2',
      description: 'Description of film 2.'
    },
    {
      id: 3,
      title: 'Film 3',
      photo: 'url_to_movie_photo_3',
      logo: 'url_to_movie_logo_3',
      description: 'Description of film 3.'
    },
    {
      id: 4,
      title: 'Film 4',
      photo: 'url_to_movie_photo_4',
      logo: 'url_to_movie_logo_4',
      description: 'Description of film 4.'
    },
    {
      id: 5,
      title: 'Film 5',
      photo: 'url_to_movie_photo_5',
      logo: 'url_to_movie_logo_5',
      description: 'Description of film 5.'
    },
    {
      id: 6,
      title: 'Film 6',
      photo: 'url_to_movie_photo_6',
      logo: 'url_to_movie_logo_6',
      description: 'Description of film 6.'
    },
    {
      id: 7,
      title: 'Film 7',
      photo: 'url_to_movie_photo_7',
      logo: 'url_to_movie_logo_7',
      description: 'Description of film 7.'
    }

  ];

  const search_films = [
    {
      id: 8,
      title: 'Film 8',
      photo: 'url_to_movie_photo_8',
      logo: 'url_to_movie_logo_8',
      description: 'Description of film 8.'
    }
  ];

  return (
    <div id='container'>
      <div id='films-window'>
        {films.map(film => (
          <FilmBlock key={film.id} film={film} />
        ))}
      </div>
      <div id='search-window'>
        <SearchWindow />
      </div>
    </div>
  );
}

export function FindMovie({ title, onSearch }) {
  const [loading, setLoading] = useState(false);
  const [movieData, setMovieData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [searched, setSearched] = useState(false); // Додано стан для відстеження виконаного пошуку

  const apiKey = 'f48e2cc7'; // Замініть 'YOUR_API_KEY' на ваш ключ API

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSearched(true); // Встановлюємо прапорець, що пошук виконаний

    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${title}`);
      const data = await response.json();
      if (data.Response === 'False') {
        setMovieData(null);
      } else {
        setMovieData(normalizeMovieData(data));
      }
    } catch (error) {
      console.error('Error fetching movie data:', error);
      setMovieData(null);
      setErrorMessage('Error fetching movie data. Please try again later.'); // Встановлюємо повідомлення про помилку
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = () => {
    // Додайте код для додавання фільму до списку
    // ...
    // Після додавання очистіть форму та видаліть попередній перегляд
    // setTitle('');
    setMovieData(null);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>

        <button className='button-style-search' type="submit" disabled={!title || loading}>
          {loading ? 'Loading...' : 'Search'}
        </button>

        <button className='button-style-addtothelist' onClick={handleAddMovie} disabled={!title}>Add to the list</button>

        <p style={{textAlign: 'initial', fontWeight: 'bold', fontSize: '16pt'}}>Preview</p>

      </form>
      {!errorMessage && searched && !movieData && <p>Movie not found!</p>} {/* Виводимо повідомлення, якщо виконано пошук і результат не знайдено */}
      {movieData && <MovieCard {...movieData} />}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

function normalizeMovieData(data) {
  return {
    Title: data.Title,
    Poster: data.Poster === 'N/A' ? 'https://i.imgur.com/y46t63Q.png' : data.Poster,
    Plot: data.Plot,
    // Додайте нормалізацію інших полів, які ви хочете відобразити
  };
}

function MovieCard(data){
  return (
    <div className="movie-preview">
      <img src={data.Poster === 'N/A' ? 'https://i.imgur.com/y46t63Q.png' : data.Poster} alt={data.Title} style={{width: '200px', height: '250px', marginLeft: '63px'}} />

      <div style={{ position: 'relative', width: '100%', marginTop: '10px' }}>
        <div className='square' style={{ position: 'absolute', top: 8}}></div>
        <h2 style={{ marginTop: '0', marginBottom: '0', marginLeft: '22px', textAlign: 'initial', paddingLeft: '55px', overflowWrap: 'anywhere' }}>{data.Title}</h2>
      </div>

      <p style={{marginTop: '30px', marginLeft: '15px', marginRight: '15px'}}>{data.Plot}</p>
      <a href='https://www.omdbapi.com/' style={{textAlign: 'left !important', marginLeft: '15px'}}>IMDB</a>
    </div>
  );
}

export function SearchWindow() {
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
      
      <FindMovie title={searchTitle} onSearch={handleFoundMovie} />
      
      {foundMovie && <FilmBlock film={foundMovie} />}
    </div>
  );
}

function FilmBlock({ film }) {
  return (
    <div id='box'>
      <div id='avatar'>
        <img src={film.photo} alt={film.title} />
      </div>
      <div id='logo'>
        <img src={film.logo} alt={film.title} />
        <h2>{film.title}</h2>
      </div>
      <div id='description'>
        <p>{film.description}</p>
      </div>
    </div>
  );
}