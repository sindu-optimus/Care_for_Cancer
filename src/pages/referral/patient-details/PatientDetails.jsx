import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { FaArrowLeft } from "react-icons/fa";

import { getReferrals } from "../../../services/referralService";

import PatientInfo from "./PatientInfo";
import Assessment from "./Assessment";

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
      <div
        className="flex items-center gap-2 mb-6 cursor-pointer text-primary font-medium"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft />
        <span>Back to Search Patient</span>
      </div>

      <div className="bg-white">
        <div className="flex mb-6 border-b border-gray-300 bg-white">
        {[
          { id: "patient", name: "Patient Details" },
          { id: "assessment", name: "Assessment" },
        ].map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isFirst = index === 0;
          const isLast = index === 1;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 font-medium transition-all border-b-2
                ${
                  isFirst
                    ? "border-r border-gray-300"
                    : isLast
                    ? "border-l border-gray-300"
                    : "border-l border-r border-gray-300"
                }
                ${
                  isActive
                    ? "bg-blue-100 text-primary border-b-primary font-bold"
                    : "bg-white text-gray-600 border-b-transparent hover:bg-gray-50"
                }
              `}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

      {activeTab === "patient" && (
        <PatientInfo
          patient={patient}
          referral={referral}
          loading={loading}
        />
      )}

      {activeTab === "assessment" && (
        <Assessment patient={patient} />
      )}
      </div>
    </main>
  );
}