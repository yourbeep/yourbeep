import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { fetchPlatformSettings } from "@store/slices/settings";
import { useAppDispatch, useAppSelector } from "@store";

const fallbackFaqs = [
  {
    question: "What courses are available on YourBeep?",
    answer:
      "We offer a wide range of courses in various subjects including programming, design, business, and more. Check our course catalog for details.",
  },
  {
    question: "Do I need an account to access content?",
    answer:
      "Yes, creating an account allows you to enroll in courses, track progress, and access personalized recommendations.",
  },
  {
    question: "Is there a mobile app for YourBeep?",
    answer:
      "Yes, our app is available on iOS and Android. Download it to learn on the go with the same features as the web version.",
  },
  {
    question: "Can I cancel my course enrollment?",
    answer:
      "Yes, you can unenroll from courses at any time through your dashboard. Refunds may apply based on our policy.",
  },
  {
    question: "What subjects and skills are covered?",
    answer:
      "We cover over 50 subjects including technology, arts, sciences, and soft skills. Each course is designed to build practical skills.",
  },
  {
    question: "How long do courses take to complete?",
    answer:
      "Course duration varies from a few hours for short modules to several weeks for comprehensive programs. You can learn at your own pace.",
  },
];

const FaqItem = ({ item, open, onToggle }) => (
  <article className="border-b border-[#ebebeb] last:border-0">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 py-4 text-left"
    >
      <span className="text-[13.5px] leading-snug font-medium text-[#1a1a1a]">
        {item.question}
      </span>

      <ChevronDown
        size={15}
        strokeWidth={2}
        className={`shrink-0 text-[#999] transition-transform duration-300 ${
          open ? "rotate-180" : ""
        }`}
      />
    </button>

    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        open ? "max-h-[800px] pb-4 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <p className="text-[13px] leading-6 text-[#666]">{item.answer}</p>
    </div>
  </article>
);

const LandingFAQ = () => {
  const dispatch = useAppDispatch();
  const faqItemsFromSettings = useAppSelector(
    (state) => state.settings.data?.faqItems,
  );
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchPlatformSettings());
  }, [dispatch]);

  const faqs = useMemo(() => {
    const published = (faqItemsFromSettings ?? [])
      .filter((item) => item.isPublished)
      .sort((a, b) => a.order - b.order)
      .map(({ question, answer }) => ({ question, answer }));

    return published.length ? published : fallbackFaqs;
  }, [faqItemsFromSettings]);

  const toggleFaq = (i) => {
    setOpenIndex(openIndex === i ? -1 : i);
  };

  return (
    <div className="mx-auto w-full max-w-3xl lg:max-w-none">
      {faqs.map((item, i) => (
        <FaqItem
          key={`${item.question}-${i}`}
          item={item}
          open={openIndex === i}
          onToggle={() => toggleFaq(i)}
        />
      ))}
    </div>
  );
};

export default LandingFAQ;
