import { apiClient } from './apiClient';
import { mapRouteResourceToRoute } from './mappers';
import { Route, RouteResource, JsonApiCollectionResponse, JsonApiResponse } from '../types';

/**
 * Mengambil daftar rute transit (routes) dari MBTA API.
 *
 * @returns Promise berisi array model domain Route[]
 */
export async function getRoutes(): Promise<Route[]> {
  try {
    const response = await apiClient.get<JsonApiCollectionResponse<RouteResource>>(
      '/routes'
    );
    return response.data.data.map(mapRouteResourceToRoute);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Gagal mengambil data rute: ${message}`);
  }
}

/**
 * Mengambil informasi detail satu rute berdasarkan ID rute.
 *
 * @param id ID rute yang ingin diambil detailnya
 * @returns Promise berisi data domain Route
 */
export async function getRouteById(id: string): Promise<Route> {
  try {
    const response = await apiClient.get<JsonApiResponse<RouteResource>>(
      `/routes/${id}`
    );
    return mapRouteResourceToRoute(response.data.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Gagal mengambil detail rute dengan ID ${id}: ${message}`);
  }
}
