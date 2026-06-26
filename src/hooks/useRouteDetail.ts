import { useQuery } from '@tanstack/react-query';
import { getRouteById } from '../api/routeService';
import { Route } from '../types';

export const useRouteDetail = (routeId: string | null) => {
  return useQuery<Route, Error>({
    queryKey: ['route', routeId],
    queryFn: () => {
      if (!routeId) throw new Error('No route ID');
      return getRouteById(routeId);
    },
    enabled: !!routeId,
  });
};
