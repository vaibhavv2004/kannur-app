function PageHeader({ title, description, bordered = true }) {
  return (
    <div className={`text-center sm:text-left ${bordered ? "border-b border-slate-100 pb-4" : ""}`}>
      <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">{title}</h2>
      {description && (
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      )}
    </div>
  );
}

export default PageHeader;
