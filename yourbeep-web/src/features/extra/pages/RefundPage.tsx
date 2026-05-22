import { useEffect } from "react";
import ExtraPageShell from "../components/ExtraPageShell";
import LegalDocumentView from "../components/LegalDocumentView";
import { useAppDispatch, useAppSelector } from "@store/index";
import { fetchLegalDocument, fetchPlatformSettings } from "@store/slices/settings";

const RefundPage = () => {
  const dispatch = useAppDispatch();
  const { data, legalDocs, legalLoading, loading } = useAppSelector((state) => state.settings);

  useEffect(() => {
    if (!data && !loading) {
      void dispatch(fetchPlatformSettings());
    }
    if (!legalDocs.refund && !legalLoading) {
      void dispatch(fetchLegalDocument("refund"));
    }
  }, [data, dispatch, legalDocs.refund, legalLoading, loading]);

  return (
    <ExtraPageShell
      title="Refund Policy"
      subtitle="We want your experience with YourBeep to feel clear and fair. This page outlines how refunds, cancellations, and access changes are handled across the platform."
    >
      <LegalDocumentView
        document={legalDocs.refund}
        loading={legalLoading && !legalDocs.refund}
        fallbackTitle="Refund Policy"
      />
    </ExtraPageShell>
  );
};

export default RefundPage;
