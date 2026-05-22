import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@store/index";
import {
  clearContactSuccessMessage,
  fetchPlatformSettings,
  submitContactRequest,
  type ContactRequestPayload,
} from "@store/slices/settings";
import ExtraPageShell from "../components/ExtraPageShell";
import MainButton from "@components/ui/MainButton";
import showToast from "@utils/showToast";

const contactTopics: Array<{ label: string; value: ContactRequestPayload["topic"] }> = [
  { label: "General support", value: "general_support" },
  { label: "Course access", value: "course_access" },
  { label: "Technical issue", value: "technical_issue" },
  { label: "Feedback", value: "feedback" },
  { label: "Partnership", value: "partnership" },
];

const fieldClassName =
  "w-full rounded-xl border border-[#dde3dc] bg-white px-4 py-3 text-sm text-[#173f53] outline-none transition focus:border-[#276b73]";

const ContactPage = () => {
  const dispatch = useAppDispatch();
  const { data, loading, submittingContact, contactSuccessMessage, error } = useAppSelector(
    (state) => state.settings,
  );
  const user = useAppSelector((state) => state.auth.user);
  const [form, setForm] = useState<ContactRequestPayload>({
    name: user?.fullName || "",
    email: user?.email || "",
    topic: "general_support",
    subject: "",
    message: "",
    phoneCountryCode: "+91",
  });

  useEffect(() => {
    setForm((current) => ({
      ...current,
      name: user?.fullName || current.name,
      email: user?.email || current.email,
    }));
  }, [user?.email, user?.fullName]);

  useEffect(() => {
    if (!data && !loading) {
      void dispatch(fetchPlatformSettings());
    }
  }, [data, dispatch, loading]);

  useEffect(() => {
    if (!contactSuccessMessage) return;

    showToast({
      type: "success",
      message: "Message sent",
      options: { description: contactSuccessMessage },
    });

    setForm((current) => ({
      ...current,
      subject: "",
      message: "",
      topic: "general_support",
    }));
    dispatch(clearContactSuccessMessage());
  }, [contactSuccessMessage, dispatch]);

  useEffect(() => {
    if (!error) return;

    showToast({
      type: "error",
      message: "Unable to complete request",
      options: { description: error },
    });
  }, [error]);

  return (
    <ExtraPageShell
      title="Get in touch"
      subtitle="Questions, support requests, or partnership ideas. Send us a note and we’ll get back to you."
    >
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1.2fr)_320px]">
        <section>
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              void dispatch(submitContactRequest(form));
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#18343a]">Full name</label>
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Jane Doe"
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#18343a]">Email address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="jane@example.com"
                  className={fieldClassName}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[140px_minmax(0,1fr)]">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#18343a]">Phone code</label>
                <input
                  value={form.phoneCountryCode ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, phoneCountryCode: event.target.value }))
                  }
                  placeholder="+91"
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#18343a]">Subject</label>
                <input
                  value={form.subject}
                  onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                  placeholder="How can we help?"
                  className={fieldClassName}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#18343a]">Topic</label>
              <select
                value={form.topic}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    topic: event.target.value as ContactRequestPayload["topic"],
                  }))
                }
                className={fieldClassName}
              >
                {contactTopics.map((topic) => (
                  <option key={topic.value} value={topic.value}>
                    {topic.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#18343a]">Message</label>
              <textarea
                value={form.message}
                onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                placeholder="Write your message here"
                className={`${fieldClassName} min-h-[180px] py-3`}
              />
            </div>

            <MainButton
              type="submit"
              isLoading={submittingContact}
              className="bg-[#143f56] text-white"
            >
              Send message
            </MainButton>
          </form>
        </section>

        <aside className="space-y-8 border-t border-[#e8ece7] pt-2 lg:border-l lg:border-t-0 lg:pl-10">
          <div>
            <h2 className="text-base font-semibold text-[#18343a]">Email</h2>
            <p className="mt-2 text-sm leading-7 text-[#62767b]">
              {data?.supportEmail || "support@yourbeep.com"}
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[#18343a]">Phone</h2>
            <p className="mt-2 text-sm leading-7 text-[#62767b]">
              {data?.supportPhone || data?.supportWhatsapp || "+91 support line"}
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[#18343a]">Location</h2>
            <p className="mt-2 text-sm leading-7 text-[#62767b]">
              {data?.contactAddress || "Bengaluru, India"}
            </p>
          </div>
        </aside>
      </div>
    </ExtraPageShell>
  );
};

export default ContactPage;
