// TypeScript types and interfaces for the TransjakartaMTFleetApp (MBTA API Integration)

// ============================================================================
// VEHICLE STATUS UNION
// ============================================================================
export type VehicleStatus = 'INCOMING_AT' | 'STOPPED_AT' | 'IN_TRANSIT_TO';

// ============================================================================
// RAW/DTO TYPES (JSON:API specification)
// ============================================================================

export interface RelationshipData {
  id: string;
  type: string;
}

export interface Relationship {
  data?: RelationshipData | null;
}

export interface VehicleResource {
  id: string;
  type: 'vehicle';
  attributes?: {
    label?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    current_status?: VehicleStatus | null;
    updated_at?: string | null;
    bearing?: number | null;
    speed?: number | null;
  };
  relationships?: {
    route?: Relationship;
    trip?: Relationship;
  };
}

export interface RouteResource {
  id: string;
  type: 'route';
  attributes?: {
    long_name?: string | null;
    short_name?: string | null;
    type?: number | null;
    color?: string | null;
  };
}

export interface TripResource {
  id: string;
  type: 'trip';
  attributes?: {
    headsign?: string | null;
    name?: string | null;
    direction_id?: number | null;
  };
  relationships?: {
    route?: Relationship;
  };
}

export interface JsonApiResponse<T> {
  data: T;
  included?: unknown[];
}

export interface JsonApiCollectionResponse<T> {
  data: T[];
  meta?: {
    [key: string]: unknown;
  };
  included?: unknown[];
}

// ============================================================================
// DOMAIN/UI TYPES (Flat structures for components/UI consumption)
// ============================================================================

export interface Vehicle {
  id: string;
  label: string | null;
  status: VehicleStatus | null;
  latitude: number | null;
  longitude: number | null;
  updatedAt: string | null;
  routeId: string | null;
  tripId: string | null;
  bearing: number | null;
  speed: number | null;
}

export interface Route {
  id: string;
  longName: string | null;
  shortName: string | null;
  type: number | null;
  color: string | null;
}

export interface Trip {
  id: string;
  headsign: string | null;
  name: string | null;
  directionId: number | null;
  routeId?: string | null;
}
