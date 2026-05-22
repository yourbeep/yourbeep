import { useEffect, useMemo, useState } from "react";

const createInitialState = () => ({
  title: "",
  body: "",
  imageUrl: "",
  type: "admin_broadcast",
  audienceType: "all_users",
  courseId: "",
  userIdsText: "",
  regionsText: "",
  dataText: "",
  sendNow: false,
});

export const useNotificationCampaignForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [form, setForm] = useState(createInitialState());

  const openCreate = () => {
    setEditingCampaign(null);
    setForm(createInitialState());
    setIsOpen(true);
  };

  const openEdit = (campaign) => {
    setEditingCampaign(campaign);
    setForm({
      title: campaign.title || "",
      body: campaign.body || "",
      imageUrl: campaign.imageUrl || "",
      type: campaign.type || "admin_broadcast",
      audienceType: campaign.audience?.type || "all_users",
      courseId: campaign.audience?.courseId || "",
      userIdsText: Array.isArray(campaign.audience?.userIds)
        ? campaign.audience.userIds.join(", ")
        : "",
      regionsText: Array.isArray(campaign.audience?.regions)
        ? campaign.audience.regions.join(", ")
        : "",
      dataText:
        campaign.data && Object.keys(campaign.data).length
          ? JSON.stringify(campaign.data, null, 2)
          : "",
      sendNow: false,
    });
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setEditingCampaign(null);
  };

  const parsedData = useMemo(() => {
    if (!form.dataText.trim()) {
      return {};
    }

    try {
      const parsed = JSON.parse(form.dataText);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return null;
    }
  }, [form.dataText]);

  const payload = useMemo(() => {
    const audience = {
      type: form.audienceType,
      ...(form.courseId.trim() ? { courseId: form.courseId.trim() } : {}),
      userIds: form.userIdsText
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      regions: form.regionsText
        .split(",")
        .map((value) => value.trim().toUpperCase())
        .filter(Boolean),
    };

    return {
      title: form.title.trim(),
      body: form.body.trim(),
      ...(form.imageUrl.trim() ? { imageUrl: form.imageUrl.trim() } : {}),
      type: form.type,
      audience,
      ...(parsedData && Object.keys(parsedData).length ? { data: parsedData } : {}),
      ...(editingCampaign ? {} : { sendNow: form.sendNow }),
    };
  }, [editingCampaign, form, parsedData]);

  return {
    isOpen,
    editingCampaign,
    form,
    setForm,
    openCreate,
    openEdit,
    close,
    payload,
    dataIsValid: parsedData !== null,
    parsedData,
  };
};
