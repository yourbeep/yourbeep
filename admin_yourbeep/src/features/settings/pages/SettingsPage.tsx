import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  createPlatformFaq,
  deletePlatformFaq,
  fetchPlatformSettings,
  updatePlatformFaq,
  updatePlatformSettings,
} from "../../../store/slices/settings";
import { showToast } from "../../../utils/showToast";
import FaqManager from "../components/FaqManager";
import FooterSeoForm from "../components/FooterSeoForm";
import GeneralSettingsForm from "../components/GeneralSettingsForm";
import HomeBannerForm from "../components/HomeBannerForm";
import LegalDocumentsForm from "../components/LegalDocumentsForm";
import SettingsPageSkeleton from "../components/SettingsPageSkeleton";
import SettingsSidePanel from "../components/SettingsSidePanel";
import { usePlatformSettingsForms } from "../hooks/usePlatformSettingsForms";

function getPublicSiteBaseUrl() {
  return (
    import.meta.env.VITE_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "")
  );
}

function normalizeOptionalUrl(value?: string) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  try {
    return new URL(trimmed).toString();
  } catch {
    const baseUrl = getPublicSiteBaseUrl();
    if (!baseUrl) {
      return trimmed;
    }

    try {
      return new URL(trimmed, baseUrl).toString();
    } catch {
      return trimmed;
    }
  }
}

const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const { data, loading, mutating, error } = useAppSelector(
    (state) => state.settings,
  );
  const forms = usePlatformSettingsForms(data);
  const sectionItems = [
    {
      id: "platform-general",
      label: "General",
      helper: "Brand identity, support, and public-facing app links.",
    },
    {
      id: "platform-banner",
      label: "Home Banner",
      helper: "Hero copy, artwork, trust badge, and CTA links.",
    },
    {
      id: "platform-footer",
      label: "Footer & SEO",
      helper: "Footer links, copy, and default metadata values.",
    },
    {
      id: "platform-legal",
      label: "Legal",
      helper: "Terms, privacy, refund, cookie, and guidelines content.",
    },
    {
      id: "platform-faq",
      label: "FAQ",
      helper: "Common questions and ordered help content for the site.",
    },
  ];

  useEffect(() => {
    if (!data && !loading) {
      dispatch(fetchPlatformSettings());
    }
  }, [data, dispatch, loading]);

  if (loading && !data) {
    return <SettingsPageSkeleton />;
  }

  const persistSettings = async (
    payload: Record<string, unknown>,
    successMessage: string,
    successDescription: string,
    errorMessage: string,
  ) => {
    const loadingToastId = showToast({
      type: "loading",
      message: "Saving settings...",
      options: {
        description: "Please wait while your changes are being updated.",
      },
    });

    try {
      await dispatch(updatePlatformSettings(payload)).unwrap();
      showToast({
        type: "success",
        message: successMessage,
        options: {
          id: loadingToastId,
          description: successDescription,
        },
      });
    } catch (saveError) {
      const description =
        typeof saveError === "string" ? saveError : "Unable to save settings.";
      showToast({
        type: "error",
        message: errorMessage,
        options: {
          id: loadingToastId,
          description,
          duration: 5000,
        },
      });
    }
  };

  const saveGeneral = () =>
    persistSettings(
      {
        platformName: forms.generalForm.platformName,
        supportEmail: forms.generalForm.supportEmail || undefined,
        supportPhone: forms.generalForm.supportPhone || undefined,
        supportWhatsapp: forms.generalForm.supportWhatsapp || undefined,
        contactAddress: forms.generalForm.contactAddress || undefined,
        socialLinks: {
          instagram: normalizeOptionalUrl(forms.generalForm.instagram),
          youtube: normalizeOptionalUrl(forms.generalForm.youtube),
          linkedin: normalizeOptionalUrl(forms.generalForm.linkedin),
          x: normalizeOptionalUrl(forms.generalForm.x),
        },
        appLinks: {
          iosAppUrl: normalizeOptionalUrl(forms.generalForm.iosAppUrl),
          androidAppUrl: normalizeOptionalUrl(forms.generalForm.androidAppUrl),
          webAppUrl: normalizeOptionalUrl(forms.generalForm.webAppUrl),
        },
      },
      "General settings saved.",
      "Platform identity and support details were updated successfully.",
      "General settings could not be saved.",
    );

  const saveBanner = () =>
    persistSettings(
      {
        homeBanner: {
          eyebrow: forms.bannerForm.eyebrow || undefined,
          title: forms.bannerForm.title,
          subtitle: forms.bannerForm.subtitle || undefined,
          announcementText: forms.bannerForm.announcementText || undefined,
          primaryCtaLabel: forms.bannerForm.primaryCtaLabel || undefined,
          primaryCtaUrl: normalizeOptionalUrl(forms.bannerForm.primaryCtaUrl),
          secondaryCtaLabel: forms.bannerForm.secondaryCtaLabel || undefined,
          secondaryCtaUrl: normalizeOptionalUrl(forms.bannerForm.secondaryCtaUrl),
          desktopImageUrl: normalizeOptionalUrl(forms.bannerForm.desktopImageUrl),
          mobileImageUrl: normalizeOptionalUrl(forms.bannerForm.mobileImageUrl),
          backgroundVariant: forms.bannerForm.backgroundVariant,
          trustBadgeText: forms.bannerForm.trustBadgeText || undefined,
        },
      },
      "Home banner saved.",
      "Banner content, artwork, and CTAs were updated successfully.",
      "Home banner could not be saved.",
    );

  const saveFooterSeo = () =>
    persistSettings(
      {
        footer: {
          tagline: forms.footerForm.tagline || undefined,
          copyrightText: forms.footerForm.copyrightText || undefined,
          links: forms.footerForm.links
            .filter((link) => link.label.trim() && link.url.trim())
            .map((link) => ({
              label: link.label.trim(),
              url: normalizeOptionalUrl(link.url) || link.url.trim(),
            })),
        },
        seo: {
          defaultTitle: forms.seoForm.defaultTitle || undefined,
          defaultDescription: forms.seoForm.defaultDescription || undefined,
        },
      },
      "Footer and SEO saved.",
      "Footer content and metadata defaults were updated successfully.",
      "Footer and SEO settings could not be saved.",
    );

  const saveLegal = () =>
    persistSettings(
      {
        legal: {
          termsOfService: forms.legalForm.termsOfService || undefined,
          privacyPolicy: forms.legalForm.privacyPolicy || undefined,
          refundPolicy: forms.legalForm.refundPolicy || undefined,
          cookiePolicy: forms.legalForm.cookiePolicy || undefined,
          communityGuidelines: forms.legalForm.communityGuidelines || undefined,
        },
      },
      "Legal content saved.",
      "Legal documents were updated successfully.",
      "Legal content could not be saved.",
    );

  const submitFaq = () => {
    const payload = {
      category: forms.faqForm.category,
      question: forms.faqForm.question,
      answer: forms.faqForm.answer,
      order: Number(forms.faqForm.order),
      isPublished: forms.faqForm.isPublished,
    };

    if (forms.editingFaqId) {
      dispatch(updatePlatformFaq({ faqId: forms.editingFaqId, payload }));
      return;
    }

    dispatch(createPlatformFaq(payload));
  };

  const saveFaqOrder = async (reorderedFaqs) => {
    const updates = reorderedFaqs
      .map((faq, index) => {
        const nextOrder = index + 1;

        if (faq.order === nextOrder) {
          return null;
        }

        return dispatch(
          updatePlatformFaq({
            faqId: faq._id,
            payload: {
              category: faq.category,
              question: faq.question,
              answer: faq.answer,
              order: nextOrder,
              isPublished: faq.isPublished,
            },
          }),
        ).unwrap();
      })
      .filter(Boolean);

    if (updates.length) {
      await Promise.all(updates);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-[#f3e2b4] bg-[#fff9ea] px-4 py-3 text-sm text-[#9a7a19]">
          Platform settings could not be fully refreshed: {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <SettingsSidePanel items={sectionItems} />

        <div className="space-y-6">
          <div id="platform-general" className="scroll-mt-28">
            <GeneralSettingsForm
              form={forms.generalForm}
              setForm={forms.setGeneralForm}
              onSave={saveGeneral}
              loading={mutating}
            />
          </div>

          <div id="platform-banner" className="scroll-mt-28">
            <HomeBannerForm
              form={forms.bannerForm}
              setForm={forms.setBannerForm}
              onSave={saveBanner}
              loading={mutating}
            />
          </div>

          <div id="platform-footer" className="scroll-mt-28">
            <FooterSeoForm
              footerForm={forms.footerForm}
              setFooterForm={forms.setFooterForm}
              seoForm={forms.seoForm}
              setSeoForm={forms.setSeoForm}
              onSave={saveFooterSeo}
              loading={mutating}
            />
          </div>

          <div id="platform-legal" className="scroll-mt-28">
            <LegalDocumentsForm
              form={forms.legalForm}
              setForm={forms.setLegalForm}
              onSave={saveLegal}
              loading={mutating}
            />
          </div>

          <div id="platform-faq" className="scroll-mt-28">
            <FaqManager
              faqItems={data?.faqItems ?? []}
              faqForm={forms.faqForm}
              setFaqForm={forms.setFaqForm}
              editingFaqId={forms.editingFaqId}
              onStartCreate={forms.startCreateFaq}
              onStartEdit={forms.startEditFaq}
              onSubmit={submitFaq}
              onDelete={(faqId) => dispatch(deletePlatformFaq(faqId))}
              onReorder={saveFaqOrder}
              loading={mutating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
