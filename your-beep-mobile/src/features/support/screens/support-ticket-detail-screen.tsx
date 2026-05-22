import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppHeader } from '@/components/navigation/app-header';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import {
  closeSupportTicket,
  fetchSupportTicketDetail,
  replySupportTicket,
} from '@/lib/api';
import type { SupportTicketRecord } from '@/lib/api/types';
import { useAppTheme } from '@/theme/use-app-theme';

type TicketMessage = {
  attachments: string[];
  body: string;
  createdAt: string;
  senderType: 'admin' | 'user';
};

function formatDate(value: string) {
  return new Date(value).toLocaleString('en-US', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  });
}

export function SupportTicketDetailScreen() {
  const { colors, isDark } = useAppTheme();
  const params = useLocalSearchParams<{ ticketId?: string }>();
  const ticketId = params.ticketId ? String(params.ticketId) : '';
  const [ticket, setTicket] = useState<SupportTicketRecord | null>(null);
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'sending' | 'closing'>('idle');

  useEffect(() => {
    if (!ticketId || loadState !== 'idle') {
      return;
    }

    void (async () => {
      setLoadState('loading');
      setErrorMessage(null);

      try {
        const response = await fetchSupportTicketDetail(ticketId);
        setTicket(response.ticket);
        setLoadState('success');
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Could not load ticket details.');
        setLoadState('error');
      }
    })();
  }, [loadState, ticketId]);

  const messages = useMemo<TicketMessage[]>(() => {
    if (!ticket) {
      return [];
    }

    if (ticket.replies?.length) {
      return ticket.replies.map((reply) => ({
        attachments: reply.attachments,
        body: reply.body,
        createdAt: reply.createdAt,
        senderType: reply.authorType,
      }));
    }

    return (ticket.messages ?? []).map((message) => ({
      attachments: message.attachments,
      body: message.body,
      createdAt: message.createdAt,
      senderType: message.senderType,
    }));
  }, [ticket]);

  const solved = ticket?.status === 'resolved' || ticket?.status === 'closed';

  const handleReply = async () => {
    if (!ticketId || !replyBody.trim() || submitState !== 'idle') {
      return;
    }

    setSubmitState('sending');

    try {
      const response = await replySupportTicket(ticketId, { body: replyBody.trim() });
      setTicket(response.ticket);
      setReplyBody('');
    } catch (error) {
      Alert.alert('Reply failed', error instanceof Error ? error.message : 'Could not send reply.');
    } finally {
      setSubmitState('idle');
    }
  };

  const handleCloseTicket = async () => {
    if (!ticketId || submitState !== 'idle') {
      return;
    }

    setSubmitState('closing');

    try {
      const response = await closeSupportTicket(ticketId);
      setTicket(response.ticket);
    } catch (error) {
      Alert.alert('Close failed', error instanceof Error ? error.message : 'Could not close ticket.');
    } finally {
      setSubmitState('idle');
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false} scrollEnabled={false}>
        <AnimatedReveal>
          <AppHeader onBackPress={() => router.back()} subtitle="" title="Ticket Detail" />
        </AnimatedReveal>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="gap-5 px-1 pb-8 pt-2">
            <AnimatedReveal delay={80}>
              <View
                className="rounded-[24px] border px-5 py-5"
                style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
              >
                <Text className="font-poppinsSemi text-[22px]" style={{ color: colors.textPrimary }}>
                  {ticket?.subject ?? 'Support Ticket'}
                </Text>
                <Text className="mt-2 font-poppinsRegular text-[14px] leading-[24px]" style={{ color: colors.textSecondary }}>
                  {ticket?.description ?? 'Loading ticket information...'}
                </Text>

                <View className="mt-4 flex-row flex-wrap gap-2">
                  <View
                    className="rounded-full px-3 py-1.5"
                    style={{ backgroundColor: isDark ? colors.primarySoft : '#EAF4F1' }}
                  >
                    <Text className="font-poppinsSemi text-[11px]" style={{ color: colors.primary }}>
                      {ticket?.ticketNumber ?? 'TICKET'}
                    </Text>
                  </View>
                  <View
                    className="rounded-full px-3 py-1.5"
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
                      className="font-poppinsSemi text-[11px] uppercase"
                      style={{ color: solved ? '#2B8A72' : '#B67314' }}
                    >
                      {ticket?.status ?? 'loading'}
                    </Text>
                  </View>
                </View>
              </View>
            </AnimatedReveal>

            {loadState === 'error' ? (
              <Text className="font-poppinsRegular text-[13px]" style={{ color: '#E45B38' }}>
                {errorMessage}
              </Text>
            ) : null}

            <AnimatedReveal delay={140}>
              <View className="gap-3">
                <Text className="font-poppinsSemi text-[20px]" style={{ color: colors.textPrimary }}>
                  Conversation
                </Text>

                <View className="gap-3">
                  {messages.map((message, index) => {
                    const fromUser = message.senderType === 'user';

                    return (
                      <View
                        className="rounded-[20px] border px-4 py-4"
                        key={`${message.createdAt}-${index}`}
                        style={{
                          alignSelf: fromUser ? 'flex-end' : 'flex-start',
                          backgroundColor: fromUser ? colors.primarySoft : colors.surface,
                          borderColor: colors.primaryBorder,
                          maxWidth: '92%',
                        }}
                      >
                        <Text className="font-poppinsSemi text-[12px]" style={{ color: colors.textPrimary }}>
                          {fromUser ? 'You' : 'Support'}
                        </Text>
                        <Text className="mt-2 font-poppinsRegular text-[14px] leading-[24px]" style={{ color: colors.textSecondary }}>
                          {message.body}
                        </Text>
                        <Text className="mt-3 font-poppinsRegular text-[11px]" style={{ color: colors.textMuted }}>
                          {formatDate(message.createdAt)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </AnimatedReveal>

            {!solved ? (
              <AnimatedReveal delay={220}>
                <View className="gap-3 rounded-[24px] border px-4 py-4" style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}>
                  <Text className="font-poppinsSemi text-[16px]" style={{ color: colors.textPrimary }}>
                    Send a Reply
                  </Text>
                  <TextInput
                    className="min-h-[110px] rounded-[16px] border px-4 py-4 font-poppinsRegular text-[14px]"
                    multiline
                    onChangeText={setReplyBody}
                    placeholder="Write your update for support..."
                    placeholderTextColor={colors.textMuted}
                    style={{
                      backgroundColor: colors.surfaceMuted,
                      borderColor: colors.primaryBorder,
                      color: colors.textPrimary,
                      textAlignVertical: 'top',
                    }}
                    value={replyBody}
                  />
                  <View className="gap-3">
                    <AppButton
                      disabled={!replyBody.trim() || submitState !== 'idle'}
                      label={submitState === 'sending' ? 'Sending Reply...' : 'Send Reply'}
                      onPress={handleReply}
                    />
                    <Pressable onPress={() => void handleCloseTicket()}>
                      <Text className="text-center font-poppinsSemi text-[13px]" style={{ color: colors.primary }}>
                        {submitState === 'closing' ? 'Closing Ticket...' : 'Close Ticket'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </AnimatedReveal>
            ) : null}
          </View>
        </ScrollView>
      </MainAppShell>
    </>
  );
}
