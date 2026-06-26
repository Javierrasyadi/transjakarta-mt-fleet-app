import { useQuery } from '@tanstack/react-query';
import { getRoutes } from '../api/routeService';
import { Route } from '../types';

export const useRoutes = () => {
  return useQuery<Route[], Error>({
    queryKey: ['routes'],
    queryFn: getRoutes,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
