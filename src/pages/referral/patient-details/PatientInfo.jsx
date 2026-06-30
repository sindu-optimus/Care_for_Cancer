import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getReferrals } from "../../../services/referralService";

import { FaArrowLeft } from "react-icons/fa";

export default function PatientDetails() {

    const [activeTab, setActiveTab] = useState("patient");

    const [referral, setReferral] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { state } = useLocation();

    const patient = state?.patient;

    useEffect(() => {
        if (!patient?.id) return;

        const fetchReferrals = async () => {
            try {
                setLoading(true);

                const response = await getReferrals({
                    patientId: patient.id,
                });
                const referral = response.data?.[0];

            if (referral) {
                setReferral({
                    ...referral,
                    referralReceivedDate: referral.referralReceivedDate
                        ? new Date(referral.referralReceivedDate).toLocaleString("en-GB")
                        : "-",
                    appointmentDate: referral.appointmentDate
                        ? new Date(referral.appointmentDate).toLocaleString("en-GB")
                        : "-",
                });
            } else {
                setReferral(null);
            }
            } catch (error) {
                console.error("Error fetching referrals:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReferrals();
    }, [patient?.id]);

    if (!patient) {
        return (
        <div className="p-4 sm:p-6 lg:p-10">
            Patient not found.
        </div>
        );
    }

    return (
        <main className="flex-1">
            {/* <div
                className="flex items-center gap-2 mb-6 cursor-pointer text-primary font-medium"
                onClick={() => navigate(-1)}
            >
                <FaArrowLeft />
                <span>Back to Search Patient</span>
            </div> */}

            <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
                {/* <h2 className="font-heading font-bold text-xl text-text mb-6">
                    Patient Details
                </h2> */}

                <h3 className="text-primary p-2 bg-[#EAF0FB] font-semibold text-sm uppercase tracking-wide border-l-4 border-primary pl-3 mb-5">
                    Patient Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                    <strong>Title:</strong> {patient.demographics?.title || "-"}
                    </div>

                    <div>
                    <strong>First Name:</strong> {patient.demographics?.firstname || "-"}
                    </div>

                    <div>
                    <strong>Surname:</strong> {patient.demographics?.surname || "-"}
                    </div>

                    <div>
                    <strong>MRN:</strong> {patient.mrn || "-"}
                    </div>

                    <div>
                    <strong>NHS Number:</strong> {patient.nhsNumber || "-"}
                    </div>

                    <div>
                    <strong>Gender:</strong> {patient.demographics?.gender || "-"}
                    </div>

                    <div>
                    <strong>Date of Birth:</strong>{" "}
                    {patient.demographics?.dob
                        ? new Date(patient.demographics.dob).toLocaleDateString("en-GB")
                        : "-"}
                    </div>

                    <div>
                    <strong>Status:</strong>{" "}
                    {patient.isActive ? "Active" : "Inactive"}
                    </div>
                </div>

                <h3 className="text-primary p-2 bg-[#EAF0FB] font-semibold text-sm uppercase tracking-wide border-l-4 border-primary pl-3 mt-10 mb-5">
                    Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                    <strong>Mobile:</strong>{" "}
                    {patient.demographics?.mobile || "-"}
                    </div>

                    <div>
                    <strong>Work:</strong>{" "}
                    {patient.demographics?.work || "-"}
                    </div>

                    <div>
                    <strong>Business:</strong>{" "}
                    {patient.demographics?.business || "-"}
                    </div>

                    <div>
                    <strong>Address:</strong>{" "}
                    {patient.address
                        ? [
                            patient.address.addressLine1,
                            patient.address.addressLine2,
                            patient.address.addressLine3,
                            patient.address.addressLine4,
                            patient.address.postcode,
                        ]
                            .filter(Boolean)
                            .join(", ")
                        : "-"}
                    </div>
                </div>

                <h3 className="text-primary  p-2 bg-[#EAF0FB] font-semibold text-sm uppercase tracking-wide border-l-4 border-primary pl-3 mt-4 mb-5">
                    Additional Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                    <strong>Ethnicity:</strong>{" "}
                    {patient.demographics?.ethnicity || "-"}
                    </div>

                    <div>
                    <strong>Marital Status:</strong>{" "}
                    {patient.demographics?.maritalStatus || "-"}
                    </div>
                </div>
            </div>
            <div className="bg-white mt-6 sm:mt-10 rounded-2xl shadow-md p-6">
                <h2 className="font-heading font-bold text-xl text-text mb-6">
                    Referral Details
                </h2>

                {loading ? (
                    <p>Loading...</p>
                ) : !referral ? (
                    <p className="text-gray-500">No referral found.</p>
                ) : (
                    <>
                        <h3 className="text-primary p-2 bg-[#EAF0FB] font-semibold text-sm uppercase tracking-wide border-l-4 border-primary pl-3 mb-5">
                            Referral Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <strong>Referral Clinician:</strong>{" "}
                                {referral.referralClinician || "-"}
                            </div>

                            <div>
                                <strong>Cancer Type:</strong>{" "}
                                {referral.cancerType || "-"}
                            </div>

                            <div>
                                <strong>Speciality:</strong>{" "}
                                {referral.specialityDescription || "-"}
                            </div>

                            <div>
                                <strong>Priority:</strong>{" "}
                                {referral.priorityDescription || "-"}
                            </div>

                            <div>
                                <strong>Pathway UBRN ID:</strong>{" "}
                                {referral.pathwayUbrnId || "-"}
                            </div>

                            <div>
                                <strong>Referral Received Date:</strong>{" "}
                                {referral.referralReceivedDate || "-"}
                            </div>
                        </div>

                        <h3 className="text-primary p-2 bg-[#EAF0FB] font-semibold text-sm uppercase tracking-wide border-l-4 border-primary pl-3 mt-8 mb-5">
                            Appointment Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <strong>Appointment Date:</strong>{" "}
                                {referral.appointmentDate || "-"}
                            </div>

                            <div>
                                <strong>Appointment Status:</strong>{" "}
                                {referral.appointmentStatus || "-"}
                            </div>

                            <div>
                                <strong>Appointment Clinician:</strong>{" "}
                                {referral.appointmentClinicianName || "-"}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
