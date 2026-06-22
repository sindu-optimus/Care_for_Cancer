import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";

import { getReferralsByPatientId } from "../../services/referralService";

import { FaArrowLeft } from "react-icons/fa";

export default function PatientDetails() {

    const [referralData, setReferralData] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { state } = useLocation();

    const patient = state?.patient;

    useEffect(() => {
        if (!patient?.id) return;

        const fetchReferrals = async () => {
            try {
                setLoading(true);

                const response = await getReferralsByPatientId(patient.id);

                const formattedData = response.data.map((referral) => ({
                    ...referral,
                    referralReceivedDate: new Date(
                        referral.referralReceivedDate
                    ).toLocaleString("en-GB"),
                    appointmentDate: new Date(
                        referral.appointmentDate
                    ).toLocaleString("en-GB"),
                    systemCreatedDateTime: new Date(
                        referral.systemCreatedDateTime
                    ).toLocaleString("en-GB"),
                    }));

                setReferralData(formattedData);
            } catch (error) {
                console.error("Error fetching referrals:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReferrals();
    }, [patient?.id]);

    const referralColumns = [
    {
        key: "cancerType",
        label: "Cancer Type",
    },
    {
        key: "priorityDescription",
        label: "Priority",
    },
    {
        key: "pathwayUbrnId",
        label: "Pathway UBRN",
    },
    // {
    //     key: "appointmentDate",
    //     label: "Appointment Date",
    // },
    // {
    //     key: "appointmentStatus",
    //     label: "Appointment Status",
    // },
    {
        key: "appointmentClinicianName",
        label: "Appointment Clinician",
    },
    {
        key: "referralClinician",
        label: "Referral Clinician",
    },
    {
        key: "referralReceivedDate",
        label: "Referral Received Date",
    },
    ];

    if (!patient) {
        return (
        <div className="p-4 sm:p-6 lg:p-10">
            Patient not found.
        </div>
        );
    }

    return (
        <main className="flex-1">
            <div
                className="flex items-center gap-2 mb-6 cursor-pointer text-primary font-medium"
                onClick={() => navigate(-1)}
            >
                <FaArrowLeft />
                <span>Back to Search Patient</span>
            </div>

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
            <div className="bg-white mt-6 sm:mt-10 rounded-2xl shadow-md overflow-hidden">
                <div className="px-4 sm:px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-heading font-bold text-xl text-text">
                        Referrals
                    </h2>
                </div>
                <Table
                    columns={referralColumns}
                    data={referralData}
                    onRowClick={(row) => {
                        navigate(
                        `/search-patient/${patient.id}/referrals/${row.id}`,
                        {
                            state: {
                            patient,
                            referral: row,
                            },
                        }
                        );
                    }}
                />
            </div>
        </main>
    );
}
