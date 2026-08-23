function SectionTitle({
  title,
  subtitle,
}) {
  return (
    <div className="mb-10 text-center">
      <h2 className="text-3xl font-bold">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3 text-gray-600">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;