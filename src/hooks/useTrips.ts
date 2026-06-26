import { useQuery } from '@tanstack/react-query';
import { getTrips } from '../api/tripService';
import { Trip } from '../types';

export const useTrips = (routeIds: string[]) => {
  return useQuery<Trip[], Error>({
    queryKey: ['trips', routeIds],
    queryFn: async () => {
      if (!routeIds || routeIds.length === 0) return [];
      const promises = routeIds.map(routeId => getTrips({ routeId }));
      const results = await Promise.all(promises);
      
      const allTrips = results.flat();
      const uniqueTripsMap = new Map<string, Trip>();
      allTrips.forEach(trip => uniqueTripsMap.set(trip.id, trip));
      return Array.from(uniqueTripsMap.values());
    },
    enabled: routeIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};
