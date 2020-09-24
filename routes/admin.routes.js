import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Info from '@components/Info';

import AdminAddEvent from '@screens/AdminAddEvent';
import AdminAddUserToEvent from '@screens/AdminAddUserToEvent';
import AdminEditEvent from '@screens/AdminEditEvent';
import AdminPayment from '@screens/AdminPayment';
import AdminProfile from '@screens/AdminProfile';
import AdminUserList from '@screens/AdminUserList';
import Agenda from '@screens/Agenda';
import AgendaTable from '@screens/AgendaTable';
import Notifications from '@screens/Notifications';
import UserEventsDetails from '@screens/UserEventsDetails';

import colors from '@constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AgendaStack() {
  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.mainColor,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Calendar" component={Agenda} options={{ headerShown: false, title: 'Calendário' }} />
      <Stack.Screen name="AgendaTable" component={AgendaTable} options={{ title: 'Agenda' }} />
      <Stack.Screen name="AddUser" component={AdminAddUserToEvent} options={{ title: 'Selecionar usuário' }} />
    </Stack.Navigator>
  );
}

function AdminInfoStack() {
  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.mainColor,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="UserProfile" component={AdminProfile} options={{ headerShown: false }} />
      <Stack.Screen name="Info" component={Info} options={{ title: 'Perfil' }} />
    </Stack.Navigator>
  );
}

function UserStack() {
  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.mainColor,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Usuários" component={AdminUserList} options={{ headerShown: false }} />
      <Stack.Screen name="Eventos" component={UserEventsDetails} options={{ title: 'Horários' }} />
      <Stack.Screen name="Adicionar" component={AdminAddEvent} options={{ title: 'Adicionar reserva' }} />
      <Stack.Screen name="Editar" component={AdminEditEvent} options={{ title: 'Editar reserva' }} />
      <Stack.Screen name="Pagamentos" component={AdminPayment} options={{ title: 'Horários não pagos' }} />
    </Stack.Navigator>
  );
}

export default function Admin() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // eslint-disable-next-line react/prop-types
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Calendar') {
            iconName = 'calendar';
          }
          if (route.name === 'Usuários') {
            iconName = 'users';
          }
          if (route.name === 'Notificações') {
            iconName = 'bell';
          }
          if (route.name === 'Perfil') {
            iconName = 'user';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: colors.navigationColor,
        inactiveTintColor: colors.disableColor,
        keyboardHidesTabBar: true,
      }}
    >
      <Tab.Screen name="Calendar" component={AgendaStack} options={{ title: 'Calendário' }} />
      <Tab.Screen name="Usuários" component={UserStack} />
      <Tab.Screen name="Notificações" component={Notifications} />
      <Tab.Screen name="Perfil" component={AdminInfoStack} />
    </Tab.Navigator>
  );
}
