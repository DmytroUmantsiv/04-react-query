import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import SearchBar from "../SearchBar/SearchBar"
import MovieGrid from "../MovieGrid/MovieGrid"
import Loader from "../Loader/Loader"
import ErrorMessage from "../ErrorMessage/ErrorMessage"
import MovieModal from "../MovieModal/MovieModal"
import type { Movie } from "../../types/movie"
import { fetchMovies } from "../../services/movieService"

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Movie | null>(null)

  async function handleSearch(query: string) {
    
    setError(null)
    setMovies([])
    setLoading(true)

    try {
      const data = await fetchMovies(query)
      

      if (!data.results || data.results.length === 0) {
        toast("No movies found for your request.")
      } else {
        setMovies(data.results)
      }
    } catch (err) {
      console.error("❌ Error in handleSearch:", err)
      setError("Error")
      toast.error("There was an error fetching movies.")
    } finally {
      setLoading(false)
    }
  }

  function handleSelect(movie: Movie) {
    setSelected(movie)
  }

  function closeModal() {
    setSelected(null)
  }

  return (
    <div>
      <SearchBar onSubmit={handleSearch} />
      <main>
        <Toaster position="top-center" />
        {loading && <Loader />}
        {error && !loading && <ErrorMessage />}
        {!loading && !error && <MovieGrid movies={movies} onSelect={handleSelect} />}
        {selected && <MovieModal movie={selected} onClose={closeModal} />}
      </main>
    </div>
  )
}
