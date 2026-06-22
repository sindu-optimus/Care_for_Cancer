import { useEffect, useState } from "react";
import Table from "../../components/ui/Table";
import { getPatientInvestigationMDT } from "../../services/investigationService";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await getPatientInvestigationMDT();
      setData(response.data || []);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "mdtType",
      label: "MDT Type",
    },
    {
      key: "meetingDateTime",
      label: "Meeting Date & Time",
      render: (row) =>
        row.meetingDateTime
          ? new Date(row.meetingDateTime).toLocaleString("en-GB")
          : "-",
    },
    {
      key: "patientName",
      label: "Name",
      render: (row) =>
        `${row.patientFirstname || ""} ${row.patientSurname || ""}`.trim(),
    },
    {
      key: "patientNhsNumber",
      label: "NHS Number",
    },
    {
      key: "clinicalNotes",
      label: "Clinical Notes",
    },
  ];

  return (
    <div className="flex min-h-full bg-[#EAF0FB]">
      <div className="flex flex-col flex-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-text mb-6">
          Dashboard
        </h2>

        <div className="bg-white rounded-2xl shadow-md">
          {/* <div className="px-4 sm:px-6 py-5 border-b border-gray-100">
            <h2 className="font-heading font-bold text-xl text-text">
              Patients Added to This Meeting
            </h2>
          </div> */}

          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : data.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No data found
            </div>
          ) : (
            <Table columns={columns} data={data} />
          )}
        </div>
      </div>
    </div>
  );
}