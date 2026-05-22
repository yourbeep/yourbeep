import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppHeader } from '@/components/navigation/app-header';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { createGetInTouchRequest } from '@/lib/api';
import type { CreateGetInTouchInput } from '@/lib/api/types';
import { useAppTheme } from '@/theme/use-app-theme';

const topics: Array<{ label: string; value: CreateGetInTouchInput['topic'] }> = [
  { label: 'General Support', value: 'general_support' },
  { label: 'Course Access', value: 'course_access' },
  { label: 'Technical Issue', value: 'technical_issue' },
  { label: 'Feedback', value: 'feedback' },
  { label: 'Partnership', value: 'partnership' },
];

export function GetInTouchScreen() {
  const { colors, isDark } = useAppTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [topic, setTopic] = useState<CreateGetInTouchInput['topic']>('general_support');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      Alert.alert('Missing details', 'Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createGetInTouchRequest({
        email: email.trim(),
        message: message.trim(),
        name: name.trim(),
        subject: subject.trim(),
        topic,
      });

      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTopic('general_support');
      Alert.alert('Request sent', 'Your message has been sent successfully.');
    } catch (error) {
      Alert.alert('Submission failed', error instanceof Error ? error.message : 'Could not send your message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false} scrollEnabled={false}>
        <AnimatedReveal>
          <AppHeader onBackPress={() => router.back()} subtitle="" title="Get In Touch" />
        </AnimatedReveal>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="gap-5 px-1 pb-8 pt-2">
            <AnimatedReveal delay={90}>
              <View className="rounded-[24px] border px-5 py-5" style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}>
                <Text className="font-poppinsSemi text-[24px]" style={{ color: colors.textPrimary }}>
                  Contact the team
                </Text>
                <Text className="mt-2 font-poppinsRegular text-[14px] leading-[24px]" style={{ color: colors.textSecondary }}>
                  Send a direct request for help, feedback, or partnerships. This form is connected to the backend get-in-touch endpoint.
                </Text>
              </View>
            </AnimatedReveal>

            <AnimatedReveal delay={140}>
              <View className="gap-3">
                <Text className="font-poppinsSemi text-[12px] tracking-[1px]" style={{ color: colors.textMuted }}>
                  TOPIC
                </Text>
                <View className="flex-row flex-wrap gap-3">
                  {topics.map((item) => {
                    const active = item.value === topic;

                    return (
                      <View key={item.value}>
                        <Text
                          className="rounded-full border px-4 py-3 font-poppinsMedium text-[13px]"
                          onPress={() => setTopic(item.value)}
                          style={{
                            backgroundColor: active
                              ? isDark
                                ? colors.primaryMuted
                                : colors.primarySoft
                              : colors.surface,
                            borderColor: active ? colors.accent : colors.primaryBorder,
                            color: active ? colors.primary : colors.textPrimary,
                          }}
                        >
                          {item.label}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </AnimatedReveal>

            {[
              { label: 'NAME', onChange: setName, placeholder: 'Your name', value: name },
              { label: 'EMAIL', onChange: setEmail, placeholder: 'you@example.com', value: email },
              { label: 'SUBJECT', onChange: setSubject, placeholder: 'How can we help?', value: subject },
            ].map((field, index) => (
              <AnimatedReveal delay={180 + index * 40} key={field.label}>
                <View className="gap-2">
                  <Text className="font-poppinsSemi text-[12px] tracking-[1px]" style={{ color: colors.textMuted }}>
                    {field.label}
                  </Text>
                  <TextInput
                    className="rounded-[16px] border px-4 py-4 font-poppinsRegular text-[14px]"
                    onChangeText={field.onChange}
                    placeholder={field.placeholder}
                    placeholderTextColor={colors.textMuted}
                    style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder, color: colors.textPrimary }}
                    value={field.value}
                  />
                </View>
              </AnimatedReveal>
            ))}

            <AnimatedReveal delay={320}>
              <View className="gap-2">
                <Text className="font-poppinsSemi text-[12px] tracking-[1px]" style={{ color: colors.textMuted }}>
                  MESSAGE
                </Text>
                <TextInput
                  className="min-h-[150px] rounded-[18px] border px-4 py-4 font-poppinsRegular text-[14px]"
                  multiline
                  onChangeText={setMessage}
                  placeholder="Describe what you need help with..."
                  placeholderTextColor={colors.textMuted}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.primaryBorder,
                    color: colors.textPrimary,
                    textAlignVertical: 'top',
                  }}
                  value={message}
                />
              </View>
            </AnimatedReveal>

            <AnimatedReveal delay={380}>
              <AppButton
                disabled={isSubmitting}
                label={isSubmitting ? 'Sending...' : 'Send Message'}
                onPress={handleSubmit}
              />
            </AnimatedReveal>
          </View>
        </ScrollView>
      </MainAppShell>
    </>
  );
}
