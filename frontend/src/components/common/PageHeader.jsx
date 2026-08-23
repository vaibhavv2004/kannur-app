function PageHeader({
  title,
  description,
}) {
  return (
    <section className="bg-slate-100 py-16">
      <div className="mx-auto max-w-7xl px-5">
        <h1 className="text-4xl font-bold">
          {title}
        </h1>

        {description && (
          <p className="mt-4 max-w-2xl text-gray-600">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

export default PageHeader;