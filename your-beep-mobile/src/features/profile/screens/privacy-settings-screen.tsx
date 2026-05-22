import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppHeader } from '@/components/navigation/app-header';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import {
  fetchCommunityGuidelines,
  fetchCookiePolicy,
  fetchPrivacyPolicy,
  fetchRefundPolicy,
  fetchTermsOfService,
} from '@/lib/api';
import type { LegalDocument } from '@/lib/api/types';
import { useAppTheme } from '@/theme/use-app-theme';

type LegalKey = 'community' | 'cookies' | 'privacy' | 'refund' | 'terms';

const legalItems: Array<{ id: LegalKey; label: string }> = [
  { id: 'privacy', label: 'Privacy' },
  { id: 'terms', label: 'Terms' },
  { id: 'refund', label: 'Refund' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'community', label: 'Community' },
];

export function PrivacySettingsScreen() {
  const { colors, isDark } = useAppTheme();
  const [documents, setDocuments] = useState<Partial<Record<LegalKey, LegalDocument>>>({});
  const [selectedId, setSelectedId] = useState<LegalKey>('privacy');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const [privacy, terms, refund, cookies, community] = await Promise.all([
          fetchPrivacyPolicy(),
          fetchTermsOfService(),
          fetchRefundPolicy(),
          fetchCookiePolicy(),
          fetchCommunityGuidelines(),
        ]);

        if (!active) {
          return;
        }

        setDocuments({
          community,
          cookies,
          privacy,
          refund,
          terms,
        });
        setErrorMessage(null);
      } catch (error) {
        if (!active) {
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : 'Could not load legal documents.');
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const activeDocument = documents[selectedId];

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false} scrollEnabled={false}>
        <AnimatedReveal>
          <AppHeader onBackPress={() => router.back()} subtitle="" title="Privacy Settings" />
        </AnimatedReveal>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="gap-5 px-1 pb-8 pt-2">
            <AnimatedReveal delay={90}>
              <Text className="font-poppinsRegular text-[14px] leading-[24px]" style={{ color: colors.textSecondary }}>
                These pages are now backed by the backend legal endpoints instead of static placeholder text.
              </Text>
            </AnimatedReveal>

            <AnimatedReveal delay={140}>
              <View className="flex-row flex-wrap gap-3">
                {legalItems.map((item) => {
                  const active = item.id === selectedId;

                  return (
                    <Pressable
                      className="rounded-full border px-4 py-3"
                      key={item.id}
                      onPress={() => setSelectedId(item.id)}
                      style={{
                        backgroundColor: active
                          ? isDark
                            ? colors.primaryMuted
                            : colors.primarySoft
                          : colors.surface,
                        borderColor: active ? colors.accent : colors.primaryBorder,
                      }}
                    >
                      <Text
                        className="font-poppinsMedium text-[13px]"
                        style={{ color: active ? colors.primary : colors.textPrimary }}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </AnimatedReveal>

            <AnimatedReveal delay={190}>
              <View className="rounded-[24px] border px-5 py-5" style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}>
                <Text className="font-poppinsSemi text-[22px]" style={{ color: colors.textPrimary }}>
                  {activeDocument?.title ?? 'Loading document...'}
                </Text>
                {activeDocument?.updatedAt ? (
                  <Text className="mt-2 font-poppinsRegular text-[12px]" style={{ color: colors.textMuted }}>
                    Updated {new Date(activeDocument.updatedAt).toLocaleDateString('en-US')}
                  </Text>
                ) : null}

                {errorMessage ? (
                  <Text className="mt-4 font-poppinsRegular text-[13px]" style={{ color: '#E45B38' }}>
                    {errorMessage}
                  </Text>
                ) : (
                  <Text className="mt-4 font-poppinsRegular text-[14px] leading-[25px]" style={{ color: colors.textSecondary }}>
                    {activeDocument?.content ?? 'Fetching the selected legal document from the backend...'}
                  </Text>
                )}
              </View>
            </AnimatedReveal>
          </View>
        </ScrollView>
      </MainAppShell>
    </>
  );
}
