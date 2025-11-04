import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  popularity: number;
}

interface HeroBannerProps {
  movies: Movie[];
  interval?: number; // Time in milliseconds between rotations
}

const HeroBanner = ({ movies, interval = 3000 }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!movies || movies.length === 0) return;

    // Set up the rotation interval
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
        setIsTransitioning(false);
      }, 500); // Half a second for the fade transition
    }, interval);

    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, [movies, interval]);

  if (!movies || movies.length === 0) return null;

  const movie = movies[currentIndex];
  if (!movie || !movie.backdrop_path) return null;

  return (
    <div className="hero-banner">
      <img
        className={`hero-banner-image ${isTransitioning ? 'fade-out' : 'fade-in'}`}
        src={movie.backdrop_path
          ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
          : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg'}
        alt={movie.title}
      />
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className={`hero-title ${isTransitioning ? 'fade-out' : 'fade-in'}`}>{movie.title}</h1>
        <p className={`hero-description ${isTransitioning ? 'fade-out' : 'fade-in'}`}>{movie.overview}</p>
        <div className={`hero-stats ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
          <div className="hero-stat">
            <span>⭐ {movie.vote_average.toFixed(1)}</span>
          </div>
          <div className="hero-stat">
            <span>🗓️ {movie.release_date.split('-')[0]}</span>
          </div>
          <div className="hero-stat">
            <span>👁️ {movie.popularity.toFixed(0)} views</span>
          </div>
        </div>
        <div style={{ marginTop: '1rem' }} className={isTransitioning ? 'fade-out' : 'fade-in'}>
          <Link to={`/${movie.id}`}>
            <button className="hero-button">
              View Details
            </button>
          </Link>
        </div>

        {/* Pagination dots */}
        <div className="hero-pagination">
          {movies.slice(0, Math.min(5, movies.length)).map((_, index) => (
            <span
              key={index}
              className={`hero-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsTransitioning(false);
                }, 500);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
