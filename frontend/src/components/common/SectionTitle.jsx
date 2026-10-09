function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center space-y-1.5">
      <h3 className="text-xl font-bold text-slate-800 sm:text-2xl">{title}</h3>
      {subtitle && (
        <p className="text-slate-500 text-sm max-w-lg mx-auto">{subtitle}</p>
      )}
    </div>
  );
}

export default SectionTitle;
