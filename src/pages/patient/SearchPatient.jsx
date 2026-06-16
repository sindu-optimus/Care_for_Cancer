import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FiPlus } from "react-icons/fi";
import { FaEye } from "react-icons/fa";

import SearchForm from "../../components/SearchForm";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";

import { searchPatients } from "../../services/patientService";

export default function SearchPatient() {
  const [results, setResults]     = useState([]);
  const [searched, setSearched]   = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [lastSearchParams, setLastSearchParams] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await searchPatients({});
      setResults(response.data);
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

  const columns = [
    { key: "id", label: "S.No", render: (_, index) => index + 1 },
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

    {
      key: "view",
      label: "View",
      render: (row) => (
        <button
          className="text-primary font-medium cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/search-patient/${row.id}`, {
              state: { patient: row },
            });
          }}
        >
          <FaEye size={18} />
        </button>
      ),
    },
  ];

  return (
    <main className="flex-1">
      <SearchForm
        onResults={(data, params) => {
          setResults(data);
          setSearched(true);
          setLastSearchParams(params); 
        }}
      />

      {searched && (
        <div className="bg-white mt-6 sm:mt-10 rounded-2xl shadow-md overflow-hidden">
          <div className="px-4 sm:px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-heading font-bold text-xl text-text">
              Patients List
            </h2>
          </div>
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
    </main>
  );
}
