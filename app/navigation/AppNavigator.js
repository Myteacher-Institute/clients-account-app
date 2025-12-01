import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import KYCScreen from '@/screens/auth/KYCScreen';
import OTPScreen from '@/screens/auth/OTPScreen';
import DashboardNavigator from './DashboardNavigator';
import Verification from '@/screens/auth/Verification';
import SigninScreen from '@/screens/auth/SigninScreen';
import CreateAccount from '@/screens/auth/CreateAccount';
import SplashScreen from '@/screens/splashscreen/SplashScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, fetchUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      console.log('[AppNavigator] Initializing app...');
      try {
        if (!user) {
          console.log('[AppNavigator] No user → fetching user');
          await fetchUser();
        } else {
          console.log('[AppNavigator] User already present:', user.email);
        }
      } catch (err) {
        console.warn('[AppNavigator] fetchUser() failed:', err);
      } finally {
        if (isMounted) { setLoading(false); }
      }
    };

    init();

    return () => {
      isMounted = false;
      console.log('[AppNavigator] 💀 Unmounted');
    };
  }, [user, fetchUser]);

  if (loading) { return null; }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={user ? 'Dashboard' : 'SplashScreen'}>
        <Stack.Screen name="KYCScreen" component={KYCScreen} />
        <Stack.Screen name="OTPScreen" component={OTPScreen} />
        <Stack.Screen name="SigninScreen" component={SigninScreen} />
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Verification" component={Verification} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        {user && <Stack.Screen name="Dashboard" component={DashboardNavigator} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
