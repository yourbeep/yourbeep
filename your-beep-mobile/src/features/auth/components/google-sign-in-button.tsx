import { Alert } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { env, hasFirebaseClientConfig } from '@/lib/config/env';

interface GoogleSignInButtonProps {
  disabled?: boolean;
}

export function GoogleSignInButton({ disabled = false }: GoogleSignInButtonProps) {
  const hasAnyGoogleClientId = Boolean(
    env.googleAndroidClientId.trim() ||
      env.googleIosClientId.trim() ||
      env.googleWebClientId.trim(),
  );

  const handlePress = () => {
    if (!hasFirebaseClientConfig) {
      Alert.alert(
        'Firebase config missing',
        'The Firebase client configuration is missing in the mobile app env.',
      );
      return;
    }

    if (!hasAnyGoogleClientId) {
      Alert.alert(
        'Google sign-in is not set up yet',
        'This app still needs Google OAuth client IDs in its environment. You do not need to enter any ID yourself.',
      );
      return;
    }

    Alert.alert(
      'Google sign-in needs native setup',
      'Email/password login is live. Google sign-in needs a development build or native Expo setup before it can run safely on this app.',
    );
  };

  return (
    <AppButton
      disabled={disabled}
      label="Continue with Google"
      onPress={handlePress}
      variant="secondary"
    />
  );
}
