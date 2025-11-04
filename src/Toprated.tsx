import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import MovieCard from './components/MovieCard';
import axiosInstance from './axiosinstance/Axiosinstance';

const Toprated = () => {
  const [page, setPage] = useState(1);
  const totalPages = 103; // Example: Setting total pages to 10 for now. Adjust according to the API data if it provides total pages.

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
 let token = localStorage.getItem("token");
console.log("token toprated", token);

if (token) {
  try {
    const decodedToken = jwtDecode<{ exp?: number }>(token);
    console.log("decodedToken", decodedToken);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp && decodedToken.exp < currentTime) {
      console.warn("Token expired, will attempt refresh via Axios interceptor");
      // ❌ Don't remove token or redirect here
      // ✅ Let interceptor do the refresh
    }
  } catch (error) {
    console.error("Invalid token format", error);
    localStorage.removeItem("token");
    window.location.href = "/login"; // Only for truly invalid token
  }
}
  const FetchTopRated = async () => {
    // Get API URL from environment variable or use localhost as fallback
    // const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const data = await axiosInstance.get(`/api/top-detail?page=${page}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return data;
  };

  const { data, error, isLoading } = useQuery<any, Error>({
    queryKey: ['toprated', page],
    queryFn: FetchTopRated,
    // keepPreviousData: true, // Keeps data of the previous page while fetching the next
  });

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loader"></div>
        <p>Loading top rated shows...</p>
        <div className="skeleton-container">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="skeleton-loader"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="loading">Error loading movies: {error.message}</div>;
  }
  console.log(data)
  return (
    <section className="app-container">
      <h2 className="results-title">Top Rated TV Shows</h2>

      <div className="movie-scroll">
        {data && data.data.results.map((movie:any) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            linkPath={"/top-detail"}
            state={{movie}}
          />
        ))}
      </div>

      <div className="pagination">
        <h2>Page {page} of {totalPages}</h2>
        <div>
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            style={{ marginLeft: '1rem' }}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default Toprated;
