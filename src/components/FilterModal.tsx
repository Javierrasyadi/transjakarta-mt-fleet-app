import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRoutes } from '../hooks/useRoutes';
import { useTrips } from '../hooks/useTrips';
import { Route, Trip } from '../types';

import { LoadingIndicator } from './LoadingIndicator';
import { ErrorState } from './ErrorState';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedRouteIds: string[];
  selectedTripIds: string[];
  onApply: (routeIds: string[], tripIds: string[]) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  selectedRouteIds,
  selectedTripIds,
  onApply,
}) => {
  const [localRouteIds, setLocalRouteIds] = useState<string[]>([]);
  const [localTripIds, setLocalTripIds] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      setLocalRouteIds(selectedRouteIds);
      setLocalTripIds(selectedTripIds);
    }
  }, [visible, selectedRouteIds, selectedTripIds]);

  const {
    data: routes,
    isLoading: isLoadingRoutes,
    isError: isErrorRoutes,
    error: errorRoutes,
    refetch: refetchRoutes
  } = useRoutes();
  const {
    data: trips,
    isLoading: isLoadingTrips,
    isError: isErrorTrips,
    error: errorTrips,
    refetch: refetchTrips
  } = useTrips(localRouteIds);

  const toggleRoute = (id: string) => {
    setLocalRouteIds((prev) => {
      if (prev.includes(id)) {
        if (trips) {
          const tripsForRoute = trips.filter((t: Trip) => t.routeId === id).map((t: Trip) => t.id);
          setLocalTripIds(prevTrips => prevTrips.filter(tId => !tripsForRoute.includes(tId)));
        }
        return prev.filter((r) => r !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleTrip = (id: string) => {
    setLocalTripIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((t) => t !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleReset = () => {
    setLocalRouteIds([]);
    setLocalTripIds([]);
  };

  const handleApply = () => {
    onApply(localRouteIds, localTripIds);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filter</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Tutup</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>
            Filter Rute {localRouteIds.length > 0 ? `(${localRouteIds.length})` : ''}
          </Text>
          {isLoadingRoutes ? (
            <LoadingIndicator size="small" />
          ) : isErrorRoutes ? (
            <ErrorState message="Gagal memuat rute" onRetry={refetchRoutes} style={styles.sectionError} />
          ) : routes && routes.length > 0 ? (
            routes?.map((route: Route) => {
              const isSelected = localRouteIds.includes(route.id);
              return (
                <TouchableOpacity
                  key={route.id}
                  style={styles.checkItem}
                  onPress={() => toggleRoute(route.id)}
                >
                  <View style={[styles.checkBox, isSelected && styles.checkBoxSelected]}>
                    {isSelected && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                  <Text style={styles.checkText}>
                    {route.shortName ? `${route.shortName} - ` : ''}
                    {route.longName || route.id}
                  </Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={styles.emptyText}>Tidak ada rute yang tersedia</Text>
          )}

          <Text style={styles.sectionTitle}>
            Filter Trip {localTripIds.length > 0 ? `(${localTripIds.length})` : ''}
          </Text>
          {localRouteIds.length === 0 ? (
            <Text style={styles.emptyText}>Pilih rute terlebih dahulu</Text>
          ) : isLoadingTrips ? (
            <LoadingIndicator size="small" />
          ) : isErrorTrips ? (
            <ErrorState message="Gagal memuat trip" onRetry={refetchTrips} style={styles.sectionError} />
          ) : trips && trips.length > 0 ? (
            trips.map((trip: Trip) => {
              const isSelected = localTripIds.includes(trip.id);
              return (
                <TouchableOpacity
                  key={trip.id}
                  style={styles.checkItem}
                  onPress={() => toggleTrip(trip.id)}
                >
                  <View style={[styles.checkBox, isSelected && styles.checkBoxSelected]}>
                    {isSelected && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                  <Text style={styles.checkText}>
                    {trip.headsign || trip.name || trip.id}
                  </Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={styles.emptyText}>Tidak ada trip untuk rute terpilih</Text>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyText}>Terapkan</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
  },
  closeText: {
    color: '#3b82f6',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  checkBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBoxSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkMark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkText: {
    fontSize: 16,
    color: '#4b5563',
    flex: 1,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  resetButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 8,
    alignItems: 'center',
  },
  resetText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    marginLeft: 8,
    alignItems: 'center',
  },
  applyText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  sectionError: {
    padding: 8,
  }
});
