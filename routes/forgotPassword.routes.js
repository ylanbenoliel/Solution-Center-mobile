import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import NewPassword from '@screens/Password/NewPassword';
import SendEmail from '@screens/Password/SendEmail';
import VerifyCode from '@screens/Password/VerifyCode';

// import colors from '@constants/colors';

const Stack = createStackNavigator();

// const screenOptions = {
//   headerStyle: {
//     backgroundColor: colors.whiteColor,
//   },
//   headerTintColor: `${colors.disableColor}`,
//   headerTitleStyle: {
//     fontWeight: 'bold',
//   },
// };
export default function ForgotPasswordStack() {
  return (
    <Stack.Navigator
      headerMode="none"
      // screenOptions={screenOptions}
    >
      <Stack.Screen name="SendEmail" component={SendEmail} />
      <Stack.Screen name="VerifyCode" component={VerifyCode} />
      <Stack.Screen name="NewPassword" component={NewPassword} />
    </Stack.Navigator>
  );
}
