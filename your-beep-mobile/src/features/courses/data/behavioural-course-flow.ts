import { ImageSourcePropType } from 'react-native';

import { appImages } from '@/constants/images';
import type { CourseContentResponse, CourseDetailResponse } from '@/lib/api';

type BehaviouralModuleRoute =
  | '/awareness-states'
  | '/somatic-states'
  | '/pattern-awareness'
  | '/reflect-synthesis';

export type BehaviouralModuleKey =
  | 'awareness_states'
  | 'somatic_states'
  | 'pattern_awareness'
  | 'reflect_act';

type BehaviouralModuleTone = 'cool' | 'warm' | 'warmStrong';

interface BehaviouralModuleDefinition {
  defaultDescription: string;
  defaultTitle: string;
  icon: ImageSourcePropType;
  key: BehaviouralModuleKey;
  keywords: string[];
  route: BehaviouralModuleRoute;
  sortOrder: number;
  tone: BehaviouralModuleTone;
}

export interface BehaviouralModuleCardData {
  contentItemId?: string;
  description: string;
  gameId?: string;
  isFree?: boolean;
  route: BehaviouralModuleRoute;
  source: 'backend' | 'fallback';
  sortOrder: number;
  status: 'completed' | 'not_started' | 'in_progress';
  title: string;
  tone: BehaviouralModuleTone;
  type: BehaviouralModuleKey;
  imageSource: ImageSourcePropType;
}

const moduleDefinitions: readonly BehaviouralModuleDefinition[] = [
  {
    defaultDescription: 'Identify your current emotional energy',
    defaultTitle: 'Awareness States',
    icon: appImages.courseMeditationIllustration,
    key: 'awareness_states',
    keywords: ['awareness', 'activation', 'expansion'],
    route: '/awareness-states',
    sortOrder: 1,
    tone: 'warm',
  },
  {
    defaultDescription: 'Map your current somatic sensations',
    defaultTitle: 'Somatic States',
    icon: appImages.courseExerciseIllustration,
    key: 'somatic_states',
    keywords: ['somatic', 'body', 'sensation'],
    route: '/somatic-states',
    sortOrder: 2,
    tone: 'cool',
  },
  {
    defaultDescription: 'Connect behaviors to nervous system cues',
    defaultTitle: 'Pattern Awareness',
    icon: appImages.courseTaskListIllustration,
    key: 'pattern_awareness',
    keywords: ['pattern', 'breath', 'draw', 'map'],
    route: '/pattern-awareness',
    sortOrder: 3,
    tone: 'warmStrong',
  },
  {
    defaultDescription: 'Insights into psychosomatic synthesis',
    defaultTitle: 'Reflect and Act',
    icon: appImages.courseReflectIllustration,
    key: 'reflect_act',
    keywords: ['reflect', 'act', 'insight', 'synthesis'],
    route: '/reflect-synthesis',
    sortOrder: 4,
    tone: 'cool',
  },
] as const;

const populatedGameMatchesModule = (
  game:
    | {
        _id: string;
        description?: string | null;
        key?: string;
        title?: string;
      }
    | string
    | undefined,
  definition: BehaviouralModuleDefinition,
) => {
  if (!game || typeof game === 'string') {
    return false;
  }

  const haystack = `${normalize(game.key)} ${normalize(game.title)} ${normalize(game.description)}`;

  return definition.keywords.some((keyword) => haystack.includes(keyword));
};

const getCourseGameId = (
  courseDetail: CourseDetailResponse | null | undefined,
  definition: BehaviouralModuleDefinition,
  index: number,
) => {
  const matchedGame = courseDetail?.games?.find((item) =>
    populatedGameMatchesModule(item.gameId, definition),
  );
  const fallbackGame = matchedGame ?? courseDetail?.games?.[index];
  const populatedGame = fallbackGame?.gameId as { _id?: string } | string | undefined;

  return typeof populatedGame === 'string'
    ? populatedGame
    : populatedGame && typeof populatedGame === 'object' && populatedGame._id
      ? String(populatedGame._id)
      : undefined;
};

const normalize = (value?: string | null) =>
  (value ?? '')
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

type BehaviouralSourceItem = Pick<
  CourseContentResponse['contentItems'][number],
  '_id' | 'description' | 'isFree' | 'order' | 'refId' | 'title' | 'type' | 'userStatus'
>;

function toBehaviouralItems(
  courseContent?: CourseContentResponse | null,
  courseDetail?: CourseDetailResponse | null,
): BehaviouralSourceItem[] {
  if (courseContent?.contentItems?.length) {
    return courseContent.contentItems;
  }

  if (courseDetail?.contentItems?.length) {
    return courseDetail.contentItems
      .filter((item) => item.type === 'game')
      .map((item) => ({
        _id: item._id,
        description: item.description,
        isFree: item.isFree ?? false,
        order: item.order,
        refId: item.refId,
        title: item.title,
        type: item.type,
        userStatus: item.userStatus,
      }));
  }

  return [];
}

export function buildBehaviouralModules(
  courseContent?: CourseContentResponse | null,
  courseDetail?: CourseDetailResponse | null,
): BehaviouralModuleCardData[] {
  const items = [...toBehaviouralItems(courseContent, courseDetail)]
    .filter((item) => item.type === 'game')
    .sort((left, right) => left.order - right.order);

  if (items.length === 0) {
    return moduleDefinitions.map((definition, index) => {
      const fallbackGameId = getCourseGameId(courseDetail, definition, index);

      return {
        description: definition.defaultDescription,
        gameId: fallbackGameId,
        imageSource: definition.icon,
        route: definition.route,
        sortOrder: definition.sortOrder,
        source: fallbackGameId ? 'backend' : 'fallback',
        status: 'not_started',
        title: definition.defaultTitle,
        tone: definition.tone,
        type: definition.key,
      };
    });
  }

  const unusedItems = [...items];

  const cards = moduleDefinitions.map((definition) => {
    const matchedIndex = unusedItems.findIndex((item) => {
      const haystack = `${normalize(item.title)} ${normalize(item.description)}`;

      return definition.keywords.some((keyword) => haystack.includes(keyword));
    });

    const matched =
      matchedIndex >= 0
        ? unusedItems.splice(matchedIndex, 1)[0]
        : unusedItems.length > 0
          ? unusedItems.splice(0, 1)[0]
          : undefined;

    return {
      contentItemId: matched?._id,
      description: matched?.description?.trim() || definition.defaultDescription,
      gameId: matched?.refId,
      imageSource: definition.icon,
      isFree: matched?.isFree,
      route: definition.route,
      sortOrder: matched?.order ?? definition.sortOrder,
      source: matched ? 'backend' : 'fallback',
      status: matched?.userStatus ?? 'not_started',
      title: matched?.title?.trim() || definition.defaultTitle,
      tone: definition.tone,
      type: definition.key,
    } satisfies BehaviouralModuleCardData;
  });

  return cards.sort((left, right) => left.sortOrder - right.sortOrder);
}

export function resolveBehaviouralModuleGameId(
  courseDetail: CourseDetailResponse | null | undefined,
  moduleType: BehaviouralModuleKey,
  currentGameId: string | undefined,
) {
  if (currentGameId) {
    return currentGameId;
  }

  const definitionIndex = moduleDefinitions.findIndex((item) => item.key === moduleType);

  if (definitionIndex < 0) {
    return undefined;
  }

  return getCourseGameId(courseDetail, moduleDefinitions[definitionIndex], definitionIndex);
}
