import { useQuery } from '@tanstack/react-query';
import { getTripById } from '../api/tripService';
import { Trip } from '../types';

export const useTripDetail = (tripId: string | null) => {
  return useQuery<Trip, Error>({
    queryKey: ['trip', tripId],
    queryFn: () => {
      if (!tripId) throw new Error('No trip ID');
      return getTripById(tripId);
    },
    enabled: !!tripId,
  });
};
