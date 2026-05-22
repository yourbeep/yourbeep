import { apiRequest } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import {
  ActivationCheckInPayload,
  ExpansionCheckInPayload,
  RootCauseSelectionPayload,
  ValueSystemSelectionPayload,
} from '@/lib/api/types';

export function submitActivationCheckIn(payload: ActivationCheckInPayload) {
  return apiRequest<void>(apiEndpoints.checkIns.activation, {
    body: payload,
    method: 'POST',
  });
}

export function submitExpansionCheckIn(payload: ExpansionCheckInPayload) {
  return apiRequest<void>(apiEndpoints.checkIns.expansion, {
    body: payload,
    method: 'POST',
  });
}

export function submitValueSystemSelections(payload: ValueSystemSelectionPayload) {
  return apiRequest<void>(apiEndpoints.checkIns.valueSystems, {
    body: payload,
    method: 'POST',
  });
}

export function submitRootCauseSelections(payload: RootCauseSelectionPayload) {
  return apiRequest<void>(apiEndpoints.checkIns.rootCauses, {
    body: payload,
    method: 'POST',
  });
}
