import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useVehicleDetail } from '../hooks/useVehicleDetail';
import { useRouteDetail } from '../hooks/useRouteDetail';
import { useTripDetail } from '../hooks/useTripDetail';
import { VehicleStatus } from '../types';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { ErrorState } from '../components/ErrorState';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleDetail'>;

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

const getDirectionText = (directionId: number | null) => {
  if (directionId === 0) return 'Outbound (0)';
  if (directionId === 1) return 'Inbound (1)';
  if (directionId !== null) return directionId.toString();
  return 'N/A';
};

export const VehicleDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { vehicleId } = route.params;

  const {
    data: vehicle,
    isLoading,
    isError,
    error,
    refetch,
  } = useVehicleDetail(vehicleId);

  const {
    data: routeData,
    isLoading: isLoadingRoute,
    isError: isErrorRoute,
    refetch: refetchRoute,
  } = useRouteDetail(vehicle?.routeId ?? null);
  
  const {
    data: tripData,
    isLoading: isLoadingTrip,
    isError: isErrorTrip,
    refetch: refetchTrip,
  } = useTripDetail(vehicle?.tripId ?? null);

  React.useLayoutEffect(() => {
    if (vehicle) {
      navigation.setOptions({
        title: vehicle.label || `Vehicle ${vehicle.id}`,
      });
    }
  }, [navigation, vehicle]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  if (isError || !vehicle) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ErrorState
          message={error instanceof Error ? error.message : 'Gagal memuat detail kendaraan.'}
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* SECTION: Informasi Kendaraan */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informasi Kendaraan</Text>
          <View style={styles.row}>
            <Text style={styles.label}>ID Kendaraan:</Text>
            <Text style={styles.value}>{vehicle.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Label:</Text>
            <Text style={styles.value}>{vehicle.label || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(vehicle.status) }]} />
              <Text style={styles.statusText}>{getStatusText(vehicle.status)}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Latitude:</Text>
            <Text style={styles.value}>{vehicle.latitude ?? 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Longitude:</Text>
            <Text style={styles.value}>{vehicle.longitude ?? 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Terakhir Diupdate:</Text>
            <Text style={styles.value}>
              {vehicle.updatedAt
                ? new Date(vehicle.updatedAt).toLocaleString('id-ID', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })
                : 'N/A'}
            </Text>
          </View>
        </View>

        {/* SECTION: Informasi Rute */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informasi Rute</Text>
          {isLoadingRoute ? (
            <LoadingIndicator size="small" style={styles.sectionLoading} />
          ) : !vehicle.routeId ? (
            <Text style={styles.emptyText}>Kendaraan ini tidak memiliki rute aktif</Text>
          ) : isErrorRoute ? (
            <ErrorState message="Gagal memuat rute" onRetry={refetchRoute} style={styles.sectionError} />
          ) : routeData ? (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>ID Rute:</Text>
                <Text style={styles.value}>{routeData.id}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Singkatan (Short Name):</Text>
                <Text style={styles.value}>{routeData.shortName || 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Nama Lengkap:</Text>
                <Text style={styles.value}>{routeData.longName || 'N/A'}</Text>
              </View>
            </>
          ) : (
            <Text style={styles.emptyText}>Rute tidak ditemukan</Text>
          )}
        </View>

        {/* SECTION: Informasi Trip */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informasi Trip</Text>
          {isLoadingTrip ? (
            <LoadingIndicator size="small" style={styles.sectionLoading} />
          ) : !vehicle.tripId ? (
            <Text style={styles.emptyText}>Kendaraan ini tidak memiliki trip aktif</Text>
          ) : isErrorTrip ? (
            <ErrorState message="Gagal memuat trip" onRetry={refetchTrip} style={styles.sectionError} />
          ) : tripData ? (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>ID Trip:</Text>
                <Text style={styles.value}>{tripData.id}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Headsign:</Text>
                <Text style={styles.value}>{tripData.headsign || 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Nama Trip:</Text>
                <Text style={styles.value}>{tripData.name || 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Arah (Direction):</Text>
                <Text style={styles.value}>{getDirectionText(tripData.directionId)}</Text>
              </View>
            </>
          ) : (
            <Text style={styles.emptyText}>Trip tidak ditemukan</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 20,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  label: {
    width: 130,
    fontWeight: '600',
    color: '#4b5563',
    fontSize: 14,
  },
  value: {
    flex: 1,
    color: '#1f2937',
    fontSize: 14,
  },
  statusContainer: {
    flex: 1,
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
  emptyText: {
    color: '#6b7280',
    fontStyle: 'italic',
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionLoading: {
    padding: 8,
  },
  sectionError: {
    padding: 8,
  },
});
