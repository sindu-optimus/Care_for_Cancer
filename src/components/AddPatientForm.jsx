import { useState } from "react";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import Select from "./ui/Select";
import Button from "./ui/Button";
import FieldError from "./ui/FieldError";
import useForm from "../hooks/useForm";
import { createPatient, updatePatient } from "../services/patientService"; // ← add updatePatient

const titleOptions = [
  { value: "Mr",   label: "Mr"   },
  { value: "Mrs",  label: "Mrs"  },
  { value: "Miss", label: "Miss" },
  { value: "Ms",   label: "Ms"   },
  { value: "Dr",   label: "Dr"   },
  { value: "Prof", label: "Prof" },
];

const genderOptions = [
  { value: "Male",   label: "Male"   },
  { value: "Female", label: "Female" },
  { value: "Other",  label: "Other"  },
];

const addressTypeOptions = [
  { value: "Home",     label: "Home"     },
  { value: "Work",     label: "Work"     },
  { value: "Business", label: "Business" },
];

const validate = (values) => {
  const errors = {};

  if (!values.mrn.trim())
    errors.mrn = "MRN is required";

  if (!values.nhsNumber.trim())
    errors.nhsNumber = "NHS Number is required";
  else if (!/^\d+$/.test(values.nhsNumber))
    errors.nhsNumber = "NHS Number must contain only numbers";
  else if (values.nhsNumber.length !== 10)
    errors.nhsNumber = "NHS Number must be exactly 10 digits";

  if (!values.surname.trim())
    errors.surname = "Surname is required";

  if (!values.firstname.trim())
    errors.firstname = "First Name is required";

  if (!values.lastname.trim())
    errors.lastname = "Last Name is required";

  if (!values.gender)
    errors.gender = "Gender is required";

  if (!values.dob)
    errors.dob = "Date of Birth is required";

  if (!values.addressLine1.trim())
    errors.addressLine1 = "Address Line 1 is required";

  if (!values.postcode.trim())
    errors.postcode = "Postcode is required";

  return errors;
};

// ← accept patient prop for edit mode
export default function AddPatientForm({ onClose, onSuccess, patient }) {
  const [saving, setSaving]     = useState(false);
  const [apiError, setApiError] = useState("");

  const isEditing = !!patient; // ← true if patient is passed

  const {
    values, errors, touched,
    handleChange, handleBlur,
    handleSubmit, resetForm,
  } = useForm({
    mrn:           patient?.mrn                        || "",
    nhsNumber:     String(patient?.nhsNumber           || ""),
    isActive:      patient?.isActive                   ?? true,
    title:         patient?.demographics?.title        || "",
    surname:       patient?.demographics?.surname      || "",
    firstname:     patient?.demographics?.firstname    || "",
    lastname:      patient?.demographics?.lastname     || "",
    gender:        patient?.demographics?.gender       || "",
    dob:           patient?.demographics?.dob
                     ? new Date(patient.demographics.dob).toISOString().split("T")[0]
                     : "",
    ethnicity:     patient?.demographics?.ethnicity    || "",
    maritalStatus: patient?.demographics?.maritalStatus || "",
    mobile:        patient?.demographics?.mobile       || "",
    work:          patient?.demographics?.work         || "",
    business:      patient?.demographics?.business     || "",
    addressType:   patient?.address?.addressType       || "",
    addressLine1:  patient?.address?.addressLine1      || "",
    addressLine2:  patient?.address?.addressLine2      || "",
    addressLine3:  patient?.address?.addressLine3      || "",
    addressLine4:  patient?.address?.addressLine4      || "",
    postcode:      patient?.address?.postcode          || "",
  }, validate);

  const handleSave = handleSubmit(async (formValues) => {
    try {
      setSaving(true);
      setApiError("");

      const payload = {
        mrn:       formValues.mrn,
        nhsNumber: Number(formValues.nhsNumber),
        regDate:   patient?.regDate || new Date().toISOString(),
        isActive:  formValues.isActive,
        demographics: {
          title:         formValues.title,
          surname:       formValues.surname,
          firstname:     formValues.firstname,
          lastname:      formValues.lastname,
          gender:        formValues.gender,
          dob:           formValues.dob
                           ? new Date(formValues.dob).toISOString()
                           : null,
          ethnicity:     formValues.ethnicity,
          maritalStatus: formValues.maritalStatus,
          mobile:        formValues.mobile,
          work:          formValues.work,
          business:      formValues.business,
        },
        address: {
          addressType:  formValues.addressType,
          addressLine1: formValues.addressLine1,
          addressLine2: formValues.addressLine2,
          addressLine3: formValues.addressLine3,
          addressLine4: formValues.addressLine4,
          postcode:     formValues.postcode,
        },
      };

      if (isEditing) {
        await updatePatient(patient.id, payload); // ← PUT
      } else {
        await createPatient(payload);             // ← POST
      }

      resetForm();
      onSuccess();
      onClose();

    } catch (error) {
      setApiError(
        isEditing
          ? "Failed to update patient. Please try again."
          : "Failed to create patient. Please try again."
      );
    } finally {
      setSaving(false);
    }
  });

  return (
    <Modal
      title={isEditing ? "Edit Patient" : "Add Patient"}
      onClose={onClose}
    >
      <div className="space-y-8">

        {/* ── Patient Info ── */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Patient Info
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="MRN"
              name="mrn"
              type="text"
              placeholder="Enter MRN"
              value={values.mrn}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.mrn}
              touched={touched.mrn}
            />
            <Input
              label="NHS Number"
              name="nhsNumber"
              type="text"
              placeholder="Enter NHS Number"
              value={values.nhsNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.nhsNumber}
              touched={touched.nhsNumber}
              maxLength={10}
            />
          </div>
          <div className="flex items-center gap-3 mt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={values.isActive}
              onChange={(e) =>
                handleChange({
                  target: { name: "isActive", value: e.target.checked },
                })
              }
              className="w-4 h-4 accent-primary"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
              Active Patient
            </label>
          </div>
        </div>

        {/* ── Demographics ── */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Demographics
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">Title</label>
              <Select
                name="title"
                value={values.title}
                onChange={handleChange}
                placeholder="Select Title"
                options={titleOptions}
              />
              <div className="min-h-4" />
            </div>
            <Input
              label="Surname"
              name="surname"
              type="text"
              placeholder="Enter Surname"
              value={values.surname}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.surname}
              touched={touched.surname}
            />
            <Input
              label="First Name"
              name="firstname"
              type="text"
              placeholder="Enter First Name"
              value={values.firstname}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.firstname}
              touched={touched.firstname}
            />
            <Input
              label="Last Name"
              name="lastname"
              type="text"
              placeholder="Enter Last Name"
              value={values.lastname}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.lastname}
              touched={touched.lastname}
            />
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">Gender</label>
              <Select
                name="gender"
                value={values.gender}
                onChange={handleChange}
                placeholder="Select Gender"
                options={genderOptions}
              />
              <div className="min-h-4">
                <FieldError error={errors.gender} touched={touched.gender} />
              </div>
            </div>
            <Input
              label="Date of Birth"
              name="dob"
              type="date"
              value={values.dob}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.dob}
              touched={touched.dob}
            />
            <Input
              label="Ethnicity"
              name="ethnicity"
              type="text"
              placeholder="Enter Ethnicity"
              value={values.ethnicity}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Input
              label="Marital Status"
              name="maritalStatus"
              type="text"
              placeholder="Enter Marital Status"
              value={values.maritalStatus}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Input
              label="Mobile"
              name="mobile"
              type="text"
              placeholder="Enter Mobile Number"
              value={values.mobile}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Input
              label="Work"
              name="work"
              type="text"
              placeholder="Enter Work Number"
              value={values.work}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Input
              label="Business"
              name="business"
              type="text"
              placeholder="Enter Business Number"
              value={values.business}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>

        {/* ── Address ── */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Address
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">Address Type</label>
              <Select
                name="addressType"
                value={values.addressType}
                onChange={handleChange}
                placeholder="Select Address Type"
                options={addressTypeOptions}
              />
              <div className="min-h-4" />
            </div>
            <Input
              label="Address Line 1"
              name="addressLine1"
              type="text"
              placeholder="Enter Address Line 1"
              value={values.addressLine1}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.addressLine1}
              touched={touched.addressLine1}
            />
            <Input
              label="Address Line 2"
              name="addressLine2"
              type="text"
              placeholder="Enter Address Line 2"
              value={values.addressLine2}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Input
              label="Address Line 3"
              name="addressLine3"
              type="text"
              placeholder="Enter Address Line 3"
              value={values.addressLine3}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Input
              label="Address Line 4"
              name="addressLine4"
              type="text"
              placeholder="Enter Address Line 4"
              value={values.addressLine4}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Input
              label="Postcode"
              name="postcode"
              type="text"
              placeholder="Enter Postcode"
              value={values.postcode}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.postcode}
              touched={touched.postcode}
            />
          </div>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {apiError}
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="w-full sm:w-auto px-6" onClick={handleSave} disabled={saving}>
            {saving
              ? "Saving..."
              : isEditing ? "Update Patient" : "Add Patient"
            }
          </Button>
        </div>

      </div>
    </Modal>
  );
}
