const TestimonialSummaryCards = ({ items }) => {
  const summary = {
    total: items.length,
    pending: items.filter((item) => item.status === "pending").length,
    approved: items.filter((item) => item.status === "approved").length,
    featured: items.filter((item) => item.featured).length,
  };

  const cards = [
    { label: "Total Testimonials", value: summary.total },
    { label: "Pending Review", value: summary.pending },
    { label: "Approved", value: summary.approved },
    { label: "Featured", value: summary.featured },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-[24px] border border-[#e7eadf] bg-white p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
            {card.label}
          </p>
          <p className="mt-3 text-3xl font-bold text-[#203321]">
            {Number(card.value || 0).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TestimonialSummaryCards;
