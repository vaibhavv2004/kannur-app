import { useState, useRef, useEffect } from "react";
import { Edit2, Check, X } from "lucide-react";

function EditableText({ value, onSave, isAdmin, multiline = false, className = "", inputClassName = "" }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (!multiline) {
        inputRef.current.select();
      }
    }
  }, [isEditing, multiline]);

  if (!isAdmin) {
    return <span className={className}>{value}</span>;
  }

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-start gap-2 max-w-full">
        {multiline ? (
          <textarea
            ref={inputRef}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className={`w-full bg-white text-slate-900 border-2 border-emerald-500 rounded-md p-2 shadow-sm focus:outline-none ${inputClassName}`}
            rows={5}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className={`w-full bg-white text-slate-900 border-2 border-emerald-500 rounded-md p-1 px-2 shadow-sm focus:outline-none ${inputClassName}`}
          />
        )}
        <div className="flex flex-col gap-1 shrink-0">
          <button onClick={handleSave} className="p-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-md transition" title="Save">
            <Check className="h-4 w-4" />
          </button>
          <button onClick={handleCancel} className="p-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition" title="Cancel">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <span className={`relative group inline-block ${className}`}>
      {value}
      <button
        onClick={() => setIsEditing(true)}
        className="absolute -top-3 -right-6 opacity-0 group-hover:opacity-100 p-1.5 bg-slate-800 text-white rounded-full shadow-md hover:bg-emerald-600 transition-all z-10 cursor-pointer scale-75"
        title="Edit text"
      >
        <Edit2 className="h-3 w-3" />
      </button>
    </span>
  );
}

export default EditableText;
