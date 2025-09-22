import { apiClient } from './client';
import { Genre } from '@/types';

export const genresApi = {
  // Get all available movie genres
  getGenres: async (): Promise<Genre[]> => {
    return apiClient.get<Genre[]>('/genres');
  },
};
