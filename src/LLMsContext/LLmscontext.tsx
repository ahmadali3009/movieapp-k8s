import axios from "axios";
import { createContext, useState } from "react";

// Define the structure of a movie suggestion
interface MovieSuggestion {
  title: string;
  reason: string;
  poster_path?: string;
  id?: number;
  is_tv?: boolean;
  no_results?: boolean;
}

interface LLMsContextType {
  responsesuggestion: MovieSuggestion[] | null;
  isLoading: boolean;
  error: string | null;
  LLMssugetion: (inputque: string) => Promise<void>;
}

export const LLMsContext = createContext<LLMsContextType | null>(null);

// Add a function to fetch movie details from TMDB with alternative fallback
const fetchMovieDetails = async (title: string): Promise<Partial<MovieSuggestion>> => {
  try {
    // First try TMDB
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=2548a82cdbcc3c2703fceec99fee278e&query=${encodeURIComponent(title)}&page=1`
    );
    
    if (response.data.results && response.data.results.length > 0) {
      const movie = response.data.results[0]; // Get the first (most relevant) result
      return {
        poster_path: movie.poster_path,
        id: movie.id
      };
    }
    
    // If no movie results, try TMDB TV show search as fallback
    console.log(`No movie results from TMDB for "${title}", trying TV shows...`);
    const tvResponse = await axios.get(
      `https://api.themoviedb.org/3/search/tv?api_key=2548a82cdbcc3c2703fceec99fee278e&query=${encodeURIComponent(title)}&page=1`
    );
    
    if (tvResponse.data.results && tvResponse.data.results.length > 0) {
      const show = tvResponse.data.results[0];
      return {
        poster_path: show.poster_path,
        id: show.id,
        is_tv: true
      };
    }
    
    // If both TMDB searches fail, try a generic placeholder
    console.log(`No results from TMDB for "${title}"`);
    
    // Return empty object if all attempts fail
    return {
      title: title, // Keep the original title
      no_results: true
    };
  } catch (error) {
    console.error(`Error fetching details for ${title}:`, error);
    return {
      title: title,
      no_results: true
    };
  }
};

export const LLMsProvider = ({ children }: any) => {
  const [responsesuggestion, setresponsesuggestion] = useState<MovieSuggestion[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Use relative URLs for Kubernetes (goes through nginx proxy)
  const apiUrl = (typeof window !== 'undefined' && window.env?.API_URL) 
    ? window.env.API_URL 
    : import.meta.env.VITE_API_URL || '';

  const LLMssugetion = async (inputque: string) => {
    if (!inputque.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log("inputque", inputque);

      const response = await axios.post(`${apiUrl}/api/gemini` , {inputque});

      // console.log('Response from server:', response);

      // Extract the text content from Gemini's response
      const textContent = response.data;

      // Parse the JSON from the text response
      // First, try to find JSON in the response (it might be wrapped in markdown code blocks)
      const jsonMatch = textContent.match(/```json\n([\s\S]*?)\n```/) ||
                        textContent.match(/```\n([\s\S]*?)\n```/) ||
                        [null, textContent];

      const jsonString = jsonMatch[1];
      console.log("finaljson", jsonString);
      try {
        // Parse the JSON string into an array of movie suggestions
        const suggestions = JSON.parse(jsonString);

        if (Array.isArray(suggestions)) {
          // Fetch movie details for each suggestion
          const enhancedSuggestions = await Promise.all(
            suggestions.map(async (suggestion) => {
              const details = await fetchMovieDetails(suggestion.title);
              return { ...suggestion, ...details };
            })
          );
          
          setresponsesuggestion(enhancedSuggestions);
        } else {
          throw new Error("Response is not an array");
        }
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        setError("Failed to parse LLM response");
        setresponsesuggestion(null);
      }
    } catch (error: any) {
      console.error('Error fetching response:', error);
      setError(error.message || "Failed to get suggestions");
      setresponsesuggestion(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LLMsContext.Provider value={{ responsesuggestion, isLoading, error, LLMssugetion }}>
      {children}
    </LLMsContext.Provider>
  );
};
