import {
  VehicleResource,
  Vehicle,
  RouteResource,
  Route,
  TripResource,
  Trip,
} from '../types';

/**
 * Memetakan data mentah VehicleResource dari API ke format domain Vehicle.
 *
 * @param resource Data mentah VehicleResource dari JSON:API
 * @returns Format domain Vehicle yang telah diratakan (flat)
 */
export function mapVehicleResourceToVehicle(resource: VehicleResource): Vehicle {
  const attrs = resource.attributes || {};
  const rels = resource.relationships || {};

  return {
    id: resource.id,
    label: attrs.label ?? null,
    status: attrs.current_status ?? null,
    latitude: attrs.latitude ?? null,
    longitude: attrs.longitude ?? null,
    updatedAt: attrs.updated_at ?? null,
    bearing: attrs.bearing ?? null,
    speed: attrs.speed ?? null,
    routeId: rels.route?.data?.id ?? null,
    tripId: rels.trip?.data?.id ?? null,
  };
}

/**
 * Memetakan data mentah RouteResource dari API ke format domain Route.
 *
 * @param resource Data mentah RouteResource dari JSON:API
 * @returns Format domain Route yang telah diratakan (flat)
 */
export function mapRouteResourceToRoute(resource: RouteResource): Route {
  const attrs = resource.attributes || {};

  return {
    id: resource.id,
    longName: attrs.long_name ?? null,
    shortName: attrs.short_name ?? null,
    type: attrs.type ?? null,
    color: attrs.color ?? null,
  };
}

/**
 * Memetakan data mentah TripResource dari API ke format domain Trip.
 *
 * @param resource Data mentah TripResource dari JSON:API
 * @returns Format domain Trip yang telah diratakan (flat)
 */
export function mapTripResourceToTrip(resource: TripResource): Trip {
  const attrs = resource.attributes || {};
  const rels = resource.relationships || {};

  return {
    id: resource.id,
    headsign: attrs.headsign ?? null,
    name: attrs.name ?? null,
    directionId: attrs.direction_id ?? null,
    routeId: rels.route?.data?.id ?? null,
  };
}
