import { useEffect, useState } from 'react';
import { Alert, Image, Modal, Platform, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ScreenShell } from '@/components/layout/screen-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { AppCheckbox } from '@/components/ui/app-checkbox';
import { AppInput } from '@/components/ui/app-input';
import { appImages } from '@/constants/images';
import { GoogleSignInButton } from '@/features/auth/components/google-sign-in-button';
import {
  createFirebaseEmailUser,
  hasFirebaseAuthClient,
  sendFirebasePasswordReset,
  signInWithFirebaseEmail,
  updateFirebasePassword,
} from '@/lib/firebase/client';
import { useAppSelector } from '@/store/hooks';

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const [hidePassword, setHidePassword] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [hideCurrentPassword, setHideCurrentPassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isAuthReady = useAppSelector((state) => state.auth.isReady);
  const authError = useAppSelector((state) => state.auth.error);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing details', 'Please enter your email and password first.');
      return false;
    }

    if (!agreeToTerms) {
      Alert.alert('Accept terms', 'Please agree to the terms and conditions to continue.');
      return false;
    }

    if (!hasFirebaseAuthClient) {
      Alert.alert(
        'Firebase config missing',
        'The Firebase client configuration is missing in the mobile app env.',
      );
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await signInWithFirebaseEmail(email, password);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Could not sign in with Firebase.';

      Alert.alert('Login failed', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createFirebaseEmailUser(email, password);
      Alert.alert('Account created', 'Your Firebase account has been created. We are logging you in now.');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not create the account.';

      Alert.alert('Sign up failed', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Email needed', 'Enter your email first, then tap Forgot Password.');
      return;
    }

    if (!hasFirebaseAuthClient) {
      Alert.alert(
        'Firebase config missing',
        'The Firebase client configuration is missing in the mobile app env.',
      );
      return;
    }

    if (!isAuthReady || !isAuthenticated) {
      try {
        await sendFirebasePasswordReset(email);
        Alert.alert(
          'Reset email sent',
          'A reset link has been sent to your email. In-app password change works only after you are already logged in.',
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Could not send the password reset email.';
        Alert.alert('Reset failed', message);
      }
      return;
    }

    Alert.alert('Password Recovery', 'Choose how you want to update your password.', [
      {
        text: 'Cancel',
        onPress: () => {},
      },
      {
        text: 'Reset via Email',
        onPress: async () => {
          try {
            await sendFirebasePasswordReset(email);
            Alert.alert(
              'Reset email sent',
              'A reset link has been sent to your email.',
            );
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Could not send the password reset email.';
            Alert.alert('Reset failed', message);
          }
        },
      },
      {
        text: 'Change Password In-App',
        onPress: () => setShowChangePasswordModal(true),
      },
    ]);
  };

  const handleCloseChangePasswordModal = () => {
    setShowChangePasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setHideCurrentPassword(true);
    setHideNewPassword(true);
    setHideConfirmPassword(true);
  };

  const handleChangePasswordInApp = async () => {
    if (!isAuthReady || !isAuthenticated) {
      Alert.alert(
        'Login required',
        'Please log in first. In-app password change only works for an authenticated Firebase user.',
      );
      return;
    }

    if (!currentPassword.trim()) {
      Alert.alert('Missing password', 'Please enter your current password.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Invalid password', 'New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Passwords do not match', 'Please confirm the same new password.');
      return;
    }

    setIsSubmitting(true);

    try {
      await updateFirebasePassword(currentPassword, newPassword);
      handleCloseChangePasswordModal();
      setEmail('');
      setPassword('');
      Alert.alert(
        'Password updated',
        'Your password has been updated successfully. Please log in again with your new password.',
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not update password.';
      Alert.alert('Failed', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppleSignIn = () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Apple sign-in', 'Sign in with Apple is available only on iOS.');
      return;
    }

    Alert.alert(
      'Apple sign-in needs iOS setup',
      'The Apple sign-in button is added for UI consistency, but it still needs the Apple auth configuration for the iOS build.',
    );
  };

  return (
    <>
      <StatusBar style="dark" />
      <ScreenShell contentClassName="pb-10">
        <AnimatedReveal delay={90}>
          <View className="-mx-[22px]">
            <Image
              className="h-[360px] w-full rounded-none"
              resizeMode="cover"
              source={appImages.loginHero}
            />
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <View className="gap-1 px-2">
            <Text className="font-poppinsSemi text-[30px] text-brand-text">Welcome Back</Text>
            <Text className="font-poppinsRegular text-base text-brand-textSecondary">
              Continue your journey of self-awareness
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={250}>
          <View className="gap-5 px-2">
            <AppInput
              label="Email"
              onChangeText={setEmail}
              placeholder="name@example.com"
              value={email}
            />

            <AppInput
              label="Password"
              onChangeText={setPassword}
              onTrailingPress={() => setHidePassword((current) => !current)}
              placeholder="••••••••"
              secureTextEntry={hidePassword}
              trailingLabel={hidePassword ? 'Show' : 'Hide'}
              value={password}
            />

            <Pressable className="self-end" onPress={handleForgotPassword}>
              <Text className="font-poppinsSemi text-[13px] text-brand-primary">
                Forgot Password?
              </Text>
            </Pressable>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={340}>
          <AppButton
            disabled={isSubmitting}
            label={isSubmitting ? 'Connecting...' : 'Login'}
            onPress={handleLogin}
          />
        </AnimatedReveal>

        <AnimatedReveal delay={420}>
          <View className="flex-row items-center gap-3">
            <View className="h-px flex-1 bg-brand-primaryBorder" />
            <Text className="font-poppinsMedium text-[13px] text-brand-textMuted">OR</Text>
            <View className="h-px flex-1 bg-brand-primaryBorder" />
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={500}>
          <GoogleSignInButton disabled={isSubmitting} />
        </AnimatedReveal>

        <AnimatedReveal delay={580}>
          <AppButton
            disabled={isSubmitting}
            label="Sign in with Apple"
            onPress={handleAppleSignIn}
            variant="secondary"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={640}>
          <View className="rounded-[18px] border border-brand-primaryBorder bg-brand-surface p-4">
            <AppCheckbox
              checked={agreeToTerms}
              label="By checking this box, I agree to the Terms and Conditions."
              onPress={() => setAgreeToTerms((current) => !current)}
            />
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={700}>
          <AppButton
            disabled={isSubmitting}
            label="Create Account"
            onPress={handleCreateAccount}
            variant="ghost"
          />
        </AnimatedReveal>

        {authError ? (
          <AnimatedReveal delay={760}>
            <Text className="px-2 text-center font-poppinsRegular text-[13px] text-red-500">
              {authError}
            </Text>
          </AnimatedReveal>
        ) : null}
      </ScreenShell>

      <Modal
        animationType="slide"
        onRequestClose={handleCloseChangePasswordModal}
        transparent
        visible={showChangePasswordModal}
      >
        <View className="flex-1 justify-end bg-[rgba(10,63,79,0.38)] px-5 pb-6">
          <View className="rounded-[28px] bg-brand-background p-5">
            <View className="gap-2">
              <Text className="font-poppinsSemi text-[24px] text-brand-text">
                Change Password
              </Text>
              <Text className="font-poppinsRegular text-[14px] leading-[22px] text-brand-textSecondary">
                Enter your current password and choose a new one. This works only for an already signed-in email/password account.
              </Text>
            </View>

            <View className="mt-5 gap-4">
              <AppInput
                label="Current Password"
                onChangeText={setCurrentPassword}
                onTrailingPress={() => setHideCurrentPassword((value) => !value)}
                placeholder="Current password"
                secureTextEntry={hideCurrentPassword}
                trailingLabel={hideCurrentPassword ? 'Show' : 'Hide'}
                value={currentPassword}
              />

              <AppInput
                label="New Password"
                onChangeText={setNewPassword}
                onTrailingPress={() => setHideNewPassword((value) => !value)}
                placeholder="New password"
                secureTextEntry={hideNewPassword}
                trailingLabel={hideNewPassword ? 'Show' : 'Hide'}
                value={newPassword}
              />

              <AppInput
                label="Confirm Password"
                onChangeText={setConfirmNewPassword}
                onTrailingPress={() => setHideConfirmPassword((value) => !value)}
                placeholder="Confirm new password"
                secureTextEntry={hideConfirmPassword}
                trailingLabel={hideConfirmPassword ? 'Show' : 'Hide'}
                value={confirmNewPassword}
              />
            </View>

            <View className="mt-6 gap-3">
              <AppButton
                disabled={isSubmitting}
                label={isSubmitting ? 'Updating...' : 'Update Password'}
                onPress={() => {
                  void handleChangePasswordInApp();
                }}
              />
              <AppButton
                disabled={isSubmitting}
                label="Cancel"
                onPress={handleCloseChangePasswordModal}
                variant="secondary"
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
