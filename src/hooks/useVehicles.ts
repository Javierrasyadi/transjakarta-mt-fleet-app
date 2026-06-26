import { useInfiniteQuery } from '@tanstack/react-query';
import { getVehicles } from '../api/vehicleService';

interface UseVehiclesProps {
  routeIds?: string[];
  tripIds?: string[];
}

export const useVehicles = ({ routeIds, tripIds }: UseVehiclesProps = {}) => {
  return useInfiniteQuery({
    queryKey: ['vehicles', routeIds, tripIds],
    queryFn: ({ pageParam = 0 }) =>
      getVehicles({
        pageOffset: pageParam,
        pageLimit: 10,
        routeIds,
        tripIds,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length < 10) {
        return undefined;
      }
      return lastPageParam + 10;
    },
  });
};
