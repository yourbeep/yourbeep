import { motion } from "framer-motion";
import type { LegalDocumentData } from "@store/slices/settings";

type LegalDocumentViewProps = {
  document: LegalDocumentData | null;
  loading: boolean;
  fallbackTitle: string;
};

type ParsedSection = {
  id: string;
  title: string;
  body: string[];
};

const parseSections = (content: string): ParsedSection[] => {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return [];
  }

  const sections: ParsedSection[] = [];
  let current: ParsedSection | null = null;

  lines.forEach((line, index) => {
    const isHeading =
      /^#{1,6}\s+/.test(line) ||
      /^\d+[\).]\s+/.test(line) ||
      (line.length < 90 && !/[.?!:]$/.test(line));

    if (isHeading) {
      if (current) {
        sections.push(current);
      }

      const rawTitle = line.replace(/^#{1,6}\s+/, "").replace(/^\d+[\).]\s+/, "");
      current = {
        id: `${rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
        title: rawTitle,
        body: [],
      };
      return;
    }

    if (!current) {
      current = {
        id: `section-${index}`,
        title: "Overview",
        body: [],
      };
    }

    current.body.push(line);
  });

  if (current) {
    sections.push(current);
  }

  return sections;
};

const LegalDocumentView = ({
  document,
  loading,
  fallbackTitle,
}: LegalDocumentViewProps) => {
  const sections = parseSections(document?.content ?? "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.08 }}
      className="mx-auto max-w-4xl"
    >
      <div className="border-b border-[#edf1eb] pb-4">
        <h2 className="text-2xl font-semibold text-[#18343a]">{document?.title || fallbackTitle}</h2>
        <p className="mt-2 text-sm text-[#7b8d90]">
          Last updated: {document?.updatedAt ? new Date(document.updatedAt).toLocaleDateString() : "Pending"}
        </p>
      </div>

      {loading && !document ? (
        <div className="py-12 text-sm text-[#688087]">Loading document...</div>
      ) : sections.length ? (
        <div className="space-y-10 pt-8">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <h3 className="text-xl font-semibold text-[#173f53]">{section.title}</h3>
              <div className="mt-4 space-y-4 text-sm leading-7 text-[#52676e] sm:text-[15px]">
                {section.body.map((paragraph) => (
                  <p key={`${section.id}-${paragraph.slice(0, 20)}`}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="py-12 text-sm text-[#688087]">This document has not been published yet.</div>
      )}
    </motion.div>
  );
};

export default LegalDocumentView;
