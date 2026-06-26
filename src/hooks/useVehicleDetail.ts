import { useQuery } from '@tanstack/react-query';
import { getVehicleById } from '../api/vehicleService';
import { Vehicle } from '../types';

export const useVehicleDetail = (vehicleId: string) => {
  return useQuery<Vehicle, Error>({
    queryKey: ['vehicle', vehicleId],
    queryFn: () => getVehicleById(vehicleId),
  });
};
