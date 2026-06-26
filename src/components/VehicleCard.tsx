import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Vehicle, VehicleStatus } from '../types';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const getStatusColor = (status: VehicleStatus | null) => {
  switch (status) {
    case 'INCOMING_AT':
      return '#f59e0b'; // Amber
    case 'STOPPED_AT':
      return '#ef4444'; // Red
    case 'IN_TRANSIT_TO':
      return '#3b82f6'; // Blue
    default:
      return '#9ca3af'; // Gray
  }
};

const getStatusText = (status: VehicleStatus | null) => {
  switch (status) {
    case 'INCOMING_AT':
      return 'Incoming';
    case 'STOPPED_AT':
      return 'Stopped';
    case 'IN_TRANSIT_TO':
      return 'In Transit';
    default:
      return 'Unknown';
  }
};

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const statusColor = getStatusColor(vehicle.status);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{vehicle.label || `Vehicle ${vehicle.id}`}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={styles.statusText}>{getStatusText(vehicle.status)}</Text>
        </View>
      </View>
      <View style={styles.details}>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Route: </Text>
          {vehicle.routeId || 'N/A'}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Trip: </Text>
          {vehicle.tripId || 'N/A'}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Updated: </Text>
          {vehicle.updatedAt ? new Date(vehicle.updatedAt).toLocaleTimeString() : 'N/A'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  details: {
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
  },
  label: {
    fontWeight: '600',
    color: '#6b7280',
  },
});
