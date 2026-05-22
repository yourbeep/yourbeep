import { PropsWithChildren, useEffect } from 'react';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  useFonts,
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { Provider as ReduxProvider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthSessionBootstrap } from '@/features/auth/components/auth-session-bootstrap';
import { AwarenessFlowProvider } from '@/features/awareness/context/awareness-flow-context';
import { AppInitializer } from '@/components/app-initializer';
import { useAppTheme } from '@/theme/use-app-theme';
import { store } from '@/store/store';

void SplashScreen.preventAutoHideAsync();

function ProviderContent({ children }: PropsWithChildren) {
  const { colors } = useAppTheme();

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  return (
    <SafeAreaProvider>
      <AuthSessionBootstrap>
        <AppInitializer />
        <AwarenessFlowProvider>{children}</AwarenessFlowProvider>
      </AuthSessionBootstrap>
    </SafeAreaProvider>
  );
}

export function AppProviders({ children }: PropsWithChildren) {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <ProviderContent>{children}</ProviderContent>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}
