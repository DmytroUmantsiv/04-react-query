import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import SearchBar from '../SearchBar/SearchBar'
import MovieGrid from '../MovieGrid/MovieGrid'
import Loader from '../Loader/Loader'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import MovieModal from '../MovieModal/MovieModal'
import ReactPaginate from 'react-paginate'
import styles from './App.module.css'

import { useQuery } from '@tanstack/react-query'
import { fetchMovies } from '../../services/movieService'
import type { Movie } from '../../types/movie'

export default function App() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Movie | null>(null)

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
  })

  function handleSearch(newQuery: string) {
    setQuery(newQuery)
    setPage(1)
  }

  function handleSelect(movie: Movie) {
    setSelected(movie)
  }

  function closeModal() {
    setSelected(null)
  }

  const movies = data?.results ?? []
  const totalPages = data?.total_pages ?? 0

  return (
    <div>
      <SearchBar onSubmit={handleSearch} />
      <main>
        <Toaster position="top-center" />

        {isLoading && <Loader />}
        {isError && !isLoading && <ErrorMessage />}
        {!isLoading && !isError && <MovieGrid movies={movies} onSelect={handleSelect} />}

        {}
        {totalPages > 1 && (
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName={styles.pagination}
            activeClassName={styles.active}
            nextLabel="→"
            previousLabel="←"
          />
        )}

        {selected && <MovieModal movie={selected} onClose={closeModal} />}
      </main>
    </div>
  )
}
