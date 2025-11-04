import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import axiosInstance from './axiosinstance/Axiosinstance';

const Moviedetail = () => {
    let { id } = useParams();
    let Fmoviesbyid = async () => {
        const response = await axiosInstance.get(`https://api.themoviedb.org/3/movie/${id}?api_key=2548a82cdbcc3c2703fceec99fee278e`);
        return response.data;
    }    // Fetch movie details
    const { data, error, isLoading} = useQuery({
        queryKey: ['movies', id], // Use searchTerm as key
        queryFn: Fmoviesbyid,
        enabled: !!id, // Disable automatic fetching
      });
    console.log(data)
    if (isLoading) return (
      <div className="loading">
        <div className="loader"></div>
        <p>Loading movie details...</p>
      </div>
    );

    if (error) return (
      <div className="loading">
        <div className="loader" style={{ borderTopColor: 'red', borderBottomColor: 'red' }}></div>
        <p>Error loading movie details: {error.message}</p>
      </div>
    );

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
                        src={data?.poster_path
                            ? `https://image.tmdb.org/t/p/w500${data?.poster_path}`
                            : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg'}
                        alt={data?.title}
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
                    }}>{data?.title}</h1>

                    {data?.tagline && (
                        <p style={{
                            fontSize: '1.25rem',
                            fontStyle: 'italic',
                            marginBottom: '1.5rem',
                            opacity: 0.8
                        }}>"{data.tagline}"</p>
                    )}

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
                            Rating: {data?.vote_average?.toFixed(1)} ⭐
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
                            {data?.release_date?.split('-')[0]}
                        </span>

                        {data?.runtime && (
                            <span style={{
                                display: 'inline-block',
                                padding: '0.5rem 1rem',
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                borderRadius: '2rem',
                                fontSize: '0.9rem',
                                marginRight: '0.5rem',
                                marginBottom: '0.5rem'
                            }}>
                                {Math.floor(data.runtime / 60)}h {data.runtime % 60}m
                            </span>
                        )}
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
                    }}>{data?.overview}</p>

                    {data?.genres && data.genres.length > 0 && (
                        <div>
                            <h3 style={{
                                fontSize: '1.25rem',
                                marginBottom: '0.75rem'
                            }}>Genres</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {data.genres.map((genre: any) => (
                                    <span key={genre.id} style={{
                                        padding: '0.4rem 0.8rem',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: '0.5rem',
                                        fontSize: '0.9rem'
                                    }}>
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Moviedetail;
