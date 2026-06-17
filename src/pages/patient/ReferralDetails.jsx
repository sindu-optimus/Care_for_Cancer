import { useLocation, useNavigate } from "react-router-dom";

import { FaArrowLeft } from "react-icons/fa";

export default function ReferralDetails(
  {
    id,
    patientId,
    specialityDescription,
    priorityDescription,
    cancerType,
    pathwayUbrnId,
    appointmentDate,
    appointmentStatus,
    systemCreatedDateTime,
    appointmentClinician,
    referralClinician
 }) {
  const navigate = useNavigate();
  const { state } = useLocation();

  const referral = state?.referral;
  const patient = state?.patient;

  return (
    <main className="flex-1">
      <div className="rounded-2xl mb-4">
        <div className="bg-white rounded-2xl shadow-md p-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span>
              <strong>NHS:</strong> {patient?.nhsNumber || "-"}
            </span>

            <span>
              <strong>MRN:</strong> {patient?.mrn || "-"}
            </span>

            <span>
              <strong>Name:</strong>{" "}
              {[patient?.demographics?.title,
                patient?.demographics?.firstname,
                patient?.demographics?.surname]
                .filter(Boolean)
                .join(" ") || "-"}
            </span>

            <span>
              <strong>DOB:</strong>{" "}
              {patient?.demographics?.dob
                ? new Date(patient.demographics.dob).toLocaleDateString("en-GB")
                : "-"}
            </span>

            <span>
              <strong>Gender:</strong>{" "}
              {patient?.demographics?.gender || "-"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <h2 className="font-heading font-bold text-xl text-text mb-6">
          Referral Details
        </h2>

        <h3 className="text-primary font-semibold text-sm uppercase tracking-wide border-l-4 border-primary pl-3 mb-5">
          Referral Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <strong>Referral Clinician:</strong>{" "}
            {referral?.referralClinician || "-"}
          </div>

          <div>
            <strong>Cancer Type:</strong> {referral?.cancerType || "-"}
          </div>

          <div>
            <strong>Speciality:</strong>{" "}
            {referral?.specialityDescription || "-"}
          </div>

          <div>
            <strong>Priority:</strong>{" "}
            {referral?.priorityDescription || "-"}
          </div>

          <div>
            <strong>Pathway UBRN ID:</strong>{" "}
            {referral?.pathwayUbrnId || "-"}
          </div>
        </div>

        <h3 className="text-primary font-semibold text-sm uppercase tracking-wide border-l-4 border-primary pl-3 mt-10 mb-5">
          Appointment Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <strong>Appointment Date:</strong>{" "}
            {referral?.appointmentDate || "-"}
          </div>

          <div>
            <strong>Appointment Status:</strong>{" "}
            {referral?.appointmentStatus || "-"}
          </div>

          <div>
            <strong>Appointment Clinician:</strong>{" "}
            {referral?.appointmentClinician || "-"}
          </div>
        </div>
      </div>
      <div
          className="flex items-center gap-2 mb-6 cursor-pointer text-primary font-medium mt-8"
          onClick={() => navigate(-1)}
      >
          <FaArrowLeft />
          <span>Back to View Patient Details</span>
      </div>
    </main>
  );
}
