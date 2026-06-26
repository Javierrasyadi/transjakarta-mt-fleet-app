import { apiClient } from './apiClient';
import { mapTripResourceToTrip } from './mappers';
import { Trip, TripResource, JsonApiCollectionResponse, JsonApiResponse } from '../types';

/**
 * Mengambil daftar perjalanan (trips) dari MBTA API dengan filter rute opsional.
 *
 * @param params Parameter opsional untuk memfilter perjalanan berdasarkan routeId
 * @returns Promise berisi array model domain Trip[]
 */
export async function getTrips(params?: { routeId?: string }): Promise<Trip[]> {
  try {
    const queryParams: Record<string, string> = {};

    if (params?.routeId) {
      queryParams['filter[route]'] = params.routeId;
    }

    const response = await apiClient.get<JsonApiCollectionResponse<TripResource>>(
      '/trips',
      { params: queryParams }
    );

    return response.data.data.map(mapTripResourceToTrip);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Gagal mengambil data perjalanan: ${message}`);
  }
}

/**
 * Mengambil informasi detail satu perjalanan berdasarkan ID trip.
 *
 * @param id ID perjalanan yang ingin diambil detailnya
 * @returns Promise berisi data domain Trip
 */
export async function getTripById(id: string): Promise<Trip> {
  try {
    const response = await apiClient.get<JsonApiResponse<TripResource>>(
      `/trips/${id}`
    );
    return mapTripResourceToTrip(response.data.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Gagal mengambil detail perjalanan dengan ID ${id}: ${message}`);
  }
}
