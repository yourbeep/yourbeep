import { router } from 'expo-router';

import {
  buildCurrentSomaticRegion,
  buildSomaticSubmissionPayload,
  collectCompletedSomaticRegions,
} from '@/features/somatic/utils/somatic-submission';
import {
  resetCurrentSomaticRegion,
  setSomaticSubmissionState,
  upsertCompletedSomaticRegion,
} from '@/features/somatic/store/somatic-slice';
import { submitGame } from '@/lib/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export function useCompleteSomaticRegion() {
  const dispatch = useAppDispatch();
  const somaticState = useAppSelector((state) => state.somatic);

  const completeCurrentRegion = async () => {
    if (somaticState.submissionState === 'submitting') {
      return false;
    }

    const currentRegion = buildCurrentSomaticRegion(somaticState);

    if (!somaticState.selectedRegion || !currentRegion) {
      dispatch(
        setSomaticSubmissionState({
          message: 'Somatic region details are incomplete. Please select the region again.',
          status: 'error',
        }),
      );
      router.replace('/somatic-states');
      return false;
    }

    dispatch(
      upsertCompletedSomaticRegion({
        regionKey: somaticState.selectedRegion,
        value: currentRegion,
      }),
    );

    const nextCompletedRegions = collectCompletedSomaticRegions({
      ...somaticState.completedRegions,
      [somaticState.selectedRegion]: currentRegion,
    });

    if (!somaticState.courseId || !somaticState.gameId) {
      dispatch(
        setSomaticSubmissionState({
          message:
            'Somatic region saved locally. Backend course context is missing for this flow.',
          status: 'success',
        }),
      );
      dispatch(resetCurrentSomaticRegion());
      router.replace('/somatic-states');
      return true;
    }

    dispatch(setSomaticSubmissionState({ status: 'submitting' }));

    try {
      await submitGame(
        somaticState.gameId,
        buildSomaticSubmissionPayload(somaticState.courseId, nextCompletedRegions),
      );

      dispatch(
        setSomaticSubmissionState({
          message: 'Somatic state saved to your course activity.',
          status: 'success',
        }),
      );
    } catch (error) {
      dispatch(
        setSomaticSubmissionState({
          message:
            error instanceof Error && error.message
              ? `Somatic region saved locally. Course sync failed: ${error.message}`
              : 'Somatic region saved locally. Course sync is unavailable right now.',
          status: 'success',
        }),
      );
    }

    dispatch(resetCurrentSomaticRegion());
    router.replace('/somatic-states');
    return true;
  };

  return {
    completeCurrentRegion,
    submissionState: somaticState.submissionState,
  };
}
