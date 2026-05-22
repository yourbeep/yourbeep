import { apiRequest } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { LegalDocument, PlatformSettings } from '@/lib/api/types';

export function fetchPlatformSettings() {
  return apiRequest<PlatformSettings>(apiEndpoints.platform.settings);
}

export function fetchTermsOfService() {
  return apiRequest<LegalDocument>(apiEndpoints.platform.terms);
}

export function fetchPrivacyPolicy() {
  return apiRequest<LegalDocument>(apiEndpoints.platform.privacy);
}

export function fetchRefundPolicy() {
  return apiRequest<LegalDocument>(apiEndpoints.platform.refund);
}

export function fetchCookiePolicy() {
  return apiRequest<LegalDocument>(apiEndpoints.platform.cookies);
}

export function fetchCommunityGuidelines() {
  return apiRequest<LegalDocument>(apiEndpoints.platform.communityGuidelines);
}
