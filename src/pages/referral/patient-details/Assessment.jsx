import { useState, useEffect } from "react";

import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import DateTimePicker from "../../../components/ui/DateTimePicker/DateTimePicker";

import useForm from "../../../hooks/useForm";

import { getCosdValues } from "../../../services/cosdService";

const validate = (values) => {
    const errors = {};

    if (!values.date) {
        errors.date = "Date is required";
    }

    if (!values.performanceStatus) {
        errors.performanceStatus = "Performance Status is required";
    }

    if (!values.secondaryDiagnosis.trim()) {
        errors.secondaryDiagnosis = "Secondary Diagnosis is required";
    }

    if (!values.otherSignificantDiagnosisSubsidiaryComment.trim()) {
        errors.otherSignificantDiagnosisSubsidiaryComment =
        "Other Significant Diagnosis Subsidiary Comment is required";
    }

    if (!values.familialCancerSyndrome) {
        errors.familialCancerSyndrome =
        "Familial Cancer Syndrome is required";
    }

    if (!values.familialCancerComment.trim()) {
        errors.familialCancerComment =
        "Familial Cancer Comment is required";
    }

    if (!values.diabetesIndicator) {
        errors.diabetesIndicator =
        "Diabetes Indicator is required";
    }

    // Height Validation
    if (!values.height) {
        errors.height = "Height is required";
    } else if (!/^\d+(\.\d{1,2})?$/.test(values.height)) {
        errors.height = "Enter height as a positive number, e.g. 170.5";
    } else if (parseFloat(values.height) <= 0) {
        errors.height = "Height must be greater than 0";
    } else if (parseFloat(values.height) < 30 || parseFloat(values.height) > 300) {
        errors.height = "Height must be between 30 and 300 cm";
    }

    // Weight Validation
    if (!values.weight) {
        errors.weight = "Weight is required";
    } else if (!/^\d+(\.\d{1,3})?$/.test(values.weight)) {
        errors.weight = "Enter weight as a positive number, e.g. 65.5";
    } else if (parseFloat(values.weight) <= 0) {
        errors.weight = "Weight must be greater than 0";
    } else if (parseFloat(values.weight) < 0.5 || parseFloat(values.weight) > 500) {
        errors.weight = "Weight must be between 0.5 and 500 kg";
    }

    if (!values.symptomsFirstNoted) {
        errors.symptomsFirstNoted =
        "Date Symptoms First Noted is required";
    }

    if (!values.tobaccoSmokingStatus) {
        errors.tobaccoSmokingStatus =
        "Tobacco Smoking Status is required";
    }

    if (!values.tobaccoTreatment) {
        errors.tobaccoTreatment =
        "Tobacco Treatment is required";
    }

    if (!values.currentAlcoholIntake) {
        errors.currentAlcoholIntake =
        "Current Alcohol Intake is required";
    }

    if (!values.pastAlcoholIntake) {
        errors.pastAlcoholIntake =
        "Past Alcohol Intake is required";
    }

    if (!values.currentPhysicalActivity) {
        errors.currentPhysicalActivity =
        "Current Physical Activity is required";
    }

    if (!values.menstrualStatus) {
        errors.menstrualStatus =
        "Menstrual Status is required";
    }

    return errors;
};

export default function Assessment() {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    } = useForm(
    {
        date: "",
        performanceStatus: "",
        secondaryDiagnosis: "",
        otherSignificantDiagnosisSubsidiaryComment: "",
        familialCancerSyndrome: "",
        familialCancerComment: "",
        diabetesIndicator: "",
        // units: "metric",
        height: "",
        weight: "",
        bmi: "",
        bsa: "",
        symptomsFirstNoted: "",
        tobaccoSmokingStatus: "",
        tobaccoTreatment: "",
        currentAlcoholIntake: "",
        pastAlcoholIntake: "",
        currentPhysicalActivity: "",
        menstrualStatus: "",
    },
    validate
    );

    const [performanceStatusOptions, setPerformanceStatusOptions] = useState([]);
    const [familialCancerOptions, setFamilialCancerOptions] = useState([]);
    const [diabetesOptions, setDiabetesOptions] = useState([]);
    const [tobaccoSmokingOptions, setTobaccoSmokingOptions] = useState([]);
    const [tobaccoTreatmentOptions, setTobaccoTreatmentOptions] = useState([]);
    const [currentAlcoholCurrentOptions, setCurrentAlcoholCurrentOptions] = useState([]);
    const [currentAlcoholPastOptions, setCurrentAlcoholPastOptions] = useState([]);
    const [physicalActivityOptions, setPhysicalActivityOptions] = useState([]);
    const [menopausalStatusOptions, setMenopausalStatusOptions] = useState([]);

    const loadCosdValues = async (cosdDataId, setter) => {
        try {
            const response = await getCosdValues(cosdDataId);

            setter(
            response.data.map((item) => ({
                value: item.code,
                label: item.description,
            }))
            );
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadCosdValues(1, setPerformanceStatusOptions);
        loadCosdValues(4, setFamilialCancerOptions);
        loadCosdValues(6, setDiabetesOptions);
        loadCosdValues(11, setTobaccoSmokingOptions);
        loadCosdValues(12, setTobaccoTreatmentOptions);
        loadCosdValues(13, setCurrentAlcoholPastOptions);
        loadCosdValues(14, setPhysicalActivityOptions);
        loadCosdValues(15, setMenopausalStatusOptions);
        loadCosdValues(16, setCurrentAlcoholCurrentOptions);
    }, []);

    useEffect(() => {
        const heightCm = parseFloat(values.height);
        const weight = parseFloat(values.weight);

        const isValidHeight = !isNaN(heightCm) && heightCm >= 30 && heightCm <= 250;
        const isValidWeight = !isNaN(weight) && weight >= 0.5 && weight <= 500;

        if (!isValidHeight || !isValidWeight) {
            setFieldValue("bmi", "");
            setFieldValue("bsa", "");
            return;
        }

        const heightM = heightCm / 100;

        const bmi = (weight / (heightM * heightM)).toFixed(2);
        const bsa = Math.sqrt((heightCm * weight) / 3600).toFixed(2);

        setFieldValue("bmi", bmi);
        setFieldValue("bsa", bsa);
    }, [values.height, values.weight]);

    const onSubmit = async (formValues) => {
        console.log(formValues);

        // Call your POST API here
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-md p-6"
        >
        <h3 className="text-primary p-2 bg-[#EAF0FB] font-semibold text-sm uppercase tracking-wide border-l-4 border-primary pl-3 mb-6">
            Assessment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DateTimePicker
                label="Date"
                name="date"
                value={values.date}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.date}
                touched={touched.date}
                labelClassName="text-green-700"
                triggerClassName="border-green-600"
            />
            <div>
                <Select
                label="Performance Status"
                name="performanceStatus"
                value={values.performanceStatus}
                onChange={handleChange}
                error={errors.performanceStatus}
                touched={touched.performanceStatus}
                options={performanceStatusOptions}
                dropdownMode="overlay"
                required  
                labelClassName="text-green-700"
                triggerClassName="border-green-600"
            />
            </div>

            <Input
                label="Secondary Diagnosis"
                name="secondaryDiagnosis"
                value={values.secondaryDiagnosis}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.secondaryDiagnosis}
                touched={touched.secondaryDiagnosis}
                required
                inputClassName="border-green-600"
                labelClassName="text-green-700"        
            />

            <Input
                label="Other Significant Diagnosis Subsidiary Comment"
                name="otherSignificantDiagnosisSubsidiaryComment"
                value={values.otherSignificantDiagnosisSubsidiaryComment}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.otherSignificantDiagnosisSubsidiaryComment}
                touched={touched.otherSignificantDiagnosisSubsidiaryComment}
                inputClassName="border-green-600"
                labelClassName="text-green-700"
            />

            <div>
                <Select
                    label="Familial Cancer Syndrome"
                    name="familialCancerSyndrome"
                    value={values.familialCancerSyndrome}
                    onChange={handleChange}
                    error={errors.familialCancerSyndrome}
                    touched={touched.familialCancerSyndrome}
                    options={familialCancerOptions}
                    dropdownMode="overlay"
                    labelClassName="text-green-700"
                    triggerClassName="border-green-600"
                />
            </div>

            <Input
                label="Familial Cancer Syndrome Subsidiary Comment"
                name="familialCancer"
                value={values.familialCancerComment}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.familialCancerComment}
                touched={touched.familialCancerComment}
                required
                inputClassName="border-green-600"
                labelClassName="text-green-700"
            />

            <div>
            <Select
                label="Diabetes Indicator"
                name="diabetesIndicator"
                value={values.diabetesIndicator}
                onChange={handleChange}
                error={errors.diabetesIndicator}
                touched={touched.diabetesIndicator}
                dropdownMode="overlay"
                options={diabetesOptions}
                labelClassName="text-green-700"
                triggerClassName="border-green-600"
                />
            </div>

        </div>

        <h3 className="text-primary p-2 bg-[#EAF0FB] font-semibold text-sm uppercase tracking-wide border-l-4 border-primary pl-3 mt-10 mb-6">
            Height & Weight
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Input
                label="Height (cm)"
                name="height"
                type="number"
                step="0.01"
                min="0"
                value={values.height}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.height}
                touched={touched.height}
                inputClassName="border-green-600"
                labelClassName="text-green-700"
            />

            <Input
                label="Weight (kg)"
                name="weight"
                type="number"
                step="0.001"
                min="0"
                value={values.weight}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.weight}
                touched={touched.weight}
                inputClassName="border-green-600"
                labelClassName="text-green-700"
            />

            <Input
                label="BMI"
                name="bmi"
                value={values.bmi}
                // error={errors.bmi}
                // touched={touched.bmi}
                disabled
                inputClassName="border-green-600"
                labelClassName="text-green-700"
            />

            <Input
                label="BSA"
                name="bsa"
                value={values.bsa}
                // error={errors.bsa}
                // touched={touched.bsa}
                disabled
                inputClassName="border-green-600"
                labelClassName="text-green-700"
            />
        </div>

        <h3 className="text-primary p-2 bg-[#EAF0FB] font-semibold text-sm uppercase tracking-wide border-l-4 border-primary pl-3 mt-10 mb-6">
            Lifestyle & History
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DateTimePicker
                label="Date Symptoms First Noted"
                name="symptomsFirstNoted"
                value={values.symptomsFirstNoted}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.symptomsFirstNoted}
                touched={touched.symptomsFirstNoted}
                labelClassName="text-green-700"
                triggerClassName="border-green-600"
            />

            <div>
                <Select
                    label="Tobacco Smoking Status"
                    name="tobaccoSmokingStatus"
                    value={values.tobaccoSmokingStatus}
                    onChange={handleChange}
                    error={errors.tobaccoSmokingStatus}
                    touched={touched.tobaccoSmokingStatus}
                    dropdownMode="overlay"
                    options={tobaccoSmokingOptions}
                    labelClassName="text-green-700"
                    triggerClassName="border-green-600"
                />
            </div>

            <div>
                <Select
                    label="Tobacco Treatment Cessation Treatment"
                    name="tobaccoTreatment"
                    value={values.tobaccoTreatment}
                    onChange={handleChange}
                    error={errors.tobaccoTreatment}
                    touched={touched.tobaccoTreatment}
                    dropdownMode="overlay"
                    options={tobaccoTreatmentOptions}
                    labelClassName="text-green-700"
                    triggerClassName="border-green-600"
                />
            </div>

            <div>
                <Select
                    label="Current Alcohol Intake"
                    name="currentAlcoholIntake"
                    value={values.currentAlcoholIntake}
                    onChange={handleChange}
                    error={errors.currentAlcoholIntake}
                    touched={touched.currentAlcoholIntake}
                    dropdownMode="overlay"
                    options={currentAlcoholCurrentOptions}
                    labelClassName="text-green-700"
                    triggerClassName="border-green-600"
                />
            </div>

            <div>
                <Select
                    label="Past Alcohol Intake"
                    name="pastAlcoholIntake"
                    value={values.pastAlcoholIntake}
                    onChange={handleChange}
                    error={errors.pastAlcoholIntake}
                    touched={touched.pastAlcoholIntake}
                    dropdownMode="overlay"
                    options={currentAlcoholPastOptions}
                    labelClassName="text-green-700"
                    triggerClassName="border-green-600"
                />
            </div>

            <div>
                <Select
                    label="Current Physical Activity"
                    name="currentPhysicalActivity"
                    value={values.currentPhysicalActivity}
                    onChange={handleChange}
                    error={errors.currentPhysicalActivity}
                    touched={touched.currentPhysicalActivity}
                    dropdownMode="overlay"
                    options={physicalActivityOptions}
                    labelClassName="text-green-700"
                    triggerClassName="border-green-600"
                />
            </div>

            <div>
                <Select
                    label="Menstrual Status"
                    name="menstrualStatus"
                    value={values.menstrualStatus}
                    onChange={handleChange}
                    error={errors.menstrualStatus}
                    touched={touched.menstrualStatus}
                    dropdownMode="overlay"
                    options={menopausalStatusOptions}
                    labelClassName="text-green-700"
                    triggerClassName="border-green-600"
                />
            </div>

        </div>

        <div className="flex justify-end mt-8">
            <Button type="submit">
                Submit
            </Button>
        </div>
        </form>
    );
}