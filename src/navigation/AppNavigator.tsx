import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VehicleListScreen } from '../screens/VehicleListScreen';
import { VehicleDetailScreen } from '../screens/VehicleDetailScreen';

export type RootStackParamList = {
  VehicleList: undefined;
  VehicleDetail: { vehicleId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="VehicleList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1E3A8A', // Sleek blue header
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="VehicleList"
          component={VehicleListScreen}
          options={{ title: 'Transjakarta MT Fleet' }}
        />
        <Stack.Screen
          name="VehicleDetail"
          component={VehicleDetailScreen}
          options={{ title: 'Detail Kendaraan' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
