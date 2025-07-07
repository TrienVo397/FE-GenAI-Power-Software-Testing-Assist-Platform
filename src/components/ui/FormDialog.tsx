import React, { useState } from "react";
import { Button, Checkbox, UploadCard } from "./";
import SelectField from "./SelectField";
import ValidatedInputField from "./ValidatedInputField";
import MultiSelectField from "./MultiSelectField";

interface FieldConfig {
  label: string;
  type?: string;
  options?: { label: string; value: string }[];
  validate?: (value: any) => string | null;
  transform?: (value: any) => any;
  defaultValue?: any;
  maxSizeMB?: number;
  placeholder?: string;
}

interface FormDialogProps {
  title: string;
  formSchema: Record<string, FieldConfig>;
  initialFormData?: Record<string, any>;
  onSubmit: (payload: Record<string, any>) => Promise<void>;
  onClose: () => void;
  renderFieldOverride?: Record<
    string,
    (
      key: string,
      cfg: FieldConfig,
      form: Record<string, any>,
      setForm: React.Dispatch<React.SetStateAction<Record<string, any>>>
    ) => React.ReactNode
  >;
  disableAutoClose?: boolean;
}

const FormDialog: React.FC<FormDialogProps> = ({
  title,
  formSchema,
  initialFormData = {},
  onSubmit,
  onClose,
  renderFieldOverride = {},
  disableAutoClose = false,
}) => {
  const [form, setForm] = useState<Record<string, any>>(() => {
    const data: Record<string, any> = {};
    Object.entries(formSchema).forEach(([key, cfg]) => {
      data[key] =
        initialFormData[key] ??
        cfg.defaultValue ??
        (cfg.type === "checkbox" ? false : "");
    });
    return data;
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key: string, val: any) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    const err = formSchema[key].validate?.(val) ?? null;
    setErrors((prev) => ({ ...prev, [key]: err }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError("");

    const newErrs: Record<string, string | null> = {};
    Object.entries(formSchema).forEach(([key, cfg]) => {
      const err = cfg.validate?.(form[key]) ?? null;
      if (err) newErrs[key] = err;
    });

    if (Object.values(newErrs).some(Boolean)) {
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
      if (!disableAutoClose) {
        onClose();
      }
    } catch (err: any) {
      setGeneralError(err?.message || "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-md shadow-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        {generalError && <div className="mb-4 text-red-500">{generalError}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.entries(formSchema).map(([key, cfg]) => {
            if (renderFieldOverride[key]) {
              return (
                <div key={key}>
                  {renderFieldOverride[key](key, cfg, form, setForm)}
                </div>
              );
            }

            switch (cfg.type) {
              case "checkbox":
                return (
                  <Checkbox
                    key={key}
                    label={cfg.label}
                    checked={form[key]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(key, e.target.checked)
                    }
                  />
                );
              case "select":
                return (
                  <SelectField
                    key={key}
                    id={key}
                    label={cfg.label}
                    value={form[key]}
                    onChange={(val: any) => handleChange(key, val)}
                    items={cfg.options || []}
                  />
                );
              case "upload":
                return (
                  <UploadCard
                    key={key}
                    label={cfg.label}
                    maxSizeMB={cfg.maxSizeMB}
                    onUpload={(file: File) => handleChange(key, file)}
                  />
                );
              case "multi-select":
                return (
                  <MultiSelectField
                    key={key}
                    id={key}
                    label={cfg.label}
                    value={form[key]}
                    onChange={(val: string[]) => handleChange(key, val)}
                    options={cfg.options || []}
                    error={errors[key] || undefined}
                    placeholder={cfg.placeholder}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                      handleChange(key, e.target.value)
                    }
                    isInvalid={Boolean(errors[key])}
                    helperText={errors[key] || ""}
                  />
                );
            }
          })}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormDialog;
