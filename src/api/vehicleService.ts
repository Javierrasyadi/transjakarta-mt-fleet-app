import { apiClient } from './apiClient';
import { mapVehicleResourceToVehicle } from './mappers';
import {
  Vehicle,
  VehicleResource,
  JsonApiCollectionResponse,
  JsonApiResponse,
} from '../types';

/**
 * Mengambil daftar kendaraan (vehicles) dari MBTA API dengan parameter paginasi dan filter.
 *
 * @param params Parameter untuk paginasi (pageOffset, pageLimit) dan filter (routeIds, tripIds)
 * @returns Promise berisi array model domain Vehicle[]
 */
export async function getVehicles(params: {
  pageOffset?: number;
  pageLimit?: number;
  routeIds?: string[];
  tripIds?: string[];
}): Promise<Vehicle[]> {
  try {
    const queryParams: Record<string, string | number> = {};

    if (params.pageOffset !== undefined) {
      queryParams['page[offset]'] = params.pageOffset;
    }
    if (params.pageLimit !== undefined) {
      queryParams['page[limit]'] = params.pageLimit;
    }
    if (params.routeIds && params.routeIds.length > 0) {
      queryParams['filter[route]'] = params.routeIds.join(',');
    }
    if (params.tripIds && params.tripIds.length > 0) {
      queryParams['filter[trip]'] = params.tripIds.join(',');
    }

    const response = await apiClient.get<JsonApiCollectionResponse<VehicleResource>>(
      '/vehicles',
      { params: queryParams }
    );

    return response.data.data.map(mapVehicleResourceToVehicle);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Gagal mengambil data kendaraan: ${message}`);
  }
}

/**
 * Mengambil informasi detail satu kendaraan berdasarkan ID kendaraan.
 *
 * @param id ID kendaraan yang ingin diambil detailnya
 * @returns Promise berisi data domain Vehicle
 */
export async function getVehicleById(id: string): Promise<Vehicle> {
  try {
    const response = await apiClient.get<JsonApiResponse<VehicleResource>>(
      `/vehicles/${id}`
    );
    return mapVehicleResourceToVehicle(response.data.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Gagal mengambil detail kendaraan dengan ID ${id}: ${message}`);
  }
}
