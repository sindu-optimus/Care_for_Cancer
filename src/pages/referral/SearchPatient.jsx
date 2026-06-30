import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FiPlus } from "react-icons/fi";
import { FaEye, FaArrowLeft } from "react-icons/fa";

import SearchForm from "../../components/SearchForm";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";

import { searchPatients } from "../../services/patientService";
import { getReferralsTypes, getReferrals } from "../../services/referralService";

export default function SearchPatient() {
  const [results, setResults]     = useState([]);
  const [searched, setSearched]   = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [lastSearchParams, setLastSearchParams] = useState({});
  const [isSearchResult, setIsSearchResult] = useState(false);
  const [referralTypes, setReferralTypes] = useState([]);
  const [selectedReferral, setSelectedReferral] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
  loadReferralTypes();
}, []);

  const loadReferralTypes = async () => {
    try {
      const response = await getReferralsTypes();

      setReferralTypes(response.data);

      if (response.data.length > 0) {
        setSelectedReferral(response.data[0]); // Select eRS by default
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedReferral) {
      loadPatients();
    }
  }, [selectedReferral]);

  const loadPatients = async () => {
    try {
      const response = await getReferrals({
        patient_referral_type: selectedReferral.id,
      });

      const patients = response.data.map((item) => ({
        ...item.patient,
        referral: item,
      }));

      setResults(patients);
      setSearched(true);
    } catch (error) {
      console.error(error);
    }
  };

   const refreshResults = async () => {
    if (Object.keys(lastSearchParams).length === 0) return;
    try {
      const response = await searchPatients(lastSearchParams);
      setResults(response.data);
    } catch (error) {
      console.error("Failed to refresh results", error);
    }
  };

  const handleBackToSearch = async () => {
    setIsSearchResult(false);
    setLastSearchParams({});

    await loadPatients();
  };

  const columns = [
    { key: "mrn", label: "MRN" },
    { key: "nhsNumber", label: "NHS Number" },

    {
      key: "firstname",
      label: "First Name",
      render: (row) => {
        const { title, firstname} = row.demographics || {};
        return [title, firstname]
          .filter(Boolean)
          .join(" ");
      },
    },

    {
      key: "surname",
      label: "Surname",
      render: (row) => row.demographics?.surname || "-",
    },

    {
      key: "gender",
      label: "Gender",
      render: (row) => row.demographics?.gender || "-",
    },

    {
      key: "dob",
      label: "Date of Birth",
      render: (row) =>
        row.demographics?.dob
          ? new Date(row.demographics.dob).toLocaleDateString("en-GB")
          : "-",
    },
  ];

  return (
    <main className="flex-1 bg-white">
      <div className="flex mb-6 border-b border-gray-300">
        {referralTypes.map((type, index) => {
          const isActive = selectedReferral?.id === type.id;
          const isFirst = index === 0;
          const isLast = index === referralTypes.length - 1;

          return (
            <button
              key={type.id}
              onClick={() => setSelectedReferral(type)}
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
              {type.name}
            </button>
          );
        })}
      </div>
      {/* <h2 className="text-2xl sm:text-3xl font-bold text-text mb-6 pl-6">
        Patient List
      </h2> */}
      <div className="pl-6">
        <h3 className="text-primary p-2 bg-[#EAF0FB] font-semibold text-sm uppercase tracking-wide border-l-4 border-primary pl-3 mb-5">
          Patient List
      </h3>
      </div>
      {searched && (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* <div className="px-4 sm:px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-heading font-bold text-xl text-text">
              Patients List
            </h2>
          </div> */}
          <Table
            columns={columns}
            data={results}
            onRowClick={(row) => {
              navigate(`/search-patient/${row.id}`, {
                state: { patient: row },
              });
            }}
          />
        </div>
      )}

      {!isSearchResult && (
        <SearchForm
          onResults={(data, params) => {
            setResults(data);
            setSearched(true);
            setLastSearchParams(params);
            setIsSearchResult(true);
          }}
        />
      )}

      {isSearchResult && (
        <div
          className="flex items-center gap-2 mt-6 cursor-pointer text-primary font-medium"
          onClick={handleBackToSearch}
        >
          <FaArrowLeft />
          <span>Back to Search Patient</span>
        </div>
      )}
    </main>
  );
}
