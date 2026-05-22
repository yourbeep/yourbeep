import { useEffect } from "react";
import ExtraPageShell from "../components/ExtraPageShell";
import LegalDocumentView from "../components/LegalDocumentView";
import { useAppDispatch, useAppSelector } from "@store/index";
import { fetchLegalDocument, fetchPlatformSettings } from "@store/slices/settings";

const PrivacyPage = () => {
  const dispatch = useAppDispatch();
  const { data, legalDocs, legalLoading, loading } = useAppSelector((state) => state.settings);

  useEffect(() => {
    if (!data && !loading) {
      void dispatch(fetchPlatformSettings());
    }
    if (!legalDocs.privacy && !legalLoading) {
      void dispatch(fetchLegalDocument("privacy"));
    }
  }, [data, dispatch, legalDocs.privacy, legalLoading, loading]);

  return (
    <ExtraPageShell
      title="Privacy Policy"
      subtitle="Your reflection journey deserves both care and confidentiality. This page explains how YourBeep collects, safeguards, and uses your information across the platform."
    >
      <LegalDocumentView
        document={legalDocs.privacy}
        loading={legalLoading && !legalDocs.privacy}
        fallbackTitle="Privacy Policy"
      />
    </ExtraPageShell>
  );
};

export default PrivacyPage;
