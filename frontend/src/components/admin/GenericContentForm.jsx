import { Plus, Trash2 } from "lucide-react";

const inputClass = "w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500";

function emptyItem(itemFields) {
  const item = { id: Date.now() + Math.floor(Math.random() * 1000) };
  for (const f of itemFields) item[f.key] = f.type === "number" ? 0 : "";
  return item;
}

function Field({ field, value, onChange }) {
  const val = value ?? (field.type === "number" ? 0 : "");

  if (field.type === "text") {
    return (
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">{field.label}</label>
        <input type="text" value={val} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      </div>
    );
  }

  if (field.type === "number") {
    return (
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">{field.label}</label>
        <input type="number" value={val} onChange={(e) => onChange(parseInt(e.target.value) || 0)} className={inputClass} />
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">{field.label}</label>
        <textarea rows={3} value={val} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      </div>
    );
  }

  if (field.type === "group") {
    const groupVal = value || {};
    return (
      <div className="border border-slate-100 rounded-xl p-4 space-y-3 bg-slate-50/50">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{field.label}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {field.fields.map((sub) => (
            <Field
              key={sub.key}
              field={sub}
              value={groupVal[sub.key]}
              onChange={(v) => onChange({ ...groupVal, [sub.key]: v })}
            />
          ))}
        </div>
      </div>
    );
  }

  if (field.type === "stringlist") {
    const items = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-500">{field.label}</label>
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <textarea
              rows={2}
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[idx] = e.target.value;
                onChange(next);
              }}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
              className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition cursor-pointer shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" /> Add paragraph
        </button>
      </div>
    );
  }

  if (field.type === "list") {
    const items = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-500">{field.label}</label>
        {items.map((item, idx) => (
          <div key={item.id ?? idx} className="border border-slate-100 rounded-xl p-4 space-y-3 bg-white relative">
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
              className="absolute top-3 right-3 p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition cursor-pointer"
              title={`Remove ${field.itemLabel || "item"}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
              {field.itemFields.map((sub) => (
                <Field
                  key={sub.key}
                  field={sub}
                  value={item[sub.key]}
                  onChange={(v) => {
                    const next = [...items];
                    next[idx] = { ...item, [sub.key]: v };
                    onChange(next);
                  }}
                />
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, emptyItem(field.itemFields)])}
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" /> Add {field.itemLabel || "item"}
        </button>
      </div>
    );
  }

  return null;
}

function GenericContentForm({ schema, data, onChange }) {
  return (
    <div className="space-y-5">
      {schema.fields.map((field) => (
        <Field
          key={field.key}
          field={field}
          value={data[field.key]}
          onChange={(v) => onChange({ ...data, [field.key]: v })}
        />
      ))}
    </div>
  );
}

export default GenericContentForm;
