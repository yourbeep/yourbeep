import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Paperclip } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppHeader } from '@/components/navigation/app-header';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import {
  priorityLevels,
  supportCategories,
} from '@/features/support/data/support-content';
import { createSupportTicket, fetchSupportTickets } from '@/lib/api';
import { env } from '@/lib/config/env';
import type { CreateSupportTicketInput, SupportTicketRecord } from '@/lib/api/types';
import { useAppSelector } from '@/store/hooks';
import { useAppTheme } from '@/theme/use-app-theme';

type AttachmentDraft = {
  id: string;
  kind: 'document' | 'image';
  name: string;
  payloadUrl: string;
};

export function RaiseTicketScreen() {
  const { colors, isDark } = useAppTheme();
  const authReady = useAppSelector((state) => state.auth.isReady);
  const authToken = useAppSelector((state) => state.auth.token);
  const [category, setCategory] = useState<(typeof supportCategories)[number]>('Technical Issue');
  const [priority, setPriority] = useState<(typeof priorityLevels)[number]>('medium');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [tickets, setTickets] = useState<SupportTicketRecord[]>([]);
  const [attachments, setAttachments] = useState<AttachmentDraft[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketError, setTicketError] = useState<string | null>(null);
  const platformSettings = useAppSelector((state) => state.settings.platformSettings);

  useEffect(() => {
    if (!authReady && !env.apiBearerToken) {
      return;
    }

    if (!authToken && !env.apiBearerToken) {
      setTickets([]);
      setTicketError('Please log in to see your tickets.');
      return;
    }

    let active = true;

    fetchSupportTickets()
      .then((data) => {
        if (active) {
          setTickets(data.items);
          setTicketError(null);
        }
      })
      .catch((error) => {
        if (active) {
          setTickets([]);
          setTicketError(error instanceof Error ? error.message : 'Could not load tickets.');
        }
      });

    return () => {
      active = false;
    };
  }, [authReady, authToken]);

  const addImageAttachment = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Gallery permission needed',
        'Please allow photo library access so you can attach screenshots.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      base64: true,
      mediaTypes: ['images'],
      quality: 0.5,
      selectionLimit: 5,
    });

    if (result.canceled) {
      return;
    }

    const selected = result.assets
      .filter((asset) => asset.base64 && asset.mimeType)
      .map<AttachmentDraft>((asset, index) => ({
        id: `${asset.assetId ?? asset.fileName ?? 'image'}-${Date.now()}-${index}`,
        kind: 'image',
        name: asset.fileName ?? `screenshot-${index + 1}.jpg`,
        payloadUrl: `data:${asset.mimeType};base64,${asset.base64}`,
      }));

    if (!selected.length) {
      Alert.alert('Attachment unavailable', 'Could not prepare the selected screenshot.');
      return;
    }

    setAttachments((current) => [...current, ...selected].slice(0, 10));
  };

  const addDocumentAttachment = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: true,
      type: ['application/json', 'application/pdf', 'text/plain'],
    });

    if (result.canceled) {
      return;
    }

    const selected = result.assets.map<AttachmentDraft>((asset, index) => ({
      id: `${asset.name}-${Date.now()}-${index}`,
      kind: 'document',
      name: asset.name,
      payloadUrl: asset.uri,
    }));

    setAttachments((current) => [...current, ...selected].slice(0, 10));
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments((current) => current.filter((item) => item.id !== attachmentId));
  };

  const submitTicket = async () => {
    const typeByCategory: Record<(typeof supportCategories)[number], CreateSupportTicketInput['type']> = {
      'Account & Billing': 'payment_issue',
      'Curriculum Feedback': 'general_support',
      'Somatic Device Sync': 'technical_issue',
      'Technical Issue': 'technical_issue',
    };

    if (!subject.trim() || !details.trim()) {
      Alert.alert('Missing details', 'Please complete the subject and detailed description.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createSupportTicket({
        attachments: attachments.map((item) => item.payloadUrl),
        description: details.trim(),
        priority,
        subject: subject.trim(),
        type: typeByCategory[category],
      });

      setTickets((current) => [response.ticket, ...current]);
      setTicketError(null);
      setSubject('');
      setDetails('');
      setAttachments([]);
      Alert.alert('Ticket submitted', 'Your support ticket has been sent successfully.');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Support ticket submission failed.';

      Alert.alert('Submission failed', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false} scrollEnabled={false}>
        <AnimatedReveal>
          <AppHeader onBackPress={() => router.back()} subtitle="" title="Raise Ticket" />
        </AnimatedReveal>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="gap-6 px-1 pb-8 pt-2">
            <AnimatedReveal delay={90}>
              <View
                className="rounded-[24px] border px-5 py-5"
                style={{
                  backgroundColor: isDark ? colors.surfaceStrong : '#EEF7F5',
                  borderColor: colors.primaryBorder,
                }}
              >
                <Text className="font-poppinsSemi text-[24px]" style={{ color: colors.textPrimary }}>
                  Resolution Hub
                </Text>
                <Text
                  className="mt-2 font-poppinsRegular text-[14px] leading-[24px]"
                  style={{ color: colors.textSecondary }}
                >
                  Our neuro-tech engineers are standing by to optimize your somatic experience. Submit your details below and we&apos;ll get back to you
                  {platformSettings?.supportEmail ? ` via ${platformSettings.supportEmail}.` : '.'}
                </Text>
              </View>
            </AnimatedReveal>

            <AnimatedReveal delay={140}>
              <View className="gap-3">
                <Text className="font-poppinsSemi text-[12px] tracking-[1px]" style={{ color: colors.textMuted }}>
                  CATEGORY SELECTION
                </Text>
                <View className="flex-row flex-wrap gap-3">
                  {supportCategories.map((item) => {
                    const active = item === category;

                    return (
                      <Pressable
                        className="rounded-full border px-4 py-3"
                        key={item}
                        onPress={() => setCategory(item)}
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
                          style={{
                            color: active
                              ? isDark
                                ? colors.textPrimary
                                : colors.primary
                              : colors.textPrimary,
                          }}
                        >
                          {item}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </AnimatedReveal>

            <AnimatedReveal delay={200}>
              <View className="gap-4">
                <View className="gap-2">
                  <Text className="font-poppinsSemi text-[12px] tracking-[1px]" style={{ color: colors.textMuted }}>
                    SUBJECT LINE
                  </Text>
                  <TextInput
                    className="rounded-[16px] border px-4 py-4 font-poppinsRegular text-[14px]"
                    onChangeText={setSubject}
                    placeholder="Brief summary of the inquiry"
                    placeholderTextColor={colors.textMuted}
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.primaryBorder,
                      color: colors.textPrimary,
                    }}
                    value={subject}
                  />
                </View>

                <View className="gap-2">
                  <Text className="font-poppinsSemi text-[12px] tracking-[1px]" style={{ color: colors.textMuted }}>
                    DETAILED DESCRIPTION
                  </Text>
                  <TextInput
                    className="rounded-[18px] border px-4 py-4 font-poppinsRegular text-[14px]"
                    multiline
                    numberOfLines={6}
                    onChangeText={setDetails}
                    placeholder="Describe the technical or support issue..."
                    placeholderTextColor={colors.textMuted}
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.primaryBorder,
                      color: colors.textPrimary,
                      minHeight: 138,
                      textAlignVertical: 'top',
                    }}
                    value={details}
                  />
                </View>
              </View>
            </AnimatedReveal>

            <AnimatedReveal delay={250}>
              <View className="gap-3">
                <Text className="font-poppinsSemi text-[12px] tracking-[1px]" style={{ color: colors.textMuted }}>
                  PRIORITY LEVEL
                </Text>
                <View
                  className="flex-row rounded-[18px] border p-1.5"
                  style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
                >
                  {priorityLevels.map((item) => {
                    const active = item === priority;

                    return (
                      <Pressable
                        className="flex-1 rounded-[14px] px-3 py-3"
                        key={item}
                        onPress={() => setPriority(item)}
                        style={{
                          backgroundColor: active
                            ? isDark
                              ? colors.primaryMuted
                              : colors.primarySoft
                            : 'transparent',
                        }}
                      >
                        <Text
                          className="text-center font-poppinsSemi text-[12px] uppercase"
                          style={{
                            color: active
                              ? isDark
                                ? colors.textPrimary
                                : colors.primary
                              : colors.textMuted,
                          }}
                        >
                          {item}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </AnimatedReveal>

            <AnimatedReveal delay={300}>
              <View
                className="rounded-[20px] border border-dashed px-4 py-6"
                style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
              >
                <View className="items-center">
                  <Paperclip color={colors.textMuted} size={18} />
                  <Text className="mt-3 font-poppinsSemi text-[13px]" style={{ color: colors.textPrimary }}>
                    ADD SCREENSHOTS OR DATA LOGS
                  </Text>
                  <Text className="mt-1 text-center font-poppinsRegular text-[12px]" style={{ color: colors.textSecondary }}>
                    Choose from gallery or attach a log file for support review.
                  </Text>
                </View>

                <View className="mt-4 flex-row gap-3">
                  <Pressable
                    className="flex-1 rounded-full border px-4 py-3"
                    onPress={addImageAttachment}
                    style={{ backgroundColor: colors.surfaceStrong, borderColor: colors.primaryBorder }}
                  >
                    <Text className="text-center font-poppinsSemi text-[12px]" style={{ color: colors.textPrimary }}>
                      Add Screenshot
                    </Text>
                  </Pressable>
                  <Pressable
                    className="flex-1 rounded-full border px-4 py-3"
                    onPress={addDocumentAttachment}
                    style={{ backgroundColor: colors.surfaceStrong, borderColor: colors.primaryBorder }}
                  >
                    <Text className="text-center font-poppinsSemi text-[12px]" style={{ color: colors.textPrimary }}>
                      Add File
                    </Text>
                  </Pressable>
                </View>

                {attachments.length ? (
                  <View className="mt-4 gap-2">
                    {attachments.map((attachment) => (
                      <View
                        className="flex-row items-center justify-between rounded-[14px] border px-3 py-3"
                        key={attachment.id}
                        style={{ borderColor: colors.primaryBorder, backgroundColor: colors.surfaceStrong }}
                      >
                        <View className="flex-1 pr-3">
                          <Text className="font-poppinsMedium text-[12px]" style={{ color: colors.textPrimary }}>
                            {attachment.name}
                          </Text>
                          <Text className="mt-1 font-poppinsRegular text-[11px]" style={{ color: colors.textSecondary }}>
                            {attachment.kind === 'image' ? 'Screenshot attached' : 'Document attached'}
                          </Text>
                        </View>
                        <Pressable onPress={() => removeAttachment(attachment.id)}>
                          <Text className="font-poppinsSemi text-[12px]" style={{ color: colors.primary }}>
                            Remove
                          </Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            </AnimatedReveal>

            <AnimatedReveal delay={350}>
              <View className="gap-2">
                <AppButton
                  disabled={isSubmitting}
                  label={isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                  onPress={submitTicket}
                />
                <Text className="text-center font-poppinsRegular text-[11px]" style={{ color: colors.textSecondary }}>
                  Typical response time: 2-4 neural cycles (approx. 6 hours)
                </Text>
              </View>
            </AnimatedReveal>

            <AnimatedReveal delay={410}>
              <View className="gap-4">
                <Text className="font-poppinsSemi text-[24px]" style={{ color: colors.textPrimary }}>
                  Recent Tickets
                </Text>
                {ticketError ? (
                  <Text className="font-poppinsRegular text-[12px]" style={{ color: colors.textSecondary }}>
                    Live tickets are unavailable right now: {ticketError}
                  </Text>
                ) : null}
                <View className="gap-3">
                  {(tickets.length
                    ? tickets.map((ticket) => ({
                        date: new Date(ticket.createdAt).toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        }),
                        id: ticket._id,
                        status: ticket.status,
                        title: ticket.subject,
                      }))
                    : []
                  ).map((ticket) => {
                    const solved = ticket.status === 'resolved' || ticket.status === 'closed';

                    return (
                      <Pressable
                        className="rounded-[18px] border px-4 py-4"
                        key={ticket.id}
                        onPress={() =>
                          router.push({
                            params: { ticketId: ticket.id },
                            pathname: '/support-ticket/[ticketId]',
                          })
                        }
                        style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
                      >
                        <View className="flex-row items-start justify-between gap-3">
                          <View className="flex-1">
                            <Text className="font-poppinsMedium text-[15px]" style={{ color: colors.textPrimary }}>
                              {ticket.title}
                            </Text>
                            <Text className="mt-1 font-poppinsRegular text-[12px]" style={{ color: colors.textSecondary }}>
                              {ticket.date}
                            </Text>
                          </View>
                          <View
                            className="rounded-full px-3 py-1"
                            style={{
                              backgroundColor: solved
                                ? isDark
                                  ? 'rgba(101,203,168,0.18)'
                                  : '#DFF7E4'
                                : isDark
                                  ? 'rgba(255,182,72,0.18)'
                                  : '#FFE6B8',
                            }}
                          >
                            <Text
                              className="font-poppinsSemi text-[10px] uppercase"
                              style={{ color: solved ? '#2B8A72' : '#B67314' }}
                            >
                              {ticket.status}
                            </Text>
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}
                  {!tickets.length && !ticketError ? (
                    <View
                      className="rounded-[18px] border px-4 py-5"
                      style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
                    >
                      <Text className="font-poppinsMedium text-[14px]" style={{ color: colors.textPrimary }}>
                        No recent tickets yet
                      </Text>
                      <Text className="mt-1 font-poppinsRegular text-[12px]" style={{ color: colors.textSecondary }}>
                        Once a real ticket is submitted through the backend, it will appear here.
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </AnimatedReveal>
          </View>
        </ScrollView>
      </MainAppShell>
    </>
  );
}
