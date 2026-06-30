import { useState } from "react";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";

export default function Dashboard() {
  const [patient] = useState({
    nhsNumber: "1234567890",
    mrn: "MRN001",
    demographics: {
      title: "Mr",
      firstname: "John",
      surname: "Smith",
      dob: "1985-05-20",
      gender: "Male",
    },
  });

  const [isSelectPatientOpen, setIsSelectPatientOpen] = useState(false);

  const dashboardColumns = [
    {
      key: "mdtType",
      label: "MDT Type",
    },
    {
      key: "meetingDateTime",
      label: "Meeting Date & Time",
    },
    {
      key: "investigationCatalogues",
      label: "Investigation Catalogues",
    },
    {
      key: "result",
      label: "Result",
    },
    {
      key: "referral",
      label: "Referral",
    },
  ];

  const dashboardData = [
    {
      id: 1,
      mdtType: "Lung MDT",
      meetingDateTime: "25/06/2026 10:30 AM",
      investigationCatalogues: "CT Scan, MRI Brain",
      result: "Result is still pending",
      referral: "Oncology (Urgent)",
    },
  ];

  return (
    <div className="min-h-full bg-[#EAF0FB] p-6">
      {/* Patient Details */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-1 bg-white rounded-2xl shadow-md p-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span>
              <strong>NHS:</strong> {patient.nhsNumber}
            </span>

            <span>
              <strong>MRN:</strong> {patient.mrn}
            </span>

            <span>
              <strong>Name:</strong>{" "}
              {[
                patient.demographics.title,
                patient.demographics.firstname,
                patient.demographics.surname,
              ].join(" ")}
            </span>

            <span>
              <strong>DOB:</strong>{" "}
              {new Date(patient.demographics.dob).toLocaleDateString("en-GB")}
            </span>

            <span>
              <strong>Gender:</strong> {patient.demographics.gender}
            </span>
          </div>
        </div>

        <Button
          className="h-10 px-6 whitespace-nowrap"
          onClick={() => setIsSelectPatientOpen(true)}
        >
          Select Patient
        </Button>
      </div>

      {/* Dashboard Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* <div className="px-6 py-4">
          <h2 className="font-heading font-bold text-xl text-text">
            Meeting Details
          </h2>
        </div> */}

        <Table
          columns={dashboardColumns}
          data={dashboardData}
          onRowClick={(row) => {
            console.log("Row clicked:", row);
          }}
        />
      </div>
    </div>
  );
}