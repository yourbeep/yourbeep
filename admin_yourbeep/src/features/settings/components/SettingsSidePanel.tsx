import { motion } from "framer-motion";

type SettingsSidePanelItem = {
  id: string;
  label: string;
  helper: string;
};

type SettingsSidePanelProps = {
  items: SettingsSidePanelItem[];
};

export default function SettingsSidePanel({ items }: SettingsSidePanelProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="top-6 h-fit rounded-[24px] border border-[#e7eadf] bg-white p-4 shadow-sm lg:sticky"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#72806e]">
        Platform Settings
      </p>
      <div className="mt-5 space-y-2">
        {items.map((item, index) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="group flex items-start gap-3 rounded-[18px] border border-transparent px-3 py-3 transition hover:border-[#dfe8d6] hover:bg-[#f8faf6]"
          >
            <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#eef7f5] text-xs font-bold text-[var(--primary)]">
              {index + 1}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#203321]">
                {item.label}
              </p>
              <p className="mt-1 text-xs leading-5 text-[#72806e]">
                {item.helper}
              </p>
            </div>
          </a>
        ))}
      </div>
    </motion.aside>
  );
}
