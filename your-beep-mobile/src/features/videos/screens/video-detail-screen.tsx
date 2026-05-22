import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Video } from 'expo-av';
import { Alert, ImageBackground, Pressable, Text, TextInput, View } from 'react-native';
import { Maximize, Volume2 } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppHeader } from '@/components/navigation/app-header';
import { AppButton } from '@/components/ui/app-button';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { ProgressBar } from '@/components/ui/progress-bar';
import { CommunityReflectionCard } from '@/features/videos/components/community-reflection-card';
import { LessonNoteItem } from '@/features/videos/components/lesson-note-item';
import { UpNextItem } from '@/features/videos/components/up-next-item';
import { formatCueTime, resolveInteractiveCueRoute } from '@/features/videos/utils/interactive-cues';
import {
  ApiError,
  createContentComment,
  fetchContentComments,
  fetchCourseVideoStream,
  fetchMasterCourseStream,
  fetchVideoCues,
  recordCourseVideoWatch,
} from '@/lib/api';
import { logger } from '@/lib/logger';
import {
  sharedLessonNotes,
  videoLessonDetails,
  VideoId,
} from '@/features/videos/data/videos-content';
import type { CommentRecord, VideoStreamResponse } from '@/lib/api/types';

const fallbackVideoId: VideoId = 'the-sympathetic-shift';

export function VideoDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    courseId?: string;
    contentItemId?: string;
    duration?: string;
    isMaster?: string;
    progress?: string;
    title?: string;
    videoId?: string;
  }>();
  const lessonId = (params.videoId as VideoId | undefined) ?? fallbackVideoId;
  const fallbackDetail = videoLessonDetails[lessonId] ?? videoLessonDetails[fallbackVideoId];
  const [liveStream, setLiveStream] = useState<null | {
    durationSeconds: number | null;
    playbackUrl: string | null;
    thumbnailUrl: string | null;
    title: string;
  }>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [interactiveCues, setInteractiveCues] = useState<VideoStreamResponse['interactiveCues']>([]);
  const [commentDraft, setCommentDraft] = useState('');
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [commentState, setCommentState] = useState<'idle' | 'loading' | 'submitting'>('idle');
  const lastReportedPositionRef = useRef(0);
  const watchedSecondsRef = useRef(0);
  const lastWatchEventAtRef = useRef(0);
  const finalReportSentRef = useRef(false);
  const courseId = params.courseId ? String(params.courseId) : null;
  const contentItemId = params.contentItemId ? String(params.contentItemId) : null;
  const videoId = params.videoId ? String(params.videoId) : null;
  const isMaster = params.isMaster === 'true';

  useEffect(() => {
    let active = true;

    void (async () => {
      const requestParams = {
        courseId: params.courseId ?? null,
        isMaster: params.isMaster ?? null,
        videoId: params.videoId ?? null,
      };

      logger.info('VIDEO', '── stream fetch started', requestParams);

      // Guard: no params at all
      if (!params.isMaster && (!params.courseId || !params.videoId)) {
        logger.warn('VIDEO', 'Missing courseId or videoId — stream request skipped', requestParams);
        if (active) setStreamError('Missing courseId or videoId. Cannot load video.');
        return;
      }

      try {
        let stream;

        if (params.isMaster === 'true') {
          logger.debug('VIDEO', 'Fetching master course stream');
          stream = await fetchMasterCourseStream();
        } else {
          logger.debug('VIDEO', `Fetching course video stream → courseId=${params.courseId} videoId=${params.videoId}`);
          stream = await fetchCourseVideoStream(String(params.courseId), String(params.videoId));
        }

        logger.info('VIDEO', '✓ stream response received', {
          title: stream.title,
          durationSeconds: stream.durationSeconds,
          streamUrl: stream.streamUrl ?? null,
          thumbnailUrl: stream.thumbnailUrl ?? null,
          interactiveCueCount: stream.interactiveCues?.length ?? 0,
        });

        if (active && stream) {
          const playbackUrl = resolvePlaybackUrl(stream);

          if (!playbackUrl) {
            logger.warn('VIDEO', 'Stream response had no playable URL', stream);
          } else {
            logger.debug('VIDEO', `Resolved playback URL → ${playbackUrl}`);
          }

          setInteractiveCues(stream.interactiveCues ?? []);
          setLiveStream({
            durationSeconds: stream.durationSeconds,
            playbackUrl,
            thumbnailUrl: stream.thumbnailUrl ?? null,
            title: stream.title,
          });
          setStreamError(
            playbackUrl
              ? null
              : `No playable stream URL was returned by the API. Expected one of: streamUrl, videoUrl, streamEndpoint.`,
          );
        }
      } catch (error) {
        if (!active) return;

        setLiveStream(null);
        setInteractiveCues([]);

        if (error instanceof ApiError) {
          logger.error('VIDEO', `✗ stream fetch failed — HTTP ${error.status}: ${error.message}`, {
            status: error.status,
            message: error.message,
            details: error.details,
            requestParams,
          });

          const details =
            error.details && typeof error.details === 'object'
              ? JSON.stringify(error.details)
              : String(error.details ?? '');

          setStreamError(
            `Video stream request failed (${error.status}): ${error.message}${details ? `\n${details}` : ''}`,
          );
        } else if (error instanceof Error) {
          logger.error('VIDEO', `✗ stream fetch failed — ${error.name}: ${error.message}`, {
            stack: error.stack,
            requestParams,
          });
          setStreamError(`Video stream request failed: ${error.message}`);
        } else {
          logger.error('VIDEO', '✗ stream fetch failed — unknown error', { error, requestParams });
          setStreamError('Could not load the video stream.');
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [courseId, isMaster, videoId]);

  useEffect(() => {
    if (!params.contentItemId) {
      setComments([]);
      return;
    }

    let active = true;
    setCommentState('loading');

    void (async () => {
      try {
        const data = await fetchContentComments(String(params.contentItemId));

        if (active) {
          setComments(data.items);
          setCommentState('idle');
        }
      } catch {
        if (active) {
          setComments([]);
          setCommentState('idle');
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [params.contentItemId]);

  const [playerStatus, setPlayerStatus] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<any>(null);

  const detail = useMemo(
    () => ({
      ...fallbackDetail,
      currentTime: formatPlaybackTime(watchedSecondsRef.current ?? 0),
      description: fallbackDetail.description,
      source: liveStream?.thumbnailUrl ? { uri: liveStream.thumbnailUrl } : fallbackDetail.source,
      title: params.title ? String(params.title) : liveStream?.title ?? fallbackDetail.title,
      totalTime:
        params.duration && String(params.duration).trim().length > 0
          ? String(params.duration)
          : liveStream?.durationSeconds
            ? formatDuration(liveStream.durationSeconds)
            : fallbackDetail.totalTime,
    }),
    [fallbackDetail, liveStream, params.duration, params.title],
  );
  const progress = getProgressRatio(detail.currentTime, detail.totalTime);
  const visibleComments =
    comments.length > 0
      ? comments.map((item) => ({
          body: item.body,
          id: item._id,
          user: item.author?.name?.toUpperCase() ?? 'COMMUNITY',
        }))
      : detail.reflections;
  const visibleCues = useMemo(
    () =>
      (interactiveCues ?? []).filter((cue) => resolveInteractiveCueRoute(cue.gameKey ?? null)),
    [interactiveCues],
  );

  useEffect(() => {
    return () => {
      void flushWatchEvent(false);
    };
  }, []);

  const handleShareReflection = async () => {
    if (!params.contentItemId || !commentDraft.trim() || commentState === 'submitting') {
      return;
    }

    setCommentState('submitting');

    try {
      const response = await createContentComment(String(params.contentItemId), commentDraft.trim());
      setComments((current) => [response.comment, ...current]);
      setCommentDraft('');
    } catch (error) {
      Alert.alert('Share failed', error instanceof Error ? error.message : 'Could not share reflection.');
    } finally {
      setCommentState('idle');
    }
  };

  const flushWatchEvent = async (completed: boolean) => {
    if (isMaster || !courseId || !videoId) {
      logger.debug('VIDEO', 'flushWatchEvent skipped', { isMaster, courseId, videoId, completed });
      return;
    }

    const positionSeconds = Math.max(0, Math.floor(lastReportedPositionRef.current));
    const watchedSeconds = Math.max(positionSeconds, Math.floor(watchedSecondsRef.current));

    if (watchedSeconds < 1) {
      logger.debug('VIDEO', 'flushWatchEvent skipped - insufficient watch time', { watchedSeconds, completed });
      return;
    }

    if (completed && finalReportSentRef.current) {
      logger.debug('VIDEO', 'flushWatchEvent skipped - final report already sent');
      return;
    }

    logger.debug('VIDEO', 'flushWatchEvent sending', { courseId, videoId, watchedSeconds, positionSeconds, completed });

    try {
      await recordCourseVideoWatch(courseId, videoId, {
        completed,
        ...(contentItemId ? { contentItemId } : {}),
        ...(positionSeconds > 0 ? { positionSeconds } : {}),
        watchedSeconds,
      });

      logger.info('VIDEO', '✓ watch event recorded', { watchedSeconds, positionSeconds, completed });
      lastWatchEventAtRef.current = positionSeconds;

      if (completed) {
        finalReportSentRef.current = true;
      }
    } catch (err) {
      logger.warn('VIDEO', '⚠ watch event failed (swallowed)', err);
    }
  };

  const handleCuePress = (cue: NonNullable<VideoStreamResponse['interactiveCues']>[number]) => {
    const route = resolveInteractiveCueRoute(cue.gameKey ?? null);

    if (!route) {
      return;
    }

    if (cue.pauseVideo && videoRef.current) {
      videoRef.current.pauseAsync();
    }

    router.push({
      params: {
        ...(courseId ? { courseId } : {}),
        ...(cue.gameId ? { gameId: cue.gameId } : {}),
      },
      pathname: route,
    });
  };

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <AppHeader
            onBackPress={() => router.replace('/videos')}
            subtitle=""
            title="Video Library"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={100}>
          <View className="mt-2 overflow-hidden rounded-[22px] bg-[#0E1F24]">
            {liveStream?.playbackUrl ? (
              <Video
                ref={videoRef}
                source={{ uri: liveStream.playbackUrl }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="contain"
                useNativeControls
                progressUpdateIntervalMillis={1000}
                onPlaybackStatusUpdate={(status) => {
                  setPlayerStatus(status);
                  if (status.isLoaded) {
                    setIsPlaying(status.isPlaying);
                    const roundedPosition = Math.max(0, Math.floor(status.positionMillis ? status.positionMillis / 1000 : 0));
                    watchedSecondsRef.current = Math.max(watchedSecondsRef.current, roundedPosition);
                    lastReportedPositionRef.current = roundedPosition;

                    if (roundedPosition - lastWatchEventAtRef.current >= 15) {
                      void flushWatchEvent(false);
                    }

                    if (status.didJustFinish && !finalReportSentRef.current) {
                      void flushWatchEvent(true);
                    }
                  }
                  if (status.error) {
                    logger.error('VIDEO', 'Player error', { error: status.error });
                  }
                }}
                style={{ height: 220, width: '100%', backgroundColor: '#0E1F24' }}
              />
            ) : (
              <ImageBackground
                className="h-[220px] overflow-hidden"
                imageStyle={{ borderRadius: 22 }}
                resizeMode="cover"
                source={detail.source}
              >
                <View className="flex-1 items-center justify-center bg-[rgba(10,25,29,0.48)] px-6">
                  <Text className="text-center font-poppinsSemi text-[18px] text-brand-textInverse">
                    {streamError ?? (playerStatus?.error ? 'Stream playback error' : 'Loading video stream...')}
                  </Text>
                </View>
              </ImageBackground>
            )}

            <View className="gap-2 px-4 pb-4 pt-3">
              <ProgressBar progress={Math.max(4, Math.min(100, Math.round(progress * 100)))} />
              <View className="flex-row items-center justify-between">
                <Text className="font-poppinsMedium text-[12px] text-brand-textInverse">
                  {detail.currentTime} / {detail.totalTime}
                </Text>

                <View className="flex-row items-center gap-3">
                  <Pressable
                    hitSlop={10}
                    onPress={async () => {
                      if (videoRef.current) {
                        const status = await videoRef.current.getStatusAsync();
                        await videoRef.current.setIsMutedAsync(!status.isMuted);
                      }
                    }}
                  >
                    <Volume2 color="#FEFEE5" size={17} strokeWidth={2} />
                  </Pressable>
                  <Maximize color="#FEFEE5" size={17} strokeWidth={2} />
                </View>
              </View>

              <Text className="font-poppinsRegular text-[12px] text-[#D6DDD9]">
                {!playerStatus
                  ? 'Initializing player...'
                  : playerStatus.error
                    ? 'Playback error. Please try again.'
                    : !playerStatus.isLoaded
                      ? 'Loading video...'
                      : isPlaying
                        ? 'Playing'
                        : liveStream?.playbackUrl
                          ? 'Ready to play'
                          : 'Waiting for stream'}
              </Text>
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={180}>
          <View className="gap-4">
            <View className="flex-row flex-wrap gap-2">
              <View className="rounded-full bg-brand-accentSoft px-3 py-1.5">
                <Text className="font-poppinsMedium text-[11px] tracking-[0.5px] text-brand-success">
                  {detail.primaryTag}
                </Text>
              </View>
              <View className="rounded-full bg-[#F2F0E4] px-3 py-1.5">
                <Text className="font-poppinsMedium text-[11px] tracking-[0.5px] text-brand-textSecondary">
                  {detail.secondaryTag}
                </Text>
              </View>
            </View>

            <View className="gap-2">
              <Text className="font-poppinsSemi text-[30px] leading-[40px] text-brand-text">
                {detail.title}
              </Text>
              <View className="self-start rounded-full bg-[#FFD9AA] px-3 py-1.5">
                <Text className="font-poppinsSemi text-[12px] tracking-[0.5px] text-[#D37C1E]">
                  {detail.credits}
                </Text>
              </View>
              <Text className="font-poppinsMedium text-[15px] text-brand-textSecondary">
                {detail.moduleLabel}
              </Text>
            </View>

            <Text className="font-poppinsRegular text-[15px] leading-[30px] text-brand-textSecondary">
              {detail.description}
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={260}>
          {visibleCues.length > 0 ? (
            <View className="gap-4 rounded-[22px] border border-brand-primaryBorder bg-brand-surface p-5">
              <Text className="font-poppinsSemi text-[24px] text-brand-text">Interactive Cues</Text>
              <Text className="font-poppinsRegular text-[14px] leading-[26px] text-brand-textSecondary">
                These backend-linked checkpoints can open the right game flow directly from this lesson.
              </Text>
              <View className="gap-3">
                {visibleCues.map((cue, index) => {
                  const cueTime = formatCueTime(cue.triggerAtSeconds);

                  return (
                    <View
                      className="gap-3 rounded-[18px] border border-brand-primaryBorder bg-[#F8F7F0] p-4"
                      key={`${cue.gameId ?? cue.gameKey ?? 'cue'}-${index + 1}`}
                    >
                      <View className="flex-row items-start justify-between gap-3">
                        <View className="flex-1 gap-1">
                          <Text className="font-poppinsSemi text-[16px] text-brand-text">
                            {cue.title ?? cue.gameTitle ?? cue.ctaLabel ?? 'Open game checkpoint'}
                          </Text>
                          <Text className="font-poppinsRegular text-[13px] leading-[22px] text-brand-textSecondary">
                            {cue.description ?? 'Launch the backend-linked game flow from this lesson.'}
                          </Text>
                        </View>
                        {cueTime ? (
                          <View className="rounded-full bg-brand-accentSoft px-3 py-1.5">
                            <Text className="font-poppinsMedium text-[11px] text-brand-success">
                              {cueTime}
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      <AppButton
                        label={cue.ctaLabel ?? 'Open activity'}
                        onPress={() => {
                          handleCuePress(cue);
                        }}
                        variant="secondary"
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}
        </AnimatedReveal>

        <AnimatedReveal delay={320}>
          <View className="gap-5 rounded-[22px] border border-brand-primaryBorder bg-brand-surface p-5">
            <Text className="font-poppinsSemi text-[24px] text-brand-text">Lesson Notes</Text>
            <View className="h-px bg-brand-primaryBorder" />
            <View className="gap-5">
              {sharedLessonNotes.map((item) => (
                <LessonNoteItem body={item.body} key={item.id} title={item.title} />
              ))}
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={400}>
          <View className="gap-4">
            <Text className="font-poppinsSemi text-[24px] text-brand-text">Up Next</Text>
            <View className="gap-1">
              {detail.upNext.map((item) => (
                <UpNextItem
                  key={item.id}
                  locked={item.locked}
                  module={item.module}
                  title={item.title}
                />
              ))}
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={480}>
          <View className="gap-4">
            <Text className="font-poppinsSemi text-[24px] text-brand-text">
              Community Reflections
            </Text>
            <View className="h-px bg-brand-primaryBorder" />
            <View className="gap-4">
              {visibleComments.map((item) => (
                <CommunityReflectionCard body={item.body} key={item.id} user={item.user} />
              ))}
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={560}>
          <View className="gap-3 rounded-[22px] border border-brand-primaryBorder bg-[#F8F7F0] p-4">
            <TextInput
              className="min-h-[84px] rounded-[14px] border border-brand-primaryBorder bg-brand-surface px-4 py-3 font-poppinsRegular text-[14px] text-brand-text"
              multiline
              placeholder="Share your insight..."
              placeholderTextColor="#A2A6A6"
              onChangeText={setCommentDraft}
              textAlignVertical="top"
              value={commentDraft}
            />
            <AppButton
              className="self-end px-5"
              disabled={!params.contentItemId || !commentDraft.trim() || commentState === 'submitting'}
              label={commentState === 'submitting' ? 'Sharing...' : 'Share Reflection'}
              onPress={() => {
                void handleShareReflection();
              }}
              style={{ width: 170 }}
            />
          </View>
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

function resolvePlaybackUrl(stream: VideoStreamResponse) {
  const candidateStream = stream as VideoStreamResponse & {
    streamEndpoint?: string | null;
    videoUrl?: string | null;
  };

  return candidateStream.streamUrl ?? candidateStream.videoUrl ?? candidateStream.streamEndpoint ?? null;
}

function guessContentType(uri: string) {
  const normalized = uri.toLowerCase();

  if (normalized.includes('.m3u8') || normalized.includes('playlist')) {
    logger.debug('VIDEO', 'Detected HLS (m3u8) content type');
    return 'hls' as const;
  }

  if (normalized.includes('.mpd')) {
    logger.debug('VIDEO', 'Detected DASH (mpd) content type');
    return 'dash' as const;
  }

  logger.debug('VIDEO', 'Using auto content type detection');
  return 'auto' as const;
}

function formatPlaybackTime(valueSeconds: number) {
  const totalSeconds = Math.max(0, Math.floor(valueSeconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatDuration(durationSeconds: number) {
  if (!durationSeconds || durationSeconds <= 0) {
    return '--:--';
  }

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getProgressRatio(currentTime: string, totalTime: string) {
  const current = parseDuration(currentTime);
  const total = parseDuration(totalTime);

  if (!total) {
    return 0;
  }

  return current / total;
}

function parseDuration(value: string) {
  const parts = value.split(':').map((item) => Number.parseInt(item, 10));

  if (parts.some((item) => Number.isNaN(item))) {
    return 0;
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  return 0;
}
