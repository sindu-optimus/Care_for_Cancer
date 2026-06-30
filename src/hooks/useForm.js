import { useState } from "react";

export default function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(newValues);
    setErrors(newErrors);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(values);
    setErrors(newErrors);
  };

  const handleSubmit = (onSubmit) => (e) => {
    e?.preventDefault();  
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }), {}
    );
    setTouched(allTouched);
    const newErrors = validate(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit(values);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const prefillForm = (data) => {
    setValues(data);
    setErrors({});
    setTouched({});
  };

  const setFieldValue = (name, value) => {
    setValues((prev) => {
      const newValues = {
        ...prev,
        [name]: value,
      };

      setErrors(validate(newValues));

      return newValues;
    });

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  return { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm, prefillForm, setFieldValue };
}