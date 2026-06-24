import { useState, useEffect } from "react";
import { FaInfoCircle, FaArrowLeft } from "react-icons/fa";

import Input from "./ui/Input";
import Select from "./ui/Select";
import DateTimePicker from "./ui/DateTimePicker/DateTimePicker";
import useForm from "../hooks/useForm";

import { searchPatients } from "../services/patientService";
import { getGenders } from "../services/genderService";

const validate = (values, showOtherOptions) => {
  const errors = {};

  if (!showOtherOptions) {
    // NHS / MRN Search Mode
    if (!values.nhsNumber.trim() && !values.mrnNumber.trim()) {
      errors.nhsNumber = "Enter either NHS Number or MRN Number";
    }

    if (values.nhsNumber && !/^\d+$/.test(values.nhsNumber)) {
      errors.nhsNumber = "NHS Number must contain only numbers";
    } else if (
      values.nhsNumber &&
      values.nhsNumber.length !== 10
    ) {
      errors.nhsNumber = "NHS Number must be exactly 10 digits";
    }
  } else {
    // Other Options Mode
    if (!values.surname.trim()) {
      errors.surname = "Surname is required";
    }

    if (!values.firstName.trim()) {
      errors.firstName = "First Name is required";
    }

    if (!values.dob) {
      errors.dob = "Date of Birth is required";
    }

    if (!values.gender) {
      errors.gender = "Gender is required";
    }
  }

  return errors;
};

export default function SearchForm({ onResults }) {
  const [showOtherOptions, setShowOtherOptions] = useState(false);
  const [genderOptions, setGenderOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    fetchGenders();
  }, []);

  const fetchGenders = async () => {
    try {
      const response = await getGenders();
      setGenderOptions(response.data);
    } catch (error) {
      console.error("Failed to load genders", error);
    }
  };

  const formValidate = (values) =>
    validate(values, showOtherOptions);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(
    {
      nhsNumber: "",
      mrnNumber: "",
      surname: "",
      firstName: "",
      dob: "",
      gender: "",
    },
    formValidate
  );

  const onSubmit = async (formValues) => {
    try {
      setLoading(true);
      setApiError("");

      const params = {};

      if (formValues.nhsNumber)
        params.nhsNumber = formValues.nhsNumber;

      if (formValues.mrnNumber)
        params.mrn = formValues.mrnNumber;

      if (formValues.firstName)
        params.firstname = formValues.firstName;

      if (formValues.surname)
        params.surname = formValues.surname;

      if (formValues.dob)
        params.dob = formValues.dob;

      if (formValues.gender)
        params.gender = formValues.gender;

      const response = await searchPatients(params);

      onResults(response.data, params);
    } catch (error) {
      if (error.response?.status === 404) {
        setApiError("No patients found matching your search.");
        onResults([], {});
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl sm:text-3xl font-bold text-text mb-6">
        Search Patient
      </h2>

      <div className="bg-white rounded-2xl shadow-md p-4 md:p-8">

        {/* NHS / MRN Search */}
        {!showOtherOptions && (
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-6">
            <div className="flex-1">
              <Input
                label="NHS Number"
                name="nhsNumber"
                type="text"
                placeholder="Enter the NHS number"
                value={values.nhsNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.nhsNumber}
                touched={touched.nhsNumber}
                maxLength={10}
              />
            </div>

            <div className="flex items-center justify-center md:items-start md:pt-9 text-sm md:text-xl font-semibold text-slate-800">
              OR
            </div>

            <div className="flex-1">
              <Input
                label="MRN Number"
                name="mrnNumber"
                type="text"
                placeholder="Enter the MRN number"
                value={values.mrnNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.mrnNumber}
                touched={touched.mrnNumber}
              />
            </div>
          </div>
        )}

        {/* Other Options */}
        {showOtherOptions && (
          <>
            <div
              className="flex items-center gap-2 mb-6 cursor-pointer text-primary font-medium"
              onClick={() => setShowOtherOptions(false)}
            >
              <FaArrowLeft />
              <span>Back to NHS / MRN Search</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                name="firstName"
                type="text"
                placeholder="Enter First Name"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.firstName}
                touched={touched.firstName}
              />
            </div>

            <div className="flex justify-center mb-6">
              <span className="px-4 py-1 bg-slate-100 text-text rounded-full text-sm sm:text-lg font-semibold">
                AND
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-gray-400">
              <DateTimePicker
                label="Date of Birth"
                name="dob"
                value={values.dob}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.dob}
                touched={touched.dob}
                maxDate={new Date()}
              />
    
              <div>
                <label className="block font-medium text-text mb-2">
                  Gender
                </label>

                <Select
                  name="gender"
                  value={values.gender}
                  onChange={handleChange}
                  placeholder="Select Gender"
                  dropdownMode="overlay"
                  options={genderOptions.map((gender) => ({
                    value: gender.genderName,
                    label: gender.genderName,
                  }))}
                  error={errors.gender}
                  touched={touched.gender}
                />              
              </div>
            </div>
          </>
        )}

        {apiError && (
          <div className="mb-4 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {apiError}
          </div>
        )}

        <div className="flex justify-center mt-4">
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="w-full sm:w-auto bg-primary text-white cursor-pointer px-8 sm:px-20 lg:px-28 py-4 rounded-lg font-semibold disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {!showOtherOptions && (
        <div className="border border-gray-300 rounded-xl mt-8 p-4 flex gap-5 items-start">
          <FaInfoCircle
            className="text-primary"
            size={24}
          />

          <p className="flex items-center text-text text-sm">
            Click here to search by{" "}
            <span
              className="text-primary cursor-pointer font-medium pl-1"
              onClick={() => setShowOtherOptions(true)}
            >
              other options
            </span>
          </p>
        </div>
      )}
    </>
  );
}