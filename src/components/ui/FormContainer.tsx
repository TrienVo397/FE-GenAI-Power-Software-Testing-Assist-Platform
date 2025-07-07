import React, { useState } from "react";
import { Button } from ".";
import SelectField from "./SelectField";
import ValidatedInputField from "./ValidatedInputField";
import MultiSelectField from "./MultiSelectField";
import UploadFile from "./UploadFile";

interface FieldConfig {
  label: string;
  type?: string;
  options?: { label: string; value: string }[];
  validate?: (val: any) => string | null;
  transform?: (val: any) => any;
  placeholder?: string;
  defaultValue?: any;
  maxSizeMB?: number;
}

interface FormSchema {
  [key: string]: FieldConfig;
}

interface FormContainerProps {
  title?: string;
  formSchema: FormSchema;
  initialFormData?: Record<string, any>;
  onSubmit: (payload: Record<string, any>) => Promise<void>;
  renderFieldOverride?: {
    [key: string]: (
      key: string,
      cfg: FieldConfig,
      form: Record<string, any>,
      setForm: React.Dispatch<React.SetStateAction<Record<string, any>>>
    ) => React.ReactNode;
  };
  extraButtons?: React.ReactNode;
  submitLabel?: string;
}

const FormContainer: React.FC<FormContainerProps> = ({
  title,
  formSchema,
  initialFormData = {},
  onSubmit,
  renderFieldOverride = {},
  extraButtons = null,
  submitLabel = "Submit",
}) => {
  const [form, setForm] = useState(() => {
    const data: Record<string, any> = {};
    Object.entries(formSchema).forEach(([key, cfg]) => {
      data[key] =
        initialFormData[key] ?? cfg.defaultValue ?? (cfg.type === "checkbox" ? false : "");
    });
    return data;
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key: string, val: any) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    const err = formSchema[key].validate?.(val);
    setErrors((prev) => ({ ...prev, [key]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    const newErrs: Record<string, string> = {};
    Object.entries(formSchema).forEach(([key, cfg]) => {
      const err = cfg.validate?.(form[key]);
      if (err) newErrs[key] = err;
    });

    if (Object.keys(newErrs).length) {
      setErrors(newErrs);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Record<string, any> = {};
      Object.entries(formSchema).forEach(([key, cfg]) => {
        payload[key] = cfg.transform ? cfg.transform(form[key]) : form[key];
      });
      await onSubmit(payload);
    } catch (err: any) {
      setGeneralError(err.message || "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-md p-6 w-full mx-auto">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      {generalError && <div className="mb-4 text-red-500">{generalError}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.entries(formSchema).map(([key, cfg]) => {
          if (renderFieldOverride[key]) {
            return <div key={key}>{renderFieldOverride[key](key, cfg, form, setForm)}</div>;
          }

          switch (cfg.type) {
            case "select":
              return (
                <SelectField
                  key={key}
                  id={key}
                  label={cfg.label}
                  value={form[key]}
                  onChange={(val) => handleChange(key, val)}
                  items={cfg.options || []}
                />
              );
            case "multi-select":
              return (
                <MultiSelectField
                  key={key}
                  id={key}
                  label={cfg.label}
                  value={form[key]}
                  onChange={(val) => handleChange(key, val)}
                  options={cfg.options || []}
                  error={errors[key] || undefined}
                  placeholder={cfg.placeholder}
                />
              );
            case "upload":
              return (
                <UploadFile
                  key={key}
                  label={cfg.label}
                  maxSizeMB={cfg.maxSizeMB}
                  onUpload={(file) => handleChange(key, file)}
                  isInvalid={!!errors[key]}
                  helperText={errors[key] || undefined}
                />
              );
            default:
              return (
                <ValidatedInputField
                  key={key}
                  id={key}
                  label={cfg.label}
                  type={cfg.type || "text"}
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  isInvalid={!!errors[key]}
                  helperText={errors[key] || undefined}
                />
              );
          }
        })}

        <div className="flex justify-end items-center gap-4 pt-4">
          {extraButtons}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormContainer;