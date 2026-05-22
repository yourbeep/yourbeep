import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQItem = {
  q: string;
  a: string;
};

const FaqAccordion = ({ item }: { item: FAQItem }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="cursor-pointer border-b border-[#e0ddd4] py-5"
      onClick={() => setOpen((current) => !current)}
    >
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-semibold text-[#1a2e2e]">{item.q}</p>
        <ChevronDown
          size={18}
          className="shrink-0 text-[#4a8a90] transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </div>
      {open ? (
        <p className="mt-3 text-sm leading-[1.8] text-[#5a6a6a]">{item.a}</p>
      ) : null}
    </div>
  );
};

export default FaqAccordion;
