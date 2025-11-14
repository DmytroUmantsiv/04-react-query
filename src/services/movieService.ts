import axios from "axios"
import type { AxiosResponse } from "axios"
import type { Movie } from '../types/movie'


export interface TMDBSearchResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

const BASE_URL = "https://api.themoviedb.org/3"
const token = import.meta.env.VITE_TMDB_TOKEN as string | undefined

if (!token) {
  console.warn("VITE_TMDB_TOKEN is not set. API requests will fail.")
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
    Accept: "application/json",
  },
})

export async function fetchMovies(query: string): Promise<TMDBSearchResponse> {
 
  const config = {
    params: {
      query,
      include_adult: false,
      language: "en-US",
      page: 1,
    },
  }

  try {
    const response: AxiosResponse<TMDBSearchResponse> = await axiosInstance.get(
      "/search/movie",
      config
    )
    
    return response.data
  } catch (error) {
    console.error("Error fetching movies:", error)
    throw error
  }
}

export function getImageUrl(path: string | null, size: "w500" | "original" = "w500") {
  if (!path) return ""
  return `https://image.tmdb.org/t/p/${size}${path}`
}
