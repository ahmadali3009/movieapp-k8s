import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';

const MovieDetail2 = () => {
  const location = useLocation();
  const movie = location.state?.movie;  // Retrieve movie data from location state

  if (!movie) {
    return (
      <div className="loading">
        <div className="loader" style={{ borderTopColor: 'red', borderBottomColor: 'red' }}></div>
        <p>No movie data available</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="movie-detail-container" style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: 'minmax(250px, 1fr) 2fr',
        gap: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: 'var(--shadow-lg)',
        margin: '2rem auto',
        maxWidth: '1000px'
      }}>
        <div className="movie-poster" style={{
          borderRadius: '0.75rem',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)'
        }}>
          <img
            src={movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg'}
            alt={`${movie.name} poster`}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
        </div>

        <div className="movie-info">
          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '1rem',
            background: 'var(--gradient-1)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            display: 'inline-block'
          }}>{movie.name}</h1>

          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: 'var(--primary)',
              color: 'white',
              borderRadius: '2rem',
              fontSize: '0.9rem',
              marginRight: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              Rating: {movie.vote_average?.toFixed(1)} ⭐
            </span>

            <span style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: 'var(--secondary)',
              color: 'white',
              borderRadius: '2rem',
              fontSize: '0.9rem',
              marginRight: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              {movie.first_air_date?.split('-')[0]}
            </span>
          </div>

          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '0.5rem'
          }}>Overview</h3>

          <p style={{
            fontSize: '1.1rem',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>{movie.overview}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail2;
