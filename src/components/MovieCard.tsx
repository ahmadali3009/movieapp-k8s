import { Link } from 'react-router-dom';

interface MovieCardProps {
  movie: {
    id: number;
    poster_path: string;
    title?: string;
    original_title?: string;
    name?: string;
    vote_average: number;
  };
  linkPath: string;
  state?: any;
}

const MovieCard = ({ movie, linkPath, state }: MovieCardProps) => {
  // Determine which title to use (movies have title/original_title, TV shows have name)
  const title = movie.title || movie.original_title || movie.name || 'Unknown Title';

  return (
    <Link to={linkPath} state={state}>
      <div className="movie-card">
        <div className="movie-rating-badge">{movie.vote_average?.toFixed(1)}</div>
        <img
          src={movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg'}
          alt={`${title} poster`}
        />
        <div className="movie-card-overlay">
          <button className="view-details-btn">View Details</button>
        </div>
        <h1>{title}</h1>
      </div>
    </Link>
  );
};

export default MovieCard;
