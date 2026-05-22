import { useEffect } from "react";
import ExtraPageShell from "../components/ExtraPageShell";
import LegalDocumentView from "../components/LegalDocumentView";
import { useAppDispatch, useAppSelector } from "@store/index";
import { fetchLegalDocument, fetchPlatformSettings } from "@store/slices/settings";

const TermsPage = () => {
  const dispatch = useAppDispatch();
  const { data, legalDocs, legalLoading, loading } = useAppSelector((state) => state.settings);

  useEffect(() => {
    if (!data && !loading) {
      void dispatch(fetchPlatformSettings());
    }
    if (!legalDocs.terms && !legalLoading) {
      void dispatch(fetchLegalDocument("terms"));
    }
  }, [data, dispatch, legalDocs.terms, legalLoading, loading]);

  return (
    <ExtraPageShell
      title="Terms & Conditions"
      subtitle="We believe in building a sanctuary based on transparency and trust. These terms outline the ethical code and participation guidelines for the YourBeep learning ecosystem."
    >
      <LegalDocumentView
        document={legalDocs.terms}
        loading={legalLoading && !legalDocs.terms}
        fallbackTitle="Terms & Conditions"
      />
    </ExtraPageShell>
  );
};

export default TermsPage;
