import React, { useState } from "react";
import { Button } from "./";
import SelectField from "./SelectField";
import ValidatedInputField from "./ValidatedInputField";
import MultiSelectField from "./MultiSelectField";
import UploadFile from "./UploadFile";

/**
 * Reusable FormContainer (non-modal)
 * Props:
 *  - title: string
 *  - formSchema: field definitions
 *  - initialFormData: prefill values
 *  - onSubmit: async (payload) => void
 *  - renderFieldOverride: optional map of key => custom render function
 */

const FormContainer = ({
  title,
  formSchema,
  initialFormData = {},
  onSubmit,
  renderFieldOverride = {},
}) => {
  const [form, setForm] = useState(() => {
    const data = {};
    Object.entries(formSchema).forEach(([key, cfg]) => {
      data[key] =
        initialFormData[key] ??
        cfg.defaultValue ??
        (cfg.type === "checkbox" ? false : "");
    });
    return data;
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    const err = formSchema[key].validate?.(val);
    setErrors((prev) => ({ ...prev, [key]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");

    // validate all fields
    const newErrs = {};
    Object.entries(formSchema).forEach(([key, cfg]) => {
      const err = cfg.validate?.(form[key]);
      if (err) newErrs[key] = err;
    });
    if (Object.keys(newErrs).length) {
      setErrors(newErrs);
      // setGeneralError("Please fix the errors.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {};
      Object.entries(formSchema).forEach(([key, cfg]) => {
        payload[key] = cfg.transform ? cfg.transform(form[key]) : form[key];
      });
      await onSubmit(payload);
    } catch (err) {
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
            return (
              <div key={key}>
                {renderFieldOverride[key](key, cfg, form, setForm)}
              </div>
            );
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
                  items={cfg.options}
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
                  options={cfg.options}
                  error={errors[key]}
                  placeholder={cfg.placeholder}
                />
              );
            case "upload":
              return (
                <UploadFile
                  label={cfg.label}
                  maxSizeMB={cfg.maxSizeMB}
                  onUpload={(file) => handleChange(key, file)}
                  isInvalid={!!errors[key]}
                  helperText={errors[key]}
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
                  isInvalid={Boolean(errors[key])}
                  helperText={errors[key]}
                />
              );
          }
        })}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormContainer;
