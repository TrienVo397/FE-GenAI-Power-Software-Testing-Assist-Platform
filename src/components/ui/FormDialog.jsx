import React, { useState } from "react";
import { Button, Checkbox, UploadCard } from "./";
import SelectField from "./SelectField";
import ValidatedInputField from "./ValidatedInputField";
import MultiSelectField from "./MultiSelectField";

/**
 * Reusable FormDialog
 * Props:
 *  - title: string
 *  - formSchema: field definitions (see usage)
 *  - initialFormData: prefill values
 *  - onSubmit: async (payload) => void
 *  - onClose: () => void
 *  - renderFieldOverride: optional map of key => custom render function
 *  - disableAutoClose: optional boolean to prevent closing on submit
 */

const FormDialog = ({
  title,
  formSchema,
  initialFormData = {},
  onSubmit,
  onClose,
  renderFieldOverride = {},
  disableAutoClose = false, 
}) => {
  const [form, setForm] = useState(() => {
    const data = {};
    Object.entries(formSchema).forEach(([key, cfg]) => {
      data[key] = initialFormData[key] ?? cfg.defaultValue ?? (cfg.type === 'checkbox' ? false : '');
    });
    return data;
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    const err = formSchema[key].validate?.(val);
    setErrors(prev => ({ ...prev, [key]: err }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setGeneralError("");

    // validate all
    const newErrs = {};
    Object.entries(formSchema).forEach(([key, cfg]) => {
      const err = cfg.validate?.(form[key]);
      if (err) newErrs[key] = err;
    });
    if (Object.keys(newErrs).length) {
      setErrors(newErrs);
      // setGeneralError('Please fix the errors.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {};
      Object.entries(formSchema).forEach(([key, cfg]) => {
        payload[key] = cfg.transform ? cfg.transform(form[key]) : form[key];
      });
      await onSubmit(payload);
      if (!disableAutoClose) {
        onClose();
      }
    } catch (err) {
      setGeneralError(err.message || 'Submission failed.');
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
              case 'checkbox':
                return (
                  <Checkbox
                    key={key}
                    label={cfg.label}
                    checked={form[key]}
                    onChange={e => handleChange(key, e.target.checked)}
                  />
                );
              case 'select':
                return (
                  <SelectField
                    key={key}
                    id={key}
                    label={cfg.label}
                    value={form[key]}
                    onChange={val => handleChange(key, val)}
                    items={cfg.options}
                  />
                );
              case 'upload':
                return (
                  <UploadCard
                    key={key}
                    label={cfg.label}
                    maxSizeMB={cfg.maxSizeMB}
                    onUpload={file => handleChange(key, file)}
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
              default:
                return (
                  <ValidatedInputField
                    key={key}
                    id={key}
                    label={cfg.label}
                    type={cfg.type || 'text'}
                    value={form[key]}
                    onChange={e => handleChange(key, e.target.value)}
                    isInvalid={Boolean(errors[key])}
                    helperText={errors[key]}
                  />
                );
            }
          })}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormDialog;
