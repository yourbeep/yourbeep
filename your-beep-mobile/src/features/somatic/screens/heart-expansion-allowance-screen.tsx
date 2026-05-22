import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { ExpansionLevelStack } from '@/features/somatic/components/expansion-level-stack';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { useAppTheme } from '@/theme/use-app-theme';

function BinaryChoice({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (next: boolean) => void;
  value: boolean;
}) {
  const { colors, isDark } = useAppTheme();

  return (
    <View className="gap-3">
      <Text className="font-poppinsSemi text-[18px] leading-[30px]" style={{ color: colors.primary }}>
        {label}
      </Text>
      <View
        className="h-14 w-[142px] flex-row overflow-hidden rounded-full"
        style={{ backgroundColor: isDark ? colors.surfaceStrong : '#CAC6B5' }}
      >
        <Pressable
          className="flex-1 items-center justify-center"
          onPress={() => onChange(true)}
          style={value ? { backgroundColor: colors.primary } : undefined}
        >
          <Text className="font-poppinsSemi text-[15px]" style={{ color: value ? colors.textInverse : colors.textMuted }}>
            Yes
          </Text>
        </Pressable>
        <Pressable
          className="flex-1 items-center justify-center"
          onPress={() => onChange(false)}
          style={!value ? { backgroundColor: colors.primary } : undefined}
        >
          <Text className="font-poppinsSemi text-[15px]" style={{ color: !value ? colors.textInverse : colors.textMuted }}>
            No
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export function HeartExpansionAllowanceScreen() {
  const { colors } = useAppTheme();
  const [vulnerable, setVulnerable] = useState(true);
  const [purgeDramatic, setPurgeDramatic] = useState(true);

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <View className="gap-3 px-1">
            <Text className="font-poppinsSemi text-[32px] leading-[40px]" style={{ color: colors.textPrimary }}>
              Expansion Allowance Practice
            </Text>
            <Text className="font-poppinsRegular text-[17px] leading-[30px]" style={{ color: colors.textSecondary }}>
              Exercise #1: allow the heart center to soften and expand. Level 1 moves 5 seconds up and 5 seconds down, Level 2 uses 7 seconds each way, and Level 3 uses 10 seconds each way.
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <ExpansionLevelStack levelSeconds={[5, 7, 10]} />
        </AnimatedReveal>

        <AnimatedReveal delay={240}>
          <View className="gap-7 px-1">
            <View className="gap-1">
              <Text className="font-poppinsSemi text-[30px] leading-[38px]" style={{ color: colors.textPrimary }}>
                Vulnerability Check
              </Text>
              <Text className="font-poppinsRegular text-[15px] leading-[26px]" style={{ color: colors.textSecondary }}>
                Notice how the system responds as the chest area becomes more open.
              </Text>
            </View>

            <BinaryChoice
              label="Did expansion feel vulnerable?"
              onChange={setVulnerable}
              value={vulnerable}
            />
            <BinaryChoice
              label="Did the urge get more dramatic?"
              onChange={setPurgeDramatic}
              value={purgeDramatic}
            />
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={320}>
          <AppButton
            label="Next"
            onPress={() => router.push('/somatic-heart-chest-opening')}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}
