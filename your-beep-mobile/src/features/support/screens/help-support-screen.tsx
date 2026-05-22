import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronDown, ChevronUp, CreditCard, Headset, Info, Search } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppHeader } from '@/components/navigation/app-header';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { useAppSelector } from '@/store/hooks';
import { useAppTheme } from '@/theme/use-app-theme';

function SectionIcon({
  tone,
  type,
}: {
  tone: 'green' | 'peach';
  type: 'basics' | 'membership';
}) {
  const bg = tone === 'green' ? '#D8EDB0' : '#FFD7C8';
  const color = tone === 'green' ? '#53714A' : '#895847';
  const Icon = type === 'basics' ? Info : CreditCard;

  return (
    <View className="h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: bg }}>
      <Icon color={color} size={15} strokeWidth={2} />
    </View>
  );
}

export function HelpSupportScreen() {
  const { colors, isDark } = useAppTheme();
  const [expanded, setExpanded] = useState<string[]>(['what-is-ethereal-academy']);
  const [query, setQuery] = useState('');
  const platformSettings = useAppSelector((state) => state.settings.platformSettings);
  const settingsLoading = useAppSelector((state) => state.settings.isLoading);

  useEffect(() => {
    if (platformSettings?.faqItems?.length) {
      setExpanded([platformSettings.faqItems[0]._id]);
    }
  }, [platformSettings?.faqItems]);

  const resolvedFaqSections = useMemo(() => {
    if (!platformSettings?.faqItems.length) {
      return [];
    }

    const grouped = new Map<
      string,
      {
        iconTone: 'green' | 'peach';
        id: string;
        questions: { answer: string; id: string; question: string }[];
        title: string;
      }
    >();

    platformSettings.faqItems.forEach((item, index) => {
      const key = item.category.trim().toLowerCase();
      const existing = grouped.get(key);

      if (existing) {
        existing.questions.push({
          answer: item.answer,
          id: item._id,
          question: item.question,
        });
        return;
      }

      grouped.set(key, {
        iconTone: index % 2 === 0 ? 'green' : 'peach',
        id: key.replace(/\s+/g, '-'),
        questions: [
          {
            answer: item.answer,
            id: item._id,
            question: item.question,
          },
        ],
        title: item.category,
      });
    });

    return [...grouped.values()];
  }, [platformSettings]);

  const filteredSections = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return resolvedFaqSections;
    }

    return resolvedFaqSections
      .map((section) => ({
        ...section,
        questions: section.questions.filter((item) =>
          `${item.question} ${item.answer}`.toLowerCase().includes(normalized),
        ),
      }))
      .filter((section) => section.questions.length > 0);
  }, [query, resolvedFaqSections]);

  const toggleQuestion = (id: string) => {
    setExpanded((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <AppHeader onBackPress={() => router.back()} subtitle="" title="FAQ" />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <View className="items-center gap-4 px-3">
            <Text
              className="text-center font-poppinsSemi text-[36px] leading-[48px]"
              style={{ color: isDark ? colors.textPrimary : colors.primary }}
            >
              How can we help you{'\n'}find clarity?
            </Text>
            <Text className="max-w-[320px] text-center font-poppinsRegular text-[15px] leading-[28px]" style={{ color: colors.textSecondary }}>
              Explore our curated collection of wisdom, or simply ask what&apos;s on your mind. We&apos;re here to guide you.
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={150}>
          <View
            className="flex-row items-center gap-3 rounded-full border px-5 py-4"
            style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
          >
            <Search color={colors.textMuted} size={18} strokeWidth={2} />
            <TextInput
              className="flex-1 font-poppinsRegular text-[15px]"
              onChangeText={setQuery}
              placeholder="Search for answers..."
              placeholderTextColor={colors.textMuted}
              style={{ color: colors.textPrimary }}
              value={query}
            />
          </View>
        </AnimatedReveal>

        <View className="gap-6">
          {filteredSections.map((section, sectionIndex) => (
            <AnimatedReveal delay={210 + sectionIndex * 70} key={section.id}>
              <View
                className="rounded-[26px] border px-0 py-0"
                style={{
                  backgroundColor: isDark ? colors.surfaceStrong : '#F4F2E5',
                  borderColor: colors.primaryBorder,
                }}
              >
                <View className="flex-row items-center gap-3 border-b px-4 py-4" style={{ borderBottomColor: colors.primaryBorder }}>
                  <SectionIcon tone={section.iconTone} type={section.id === 'basics' ? 'basics' : 'membership'} />
                  <Text className="font-poppinsSemi text-[18px]" style={{ color: colors.textPrimary }}>
                    {section.title}
                  </Text>
                </View>

                <View className="gap-3 px-3 py-3">
                  {section.questions.map((item) => {
                    const open = expanded.includes(item.id);

                    return (
                      <View
                        className="overflow-hidden rounded-[18px] border"
                        key={item.id}
                        style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
                      >
                        <Pressable
                          className="flex-row items-center justify-between gap-3 px-4 py-4"
                          onPress={() => toggleQuestion(item.id)}
                        >
                          <Text className="flex-1 font-poppinsMedium text-[14px] leading-[22px]" style={{ color: colors.textPrimary }}>
                            {item.question}
                          </Text>
                          {open ? (
                            <ChevronUp color={colors.textMuted} size={18} strokeWidth={2} />
                          ) : (
                            <ChevronDown color={colors.textMuted} size={18} strokeWidth={2} />
                          )}
                        </Pressable>
                        {open ? (
                          <View className="border-t px-4 pb-4 pt-1" style={{ borderTopColor: colors.primaryBorder }}>
                            <Text className="font-poppinsRegular text-[14px] leading-[25px]" style={{ color: colors.textSecondary }}>
                              {item.answer}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              </View>
            </AnimatedReveal>
          ))}

          {!filteredSections.length ? (
            <AnimatedReveal delay={220}>
              <View
                className="rounded-[24px] border px-5 py-5"
                style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
              >
                <Text className="font-poppinsSemi text-[18px]" style={{ color: colors.textPrimary }}>
                  {settingsLoading ? 'Loading FAQs...' : 'No FAQs published yet'}
                </Text>
                <Text className="mt-2 font-poppinsRegular text-[14px] leading-[24px]" style={{ color: colors.textSecondary }}>
                  {settingsLoading
                    ? 'Hydrating support content from the admin portal.'
                    : 'Ask the admin team to publish FAQ items from the platform settings portal.'}
                </Text>
              </View>
            </AnimatedReveal>
          ) : null}
        </View>

        <AnimatedReveal delay={380}>
          <View
            className="items-center rounded-[30px] px-6 py-8"
            style={{
              backgroundColor: isDark ? colors.surfaceStrong : '#DFF4FF',
              borderColor: colors.primaryBorder,
              borderWidth: 1,
            }}
          >
            <View
              className="h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: isDark ? colors.primarySoft : 'rgba(7,59,76,0.12)' }}
            >
              <Headset color={colors.primary} size={22} strokeWidth={2} />
            </View>
            <Text
              className="mt-5 font-poppinsSemi text-[30px] leading-[36px]"
              style={{ color: colors.textPrimary }}
            >
              Still need help?
            </Text>
            <Text className="mt-3 max-w-[310px] text-center font-poppinsRegular text-[14px] leading-[26px]" style={{ color: colors.textSecondary }}>
              If you couldn&apos;t find the clarity you were looking for, our guides are ready to assist you personally
              {platformSettings?.supportEmail ? ` at ${platformSettings.supportEmail}.` : '.'}
            </Text>
            <View className="mt-6 w-full max-w-[220px] gap-3">
              <AppButton label="Raise Ticket" onPress={() => router.push('/raise-ticket')} />
              <AppButton label="Get In Touch" onPress={() => router.push('/get-in-touch')} variant="secondary" />
            </View>
          </View>
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}
