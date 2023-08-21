import axios, { type AxiosInstance } from 'axios'

const fetcher = axios.create()

/**
 * Create a fetcher for client use
 */
export function useFetcher (): AxiosInstance {
  return fetcher
}
