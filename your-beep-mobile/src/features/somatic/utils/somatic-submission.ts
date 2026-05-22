import type { SubmitGameInput, SomaticRegion } from '@/lib/api/types';
import type {
  SomaticCompletedRegion,
  SomaticState,
  SomaticSubmissionActivity,
} from '@/features/somatic/store/somatic-slice';

function buildActivity(
  activityKey: string,
  options?: {
    durationSeconds?: number;
    response?: unknown;
    skipped?: boolean;
  },
): SomaticSubmissionActivity {
  return {
    activityKey,
    completed: !options?.skipped,
    durationSeconds: options?.durationSeconds,
    response: options?.response,
    skipped: options?.skipped ?? false,
  };
}

function buildHeadRegion(state: SomaticState): SomaticCompletedRegion | null {
  if (!state.selectedHeadSensation) {
    return null;
  }

  if (state.selectedHeadSensation === 'brightness-clear-focus') {
    return {
      activities: [
        buildActivity('60_second_cognitive_check'),
        buildActivity('expand_the_window'),
      ],
      region: 'head',
      sensation: 'bright_clear_focus',
    };
  }

  if (state.selectedHeadSensation === 'dizzy-spacey') {
    return {
      activities: [
        buildActivity('co2_indicator'),
        buildActivity('co2_rebalancing'),
        buildActivity('sensory_anchoring', {
          response: {
            anchors: state.completedAnchors,
            focusPoint: state.visualStillnessPosition,
          },
        }),
      ],
      region: 'head',
      sensation: 'dizzy_spacey',
    };
  }

  return {
    activities: [
      buildActivity('flexibility_check'),
      buildActivity('cognitive_diffusion_drill'),
      buildActivity('fatigue_check'),
    ],
    region: 'head',
    sensation: 'heaviness_fog',
  };
}

function buildFaceThroatRegion(state: SomaticState): SomaticCompletedRegion | null {
  if (!state.selectedFaceThroatSensation) {
    return null;
  }

  if (state.selectedFaceThroatSensation === 'relaxed-bright') {
    return {
      activities: [],
      region: 'face_throat',
      sensation: 'relaxed_bright',
    };
  }

  return {
    activities: [
      buildActivity('clench_detection_drill'),
      buildActivity('jaw_awareness_reset'),
      buildActivity('throat_openness_check'),
      buildActivity('belly_breathing'),
      buildActivity('neck_release_awareness'),
      buildActivity('shoulder_drop'),
    ],
    region: 'face_throat',
    sensation:
      state.selectedFaceThroatSensation === 'subtle-tension'
        ? 'subtle_tension'
        : 'excessive_clench',
  };
}

function buildHeartRegion(state: SomaticState): SomaticCompletedRegion | null {
  if (!state.selectedHeartState) {
    return null;
  }

  if (state.selectedHeartState === 'steady-heart') {
    return {
      activities: [buildActivity('baseline_pulse_awareness')],
      region: 'heart',
      sensation: 'steady_heart_integration',
    };
  }

  if (state.selectedHeartState === 'increasing-pulse') {
    return {
      activities: [
        buildActivity('activation_differentiation_test'),
        buildActivity('coherence_breathing'),
      ],
      region: 'heart',
      sensation: 'increasing_pulse_activation',
    };
  }

  if (state.selectedHeartState === 'release') {
    return {
      activities: [
        buildActivity('expansion_allowance'),
        buildActivity('sternum_pec_stretch'),
      ],
      region: 'heart',
      sensation: 'the_release_expansion',
    };
  }

  if (state.selectedHeartState === 'pounding-heart') {
    return {
      activities: [
        buildActivity('activation_differentiation_test'),
        buildActivity('coherence_breathing'),
        buildActivity('shoulder_neck_stretch'),
      ],
      region: 'heart',
      sensation: 'pounding_heart_waver',
    };
  }

  return {
    activities: [
      buildActivity('expansion_allowance'),
      buildActivity('sternum_pec_stretch'),
    ],
    region: 'heart',
    sensation: 'heart_ache_chaos',
  };
}

function buildChestRegion(state: SomaticState): SomaticCompletedRegion | null {
  if (!state.selectedChestState) {
    return null;
  }

  if (state.selectedChestState === 'calm') {
    return {
      activities: [
        buildActivity('diaphragmatic_baseline_check', {
          response: state.chestBreathDominance,
        }),
        buildActivity('360_breathing'),
      ],
      region: 'chest',
      sensation: 'calm',
    };
  }

  if (state.selectedChestState === 'unrest' || state.selectedChestState === 'spiral') {
    return {
      activities: [buildActivity('co2_check'), buildActivity('breath_hold_exercise')],
      region: 'chest',
      sensation: state.selectedChestState,
    };
  }

  return {
    activities: [
      buildActivity('chest_tightness_vulnerability_check', {
        response: state.chestTightnessIntensity,
      }),
      buildActivity('light_shoulder_arm_movements'),
      buildActivity('lie_on_bed_head_back'),
      buildActivity('sternum_pec_stretch'),
    ],
    region: 'chest',
    sensation: 'tightness',
  };
}

function buildStomachRegion(state: SomaticState): SomaticCompletedRegion | null {
  if (!state.selectedStomachState) {
    return null;
  }

  if (state.selectedStomachState === 'butterflies') {
    return {
      activities: [
        buildActivity('belly_softening'),
      ],
      region: 'stomach',
      sensation: 'butterflies',
    };
  }

  return {
    activities: [
      buildActivity('abdominal_scan', {
        response: state.stomachBracingSelections['abdominal-scan'],
      }),
      buildActivity('belly_softening', {
        response: state.stomachBracingSelections['belly-softening'],
      }),
      buildActivity('safety_cue'),
      buildActivity('gut_reaction', {
        response: state.stomachBracingSelections['gut-reaction'],
      }),
    ],
    region: 'stomach',
    sensation: state.selectedStomachState,
  };
}

function buildHandsLegsRegion(state: SomaticState): SomaticCompletedRegion | null {
  if (!state.selectedHandsLegsState) {
    return null;
  }

  if (state.selectedHandsLegsState === 'calm' || state.selectedHandsLegsState === 'springy') {
    return {
      activities: [buildActivity('grounding_drill')],
      region: 'hands_legs',
      sensation: state.selectedHandsLegsState,
    };
  }

  if (state.selectedHandsLegsState === 'sluggish') {
    return {
      activities: [buildActivity('freeze_check'), buildActivity('rhythmic_grounding')],
      region: 'hands_legs',
      sensation: 'sluggish',
    };
  }

  if (state.selectedHandsLegsState === 'fidgety') {
    return {
      activities: [
        buildActivity('fist_clench_release'),
        buildActivity('shoulder_drop'),
      ],
      region: 'hands_legs',
      sensation: 'fidgety',
    };
  }

  return {
    activities: [
      buildActivity('fist_clench_release'),
      buildActivity('shoulder_drop'),
      buildActivity('proprioception_grounding'),
    ],
    region: 'hands_legs',
    sensation: state.selectedHandsLegsState,
  };
}

export function buildCurrentSomaticRegion(state: SomaticState): SomaticCompletedRegion | null {
  switch (state.selectedRegion) {
    case 'head':
      return buildHeadRegion(state);
    case 'face-throat':
      return buildFaceThroatRegion(state);
    case 'heart':
      return buildHeartRegion(state);
    case 'chest':
      return buildChestRegion(state);
    case 'stomach':
      return buildStomachRegion(state);
    case 'hands-legs':
      return buildHandsLegsRegion(state);
    default:
      return null;
  }
}

export function collectCompletedSomaticRegions(
  completedRegions: Partial<Record<SomaticRegion, SomaticCompletedRegion>>,
): SomaticCompletedRegion[] {
  return Object.values(completedRegions).filter(
    (value): value is SomaticCompletedRegion => Boolean(value),
  );
}

export function buildSomaticSubmissionPayload(
  courseId: string,
  regions: SomaticCompletedRegion[],
): SubmitGameInput {
  return {
    courseId,
    payload: {
      regions: regions.map((region) => ({
        activities: region.activities,
        region: region.region,
        sensation: region.sensation,
      })),
    },
    type: 'somatic_states',
  };
}
