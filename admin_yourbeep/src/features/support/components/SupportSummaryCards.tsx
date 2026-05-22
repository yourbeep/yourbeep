const summaryCards = [
  { key: "total", label: "Total Tickets" },
  { key: "open", label: "Open" },
  { key: "inProgress", label: "In Progress" },
  { key: "waitingOnUser", label: "Waiting On User" },
  { key: "resolved", label: "Resolved" },
  { key: "closed", label: "Closed" },
];

const SupportSummaryCards = ({ summary }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
    {summaryCards.map((card) => (
      <div key={card.key} className="rounded-[24px] border border-[#e7eadf] bg-white p-5 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
          {card.label}
        </p>
        <p className="mt-3 text-3xl font-bold text-[#203321]">
          {Number(summary?.[card.key] || 0).toLocaleString()}
        </p>
      </div>
    ))}
  </div>
);

export default SupportSummaryCards;
