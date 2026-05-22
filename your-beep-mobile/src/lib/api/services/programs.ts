import { apiRequest } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { ProgramSummary } from '@/lib/api/types';

export function fetchPrograms() {
  return apiRequest<ProgramSummary[]>(apiEndpoints.programs.list);
}

export function fetchProgram(programId: string) {
  return apiRequest<ProgramSummary>(apiEndpoints.programs.detail(programId));
}

export function fetchMasterclasses() {
  return apiRequest<ProgramSummary[]>(apiEndpoints.lms.masterclasses);
}
