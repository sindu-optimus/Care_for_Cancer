import { useLocation, useNavigate } from "react-router-dom";
import Table from "../components/ui/Table";

import { FaArrowLeft } from "react-icons/fa";

export default function PatientDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const patient = state?.patient;

  const referralData = [
    {
      id: "REF001",
      referralType: "Breast Cancer MDT",
      status: "Active",
      createdDate: "10/06/2026",
    },
    {
      id: "REF002",
      referralType: "Lung Cancer MDT",
      status: "Closed",
      createdDate: "20/05/2026",
    },
  ];

  const referralColumns = [
    {
      key: "id",
      label: "Referral ID",
    },
    {
      key: "referralType",
      label: "Referral Type",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "createdDate",
      label: "Created Date",
    },
  ];

  if (!patient) {
    return (
      <div className="p-10">
        Patient not found.
      </div>
    );
  }

  return (
    <main className="flex-1 p-10">
        <div
            className="flex items-center gap-2 mb-6 cursor-pointer text-primary font-medium"
            onClick={() => navigate(-1)}
        >
            <FaArrowLeft />
            <span>Back to Search Patient</span>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
            {/* <div
                className="flex items-center gap-2 mb-6 cursor-pointer text-primary font-medium"
                onClick={() => navigate(-1)}
            >
                <FaArrowLeft />
                <span>Back to NHS / MRN Search</span>
            </div> */}
            <h2 className="font-heading font-bold text-xl text-text mb-5">
                Patient Details
            </h2>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <strong>Surname:</strong>{" "}
                    {patient.demographics?.surname || "-"}
                </div>

                <div>
                    <strong>First Name:</strong>{" "}
                    {patient.demographics?.firstname || "-"}
                </div>

                <div>
                    <strong>MRN:</strong>{" "}
                    {patient.mrn || "-"}
                </div>

                <div>
                    <strong>NHS Number:</strong>{" "}
                    {patient.nhsNumber || "-"}
                </div>

                <div>
                    <strong>Date of Birth:</strong>{" "}
                    {patient.demographics?.dob
                    ? new Date(
                        patient.demographics.dob
                        ).toLocaleDateString("en-GB")
                    : "-"}
                </div>

                <div>
                    <strong>Gender:</strong>{" "}
                    {patient.demographics?.gender || "-"}
                </div>
            </div>
        </div>
        <div className="bg-white mt-10 rounded-2xl shadow-md overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
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