import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import './App.css'
import { useQuery } from '@tanstack/react-query'
import Toprated from './Toprated'
import HeroBanner from './components/HeroBanner'
import MovieCard from './components/MovieCard'
import Navbar from './components/Navbar'
import { LLMsContext } from './LLMsContext/LLmscontext.tsx';
import axiosInstance from './axiosinstance/Axiosinstance.ts'
export interface Movie {
  id: number;
  poster_path: string;
  original_title: string;
  title: string;
  vote_average: number;
  release_date: string;
  popularity: number;
  overview: string;
  backdrop_path: string;
}
function App() {
  let [page, setpage] = useState(1)
  let [search, setsearch] = useState("")
  let [searchTerm, setsearchTerm] = useState("")
  let llms = useContext(LLMsContext)
 
  let searchFetch = async () => {
    let searchdata = await axiosInstance.get(`https://api.themoviedb.org/3/search/movie?api_key=2548a82cdbcc3c2703fceec99fee278e&query=${searchTerm}`)
    console.log("searchdata", searchdata)
    return searchdata
  }
  let searchbuttton = () => {
    setsearchTerm(search)
    llms?.LLMssugetion(search)
    // refetch();

  }


  // let handlesearch = (value: string) => {
  //   console.log("value", value)
  //   setsearch(value)

  // }
  let handlepage = () => {
    let nextpage = data?.data.page + 1
    setpage(nextpage)
    console.log(nextpage)
  }
  let handlepreviouspage = () => {
    let nextpage = data?.data.page - 1
    setpage(nextpage)
    console.log(nextpage)
  }
  let returndata = async () => {
    let data = await axiosInstance.get(`https://api.themoviedb.org/3/discover/movie?api_key=2548a82cdbcc3c2703fceec99fee278e&page=${page}`)
    return data
  }

  const { data: data, error: dataerror, isLoading: dataisloading } = useQuery({
    queryKey: ['movies', page],
    queryFn: returndata,
  });
  const { data: searchData, error: searchError, isLoading: searchIsLoading, refetch } = useQuery({
    queryKey: ['search', searchTerm], // Use searchTerm as key
    queryFn: searchFetch,
    enabled: !!searchTerm, // Disable automatic fetching
  });
  useEffect(() => {
    if (searchTerm) {
      console.log("suggestioon form llms", llms?.responsesuggestion)
      refetch(); // Call refetch only when searchTerm is updated
    }
  }, [searchTerm, refetch]); // Dependency array ensures refetch runs only when searchTerm changes


  if (dataisloading) {
    return (
      <div className="loading">
        <div className="loader"></div>
        <p>Loading movies...</p>
        <div className="skeleton-container">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="skeleton-loader"></div>
          ))}
        </div>
      </div>
    );
  }

  if (dataerror) {
    return <div className="loading">Error loading movies: {dataerror.message}</div>;
  }

  if (searchIsLoading) {
    return (
      <div className="loading">
        <div className="loader"></div>
        <p>Loading search results...</p>
      </div>
    );
  }

  if (searchError) {
    return <div className="loading">Error loading search results: {searchError.message}</div>;
  }


  // Get featured movies from the data if available
  const featuredMovies = data?.data.results ? data.data.results.slice(0, 5) : [];

  return (
    <div className="app-container">
      {/* Navbar */}
      <Navbar />

      {/* Hero Banner */}
      <HeroBanner movies={featuredMovies} interval={5000} />

      {/* Search Section */}
      <div className="flex flex-col w-full max-w-3xl mx-auto">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for movies or ask for recommendations..."
            onChange={(e) => setsearch(e.target.value)}
            value={search}
            onKeyPress={(e) => e.key === 'Enter' && searchbuttton()}
          />
          <button onClick={searchbuttton}>
            Search
          </button>
        </div>
        <p className="text-xs text-white/60 mt-2 text-center">
          Try: "action movies with plot twists" or "feel-good comedies from the 90s"
        </p>
      </div>

      {/* LLM Suggestions Section */}
      {llms?.isLoading && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-left relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-4/5 before:bg-gradient-to-r before:from-indigo-500 before:to-pink-500 before:rounded">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AI</span> Powered Recommendations
          </h2>
          <div className="ai-recommendation-skeleton">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="ai-recommendation-card-skeleton">
                <div className="ai-recommendation-poster-skeleton"></div>
                <div className="ai-recommendation-content-skeleton">
                  <div className="ai-recommendation-title-skeleton"></div>
                  <div className="ai-recommendation-reason-skeleton" style={{ width: '100%' }}></div>
                  <div className="ai-recommendation-reason-skeleton" style={{ width: '90%' }}></div>
                  <div className="ai-recommendation-reason-skeleton" style={{ width: '95%' }}></div>
                  <div className="ai-recommendation-reason-skeleton" style={{ width: '85%' }}></div>
                </div>
                <div className="ai-recommendation-button-skeleton"></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {llms?.error && (
        <div className="error-message">
          <p>Error getting AI suggestions: {llms.error}</p>
        </div>
      )}

      {llms?.responsesuggestion && llms.responsesuggestion.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-left relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-4/5 before:bg-gradient-to-r before:from-indigo-500 before:to-pink-500 before:rounded">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AI</span> Powered Recommendations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
            {llms.responsesuggestion.map((suggestion, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur rounded-xl border border-white/10 overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
                <div className="w-full h-60 overflow-hidden">
                  {suggestion.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${suggestion.poster_path}`}
                      alt={`${suggestion.title} poster`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-700">
                      <span className="text-slate-400">No poster available</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="text-xl font-semibold mb-2 text-pink-500">{suggestion.title}</h3>
                  <p className="text-sm text-white/80 mb-4">{suggestion.reason}</p>
                </div>
                {suggestion.id ? (
                  <Link
                    to={suggestion.is_tv ? `/tv/${suggestion.id}` : `/${suggestion.id}`}
                    className="block w-full py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-center font-semibold transition-opacity hover:opacity-90"
                  >
                    View Details
                  </Link>
                ) : (
                  <button
                    className="block w-full py-3 bg-gray-600 text-white/70 text-center font-semibold cursor-not-allowed"
                    disabled
                  >
                    No Details Available
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Search Results Section */}
      {searchData?.data.results && searchData.data.results.length > 0 && (
        <section>
          <h2 className="results-title">Search Results</h2>
          <div className="movie-scroll">
            {searchData.data.results.map((movie: Movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                linkPath={`/${movie.id}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Movie List Section */}
      <section>
        <h2 className="results-title">Popular Movies</h2>
        <div className="movie-scroll">
          {data && data.data.results.map((movie: Movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              linkPath={`/${movie.id}`}
            />
          ))}
        </div>


        {/* Pagination controls */}
        <div className="pagination">
          <h2>Page: {page}</h2>
          <div>
            <button
              onClick={handlepreviouspage}
              disabled={page <= 1}
            >
              Previous
            </button>
            <button
              onClick={handlepage}
              style={{ marginLeft: '1rem' }}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Top Rated Section */}
      <Toprated />

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About CineVerse AI</h3>
            <p>CineVerse AI is your intelligent movie discovery platform. Our advanced AI analyzes your preferences to recommend films and shows tailored just for you. Explore our vast universe of titles powered by cutting-edge artificial intelligence.</p>
            <div className="social-icons">
              <a href="#" className="social-icon">FB</a>
              <a href="#" className="social-icon">TW</a>
              <a href="#" className="social-icon">IG</a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Movies</a></li>
              <li><a href="#">TV Shows</a></li>
              <li><a href="#">Top Rated</a></li>
              <li><a href="#">Coming Soon</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Us</h3>
            <ul>
              <li>Email: info@movieapp.com</li>
              <li>Phone: +1 (123) 456-7890</li>
              <li>Address: xyz Movie Street, Hollywood, CA</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CineVerse AI. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating Action Button */}
      <button
        className="floating-action-button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Back to top"
      >
        ↑
      </button>
    </div>
  )
}

export default App
