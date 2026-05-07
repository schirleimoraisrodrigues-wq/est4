export function Field({ label, children }) {
  return (
    <label className="block space-y-2 text-sm font-semibold text-slate-300">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function EmptyState({ title, text }) {
  return <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center text-slate-400"><p className="font-bold text-white">{title}</p><p className="mt-1 text-sm">{text}</p></div>;
}
