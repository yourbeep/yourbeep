import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { SomaticRegion } from '@/lib/api/types';

export type HeadSensationId =
  | 'brightness-clear-focus'
  | 'dizzy-spacey'
  | 'heaviness-fog';

export type FaceThroatSensationId =
  | 'relaxed-bright'
  | 'subtle-tension'
  | 'excessive-clench';

export type HeartStateId =
  | 'increasing-pulse'
  | 'release'
  | 'steady-heart'
  | 'pounding-heart'
  | 'heart-ache';

export type ChestStateId = 'calm' | 'unrest' | 'spiral' | 'tightness';
export type StomachStateId = 'butterflies' | 'whirlpool' | 'armour';
export type HandsLegsStateId =
  | 'calm'
  | 'springy'
  | 'braced'
  | 'sluggish'
  | 'contracted'
  | 'fidgety';
export type ChestBreathDominance = 'upper-chest' | 'belly';
export type ChestTightnessIntensity = 'trace' | 'mild' | 'moderate' | 'severe';
export type StomachBracingGroup = 'abdominal-scan' | 'belly-softening' | 'gut-reaction';
export type StomachBracingSignalId =
  | 'space'
  | 'tension'
  | 'neutral'
  | 'braced'
  | 'release'
  | 'tighten';

export interface SomaticSubmissionActivity {
  activityKey: string;
  completed: boolean;
  durationSeconds?: number;
  response?: unknown;
  skipped: boolean;
}

export interface SomaticCompletedRegion {
  activities: SomaticSubmissionActivity[];
  region: 'head' | 'face_throat' | 'heart' | 'chest' | 'stomach' | 'hands_legs';
  sensation: string;
}

export type SomaticSubmissionState = 'idle' | 'submitting' | 'success' | 'error';

export interface SomaticState {
  chestBreathDominance: ChestBreathDominance;
  chestTightnessIntensity: ChestTightnessIntensity;
  cognitiveCheckSeconds: number;
  co2IndicatorSeconds: number;
  completedRegions: Partial<Record<SomaticRegion, SomaticCompletedRegion>>;
  completedAnchors: {
    audio: boolean;
    ground: boolean;
    visual: boolean;
  };
  courseId?: string;
  gameId?: string;
  selectedChestState: ChestStateId | null;
  selectedFaceThroatSensation: FaceThroatSensationId | null;
  selectedHeadSensation: HeadSensationId | null;
  selectedHandsLegsState: HandsLegsStateId | null;
  selectedHeartState: HeartStateId | null;
  selectedRegion: SomaticRegion | null;
  selectedStomachState: StomachStateId | null;
  stomachBracingSelections: Record<StomachBracingGroup, StomachBracingSignalId | null>;
  submissionMessage: string | null;
  submissionState: SomaticSubmissionState;
  visualStillnessPosition: {
    x: number;
    y: number;
  };
}

const createRegionState = (): Pick<
  SomaticState,
  | 'chestBreathDominance'
  | 'chestTightnessIntensity'
  | 'cognitiveCheckSeconds'
  | 'co2IndicatorSeconds'
  | 'completedAnchors'
  | 'selectedChestState'
  | 'selectedFaceThroatSensation'
  | 'selectedHeadSensation'
  | 'selectedHandsLegsState'
  | 'selectedHeartState'
  | 'selectedRegion'
  | 'selectedStomachState'
  | 'stomachBracingSelections'
  | 'visualStillnessPosition'
> => ({
  chestBreathDominance: 'upper-chest',
  chestTightnessIntensity: 'moderate',
  cognitiveCheckSeconds: 60,
  co2IndicatorSeconds: 60,
  completedAnchors: {
    audio: true,
    ground: false,
    visual: false,
  },
  selectedChestState: null,
  selectedFaceThroatSensation: null,
  selectedHeadSensation: null,
  selectedHandsLegsState: null,
  selectedHeartState: null,
  selectedRegion: null,
  selectedStomachState: null,
  stomachBracingSelections: {
    'abdominal-scan': null,
    'belly-softening': null,
    'gut-reaction': null,
  },
  visualStillnessPosition: {
    x: 0,
    y: 0,
  },
});

const initialState: SomaticState = {
  ...createRegionState(),
  completedRegions: {},
  courseId: undefined,
  gameId: undefined,
  submissionMessage: null,
  submissionState: 'idle',
};

const somaticSlice = createSlice({
  name: 'somatic',
  initialState,
  reducers: {
    resetSomaticFlow: () => initialState,
    resetCurrentSomaticRegion: (state) => {
      Object.assign(state, {
        ...createRegionState(),
        completedRegions: state.completedRegions,
        courseId: state.courseId,
        gameId: state.gameId,
        submissionMessage: state.submissionMessage,
        submissionState: state.submissionState,
      });
    },
    setSomaticCourseContext: (
      state,
      action: PayloadAction<{ courseId?: string; gameId?: string }>,
    ) => {
      state.courseId = action.payload.courseId;
      state.gameId = action.payload.gameId;
    },
    selectHeadSensation: (state, action: PayloadAction<HeadSensationId>) => {
      state.selectedHeadSensation = action.payload;
    },
    selectHandsLegsState: (state, action: PayloadAction<HandsLegsStateId>) => {
      state.selectedHandsLegsState = action.payload;
    },
    selectFaceThroatSensation: (state, action: PayloadAction<FaceThroatSensationId>) => {
      state.selectedFaceThroatSensation = action.payload;
    },
    selectHeartState: (state, action: PayloadAction<HeartStateId>) => {
      state.selectedHeartState = action.payload;
    },
    selectChestState: (state, action: PayloadAction<ChestStateId>) => {
      state.selectedChestState = action.payload;
    },
    selectStomachState: (state, action: PayloadAction<StomachStateId>) => {
      state.selectedStomachState = action.payload;
    },
    selectRegion: (state, action: PayloadAction<SomaticRegion>) => {
      state.selectedRegion = action.payload;
    },
    upsertCompletedSomaticRegion: (
      state,
      action: PayloadAction<{ regionKey: SomaticRegion; value: SomaticCompletedRegion }>,
    ) => {
      state.completedRegions[action.payload.regionKey] = action.payload.value;
    },
    setSomaticSubmissionState: (
      state,
      action: PayloadAction<{
        message?: string | null;
        status: SomaticSubmissionState;
      }>,
    ) => {
      state.submissionMessage = action.payload.message ?? null;
      state.submissionState = action.payload.status;
    },
    clearSomaticSubmissionState: (state) => {
      state.submissionMessage = null;
      state.submissionState = 'idle';
    },
    setStomachBracingSelection: (
      state,
      action: PayloadAction<{
        group: StomachBracingGroup;
        value: StomachBracingSignalId;
      }>,
    ) => {
      state.stomachBracingSelections[action.payload.group] = action.payload.value;
    },
    setChestBreathDominance: (state, action: PayloadAction<ChestBreathDominance>) => {
      state.chestBreathDominance = action.payload;
    },
    setChestTightnessIntensity: (state, action: PayloadAction<ChestTightnessIntensity>) => {
      state.chestTightnessIntensity = action.payload;
    },
    setCognitiveCheckSeconds: (state, action: PayloadAction<number>) => {
      state.cognitiveCheckSeconds = action.payload;
    },
    setCo2IndicatorSeconds: (state, action: PayloadAction<number>) => {
      state.co2IndicatorSeconds = action.payload;
    },
    setVisualStillnessPosition: (
      state,
      action: PayloadAction<SomaticState['visualStillnessPosition']>,
    ) => {
      state.visualStillnessPosition = action.payload;
    },
    toggleCompletedAnchor: (
      state,
      action: PayloadAction<keyof SomaticState['completedAnchors']>,
    ) => {
      const key = action.payload;
      state.completedAnchors[key] = !state.completedAnchors[key];
    },
  },
});

export const {
  clearSomaticSubmissionState,
  resetSomaticFlow,
  resetCurrentSomaticRegion,
  selectChestState,
  selectFaceThroatSensation,
  selectHeadSensation,
  selectHandsLegsState,
  selectHeartState,
  selectStomachState,
  selectRegion,
  setSomaticCourseContext,
  setSomaticSubmissionState,
  setStomachBracingSelection,
  setChestBreathDominance,
  setChestTightnessIntensity,
  setCognitiveCheckSeconds,
  setCo2IndicatorSeconds,
  setVisualStillnessPosition,
  toggleCompletedAnchor,
  upsertCompletedSomaticRegion,
} = somaticSlice.actions;

export const somaticReducer = somaticSlice.reducer;
