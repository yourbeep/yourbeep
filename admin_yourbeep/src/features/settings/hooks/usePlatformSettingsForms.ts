import { useEffect, useState } from "react";
import {
  createBannerForm,
  createDefaultFaqForm,
  createFooterForm,
  createGeneralForm,
  createLegalForm,
  createSeoForm,
} from "../services/platformSettingsApi";

export const usePlatformSettingsForms = (data) => {
  const [generalForm, setGeneralForm] = useState(createGeneralForm(data));
  const [bannerForm, setBannerForm] = useState(createBannerForm(data));
  const [footerForm, setFooterForm] = useState(createFooterForm(data));
  const [seoForm, setSeoForm] = useState(createSeoForm(data));
  const [legalForm, setLegalForm] = useState(createLegalForm(data));
  const [faqForm, setFaqForm] = useState(createDefaultFaqForm());
  const [editingFaqId, setEditingFaqId] = useState(null);

  useEffect(() => {
    setGeneralForm(createGeneralForm(data));
    setBannerForm(createBannerForm(data));
    setFooterForm(createFooterForm(data));
    setSeoForm(createSeoForm(data));
    setLegalForm(createLegalForm(data));
  }, [data]);

  const startCreateFaq = () => {
    setEditingFaqId(null);
    setFaqForm(createDefaultFaqForm());
  };

  const startEditFaq = (faq) => {
    setEditingFaqId(faq._id);
    setFaqForm({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      order: String(faq.order),
      isPublished: faq.isPublished,
    });
  };

  return {
    generalForm,
    setGeneralForm,
    bannerForm,
    setBannerForm,
    footerForm,
    setFooterForm,
    seoForm,
    setSeoForm,
    legalForm,
    setLegalForm,
    faqForm,
    setFaqForm,
    editingFaqId,
    setEditingFaqId,
    startCreateFaq,
    startEditFaq,
  };
};
