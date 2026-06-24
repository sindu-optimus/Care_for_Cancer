import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import MultiSelect from "../../components/ui/MultiSelect";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Table from "../../components/ui/Table";
import VoiceButton from "../../components/ui/VoiceButton";
import ConfirmModal from "../../components/ui/ConfirmModal";
import FieldError from "../../components/ui/FieldError";

import useForm from "../../hooks/useForm";

import { searchPatients } from "../../services/patientService";
import { getInvestigations, getInvestigationCatalogues, createPatientInvestigationMDT } from "../../services/investigationService";

//Patient Search Validation
const validateSearch = (values) => {
  const errors = {};
  if (!values.nhsNumber.trim() && !values.mrnNumber.trim())
    errors.nhsNumber = "Enter either NHS Number or MRN Number";
  if (values.nhsNumber && !/^\d+$/.test(values.nhsNumber))
    errors.nhsNumber = "NHS Number must contain only numbers";
  else if (values.nhsNumber && values.nhsNumber.length !== 10)
    errors.nhsNumber = "NHS Number must be exactly 10 digits";
  return errors;
};

const validateMeetingDetails = (values) => {
  const errors = {};
  if (!values.patientId)
    errors.patientId = "Please select a patient";
  if (!values.mdtMeetingId)
    errors.mdtMeetingId = "Meeting details are required";
  if (!values.catalogueIds || values.catalogueIds.length === 0)
    errors.catalogueIds = "Please select at least one catalogue";
  if (!values.clinicalNotes.trim())
    errors.clinicalNotes = "Clinical Notes is required";
  return errors;
};

export default function MeetingDetails() {
  const navigate    = useNavigate();
  const { state }   = useLocation();
  const meeting     = state?.meeting;

  const [liveSpeech,         setLiveSpeech]         = useState("");
  const [selectedInvestigations, setSelectedInvestigations] = useState({});
  const [investigationOptions, setInvestigationOptions] = useState([]);
  const [catalogues, setCatalogues] = useState({}); 
  const [catalogueLoading, setCatalogueLoading] = useState(false);

  //Patient search state
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  //Confirm modal
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [addedPatients, setAddedPatients] = useState([]);
  const [submitError, setSubmitError] = useState("");

  const {
    values: searchValues,
    errors: searchErrors,
    touched: searchTouched,
    handleChange: handleSearchChange,
    handleBlur: handleSearchBlur,
    handleSubmit: handleSearchSubmit,
    resetForm: resetSearchForm,
  } = useForm({ nhsNumber: "", mrnNumber: "" }, validateSearch);

  const {
    values: detailsValues,
    errors: detailsErrors,
    touched: detailsTouched,
    handleSubmit: handleDetailsSubmit,
    resetForm: resetDetailsForm,
    setFieldValue: setDetailsFieldValue,
  } = useForm({
    patientId: "",
    mdtMeetingId: meeting?.id || "",
    catalogueIds: [],
    clinicalNotes: "",
  }, validateMeetingDetails);

  useEffect(() => {
    let cancelled = false;

    getInvestigations()
      .then((response) => {
        if (!cancelled) {
          setInvestigationOptions(response.data);
        }
      })
      .catch((error) => {
        console.error("Failed to load investigations", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

    const fetchCatalogues = async (investigationId) => {
     // already fetched — don't call again
        if (catalogues[investigationId]) return;

        try {
            setCatalogueLoading(true);
            const response = await getInvestigationCatalogues(investigationId);
            console.log("Catalogue Response:", response.data);
            setCatalogues((prev) => ({
            ...prev,
            [investigationId]: response.data,
            }));
        } catch (error) {
            console.error("Failed to load catalogues", error);
        } finally {
            setCatalogueLoading(false);
        }
    };

  const handleLiveSpeech  = (text) => setLiveSpeech(text);
  const handleFinalSpeech = (text) => {
    setDetailsFieldValue(
      "clinicalNotes",
      detailsValues.clinicalNotes ? `${detailsValues.clinicalNotes} ${text}` : text
    );
    setLiveSpeech("");
  };

  const onSearchSubmit = handleSearchSubmit(async (formValues) => {
    try {
      setSearchLoading(true);
      setSearchError("");
      const params = {};
      if (formValues.nhsNumber) params.nhsNumber = formValues.nhsNumber;
      if (formValues.mrnNumber) params.mrn        = formValues.mrnNumber;
      const response = await searchPatients(params);
      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (error) {
      if (error.response?.status === 404) {
        setSearchError("No patients found.");
        setSearchResults([]);
      } else {
        setSearchError("Something went wrong. Please try again.");
      }
    } finally {
      setSearchLoading(false);
    }
  });

  const toggleSelectPatient = (row) => {
    setSelectedPatient(row);
    setDetailsFieldValue("patientId", row.id);
    setShowSearchResults(false);
  };

  const clearSelectedPatient = () => {
    setSelectedPatient(null);
    setSearchResults([]);
    setShowSearchResults(false);
    setDetailsFieldValue("patientId", "");
  };

  const isSelected = (row) => selectedPatient?.id === row.id;

  //Search results columns 
  const searchColumns = [
    {
      key: "select",
      label: "",
      render: (row) => (
        <input
          type="radio"
          name="selectedPatient"
          checked={isSelected(row)}
          onChange={() => toggleSelectPatient(row)}
          className="w-4 h-4 accent-primary cursor-pointer"
        />
      ),
    },
    { key: "mrn",       label: "MRN" },
    { key: "nhsNumber", label: "NHS Number" },
    {
      key: "name",
      label: "Name",
      render: (row) => {
        const { title, firstname, lastname } = row.demographics || {};
        return [title, firstname, lastname].filter(Boolean).join(" ") || "-";
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

  //Selected patients preview columns 
  const previewColumns = [
    { key: "mrn",       label: "MRN" },
    { key: "nhsNumber", label: "NHS Number" },
    {
      key: "name",
      label: "Name",
      render: (row) => {
        const { title, firstname, lastname } = row.demographics || {};
        return [title, firstname, lastname].filter(Boolean).join(" ") || "-";
      },
    },
    {
      key: "surname",
      label: "Surname",
      render: (row) => row.demographics?.surname || "-",
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
      key: "remove",
      label: "",
      render: () => (
      <button
        onClick={clearSelectedPatient}
        className="text-red-500 hover:text-red-600 text-sm font-medium"
      >
        Remove
      </button>
      ),
    },
  ];

  const updateSelectedInvestigations = (nextSelectedInvestigations) => {
    setSelectedInvestigations(nextSelectedInvestigations);
    setDetailsFieldValue(
      "catalogueIds",
      Object.values(nextSelectedInvestigations).flat()
    );
  };

  const handleSave = handleDetailsSubmit(async (formValues) => {
    const payload = {
      patientId: formValues.patientId,
      catalogueIds: formValues.catalogueIds,
      mdtMeetingId: formValues.mdtMeetingId,
      clinicalNotes: formValues.clinicalNotes.trim(),
    };

    console.log("payload", payload);

    try {
      setSubmitError("");
      const response = await createPatientInvestigationMDT(payload);

      console.log("Submit Payload:", payload);
      console.log("Response:", response.data);

      setAddedPatients((prev) => [
        ...prev,
        {
          mdtType: meeting?.mdtType,
          meetingDateTime: meeting?.meetingDateTime,
          patientName: `${selectedPatient?.demographics?.firstname || ""} ${
            selectedPatient?.demographics?.surname || ""
          }`,
          nhsNumber: selectedPatient?.nhsNumber,
          clinicalNotes: payload.clinicalNotes,
        },
      ]);

      setShowContinueModal(true);
    } catch (error) {
      console.error("Failed to save MDT investigation", error);

      if (error.response?.status === 409) {
        setSubmitError(error.response.data.message);
      } else {
        setSubmitError(
          "Failed to submit meeting details. Please try again."
        );
      }
    }
  });

  const handleContinue = () => {
    setShowContinueModal(false);

    setSelectedPatient(null);
    setSearchResults([]);
    setShowSearchResults(false);

    setSelectedInvestigations({});
    resetDetailsForm();
    setLiveSpeech("");
    setSubmitError("");

    resetSearchForm();
  };

  const addedPatientsColumns = [
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
      label: "Patient Name",
    },
    {
      key: "nhsNumber",
      label: "NHS Number",
    },
    {
      key: "clinicalNotes",
      label: "Clinical Notes",
    },
  ];

  const handleFinish = () => {
    navigate("/mdt/dashboard");
  };

  return (
    <div className="flex-1 overflow-auto">
      <div
        className="flex items-center gap-2 mb-6 cursor-pointer text-primary font-medium"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft />
        <span>Back to Schedule Meetings</span>
      </div>

      <div className="bg-white rounded-2xl shadow-md mb-6 p-6 space-y-8">

        {/* Meeting Information */}
        <div>
          <h3 className="text-primary p-2 bg-[#EAF0FB] font-semibold text-sm uppercase tracking-wide border-l-4 border-primary pl-3 mb-5">
            Meeting Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">MDT Type</label>
              <p className="font-medium">{meeting?.mdtType || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Meeting Date & Time</label>
              <p className="font-medium">
                {meeting?.meetingDateTime
                  ? new Date(meeting.meetingDateTime).toLocaleString("en-GB")
                  : "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Clinicians</label>
              <p className="font-medium">
                {meeting?.clinicians?.length
                  ? meeting.clinicians.map((c) => `${c.firstname} ${c.surname}`).join(", ")
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-start gap-4">
            <h3 className="font-semibold text-lg whitespace-nowrap pt-9">
              Add Patient :
            </h3>

            <div className="flex-1">
              <Input
                label="NHS Number"
                name="nhsNumber"
                type="text"
                placeholder="Enter NHS Number"
                value={searchValues.nhsNumber}
                onChange={handleSearchChange}
                onBlur={handleSearchBlur}
                error={searchErrors.nhsNumber}
                touched={searchTouched.nhsNumber}
                maxLength={10}
                // disabled={!!selectedPatient}
              />
            </div>

            <div className="pt-9 font-semibold text-slate-700">
              OR
            </div>

            <div className="flex-1">
              <Input
                label="MRN Number"
                name="mrnNumber"
                type="text"
                placeholder="Enter MRN Number"
                value={searchValues.mrnNumber}
                onChange={handleSearchChange}
                onBlur={handleSearchBlur}
                error={searchErrors.mrnNumber}
                touched={searchTouched.mrnNumber}
                // disabled={!!selectedPatient}
              />
            </div>

            <button
              onClick={onSearchSubmit}
              disabled={searchLoading || !!selectedPatient}
              className={`mt-7 text-white px-4 py-2 rounded-lg font-semibold ${
                searchLoading || selectedPatient
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary  cursor-pointer"
              }`}
            >
              {searchLoading ? "Searching..." : "Search"}
            </button>
          </div>

          {searchError && (
            <div className="mt-2 text-sm text-red-500">
              {searchError}
            </div>
          )}

          {/* Search Results */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-slate-700">
                  Search Results
                  <span className="ml-2 text-sm text-slate-400">
                    ({searchResults.length} found — select to add)
                  </span>
                </h4>
              </div>

              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <Table
                  columns={searchColumns}
                  data={searchResults}
                  onRowClick={(row) => toggleSelectPatient(row)}
                />
              </div>
            </div>
          )}

          {selectedPatient && (
            <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
              Only one patient can be added to this meeting.
              Remove the selected patient to search for another patient.
            </div>
          )}

          {/* Selected Patients */}
          {selectedPatient && (
            <div>
              <h4 className="font-semibold text-slate-700 mb-3">
                Selected Patients
                <span className="ml-2 text-sm font-normal text-slate-400">
                  ({selectedPatient ? 1 : 0} selected)
                </span>
              </h4>

              <div className="rounded-xl border border-primary/30 overflow-hidden">
                <Table
                  columns={previewColumns}
                  data={[selectedPatient]}
                />
              </div>
            </div>
          )}

          <FieldError
            error={detailsErrors.patientId}
            touched={detailsTouched.patientId}
          />
        </div>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <label className="font-semibold">Clinical Notes</label>
            <VoiceButton
              onLiveTranscript={handleLiveSpeech}
              onFinalTranscript={handleFinalSpeech}
            />
          </div>
          <textarea
            value={detailsValues.clinicalNotes + (liveSpeech ? ` ${liveSpeech}` : "")}
            onChange={(e) => {
              setDetailsFieldValue("clinicalNotes", e.target.value);
              setLiveSpeech("");
            }}
            rows={4}
            placeholder="Enter clinical notes"
            className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              detailsErrors.clinicalNotes && detailsTouched.clinicalNotes
                ? "border-red-400 bg-red-50"
                : "border-gray-300 focus:border-primary"
            }`}
          />
          <FieldError
            error={detailsErrors.clinicalNotes}
            touched={detailsTouched.clinicalNotes}
          />
        </div>

        <div>
          <label className="block mb-4 font-semibold">Investigation</label>
          <div className="grid grid-cols-3 gap-8">
              {investigationOptions.map((item) => (
                <div key={item.id} className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedInvestigations[item.id]}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateSelectedInvestigations({
                            ...selectedInvestigations,
                            [item.id]: [],
                          });

                          fetchCatalogues(item.id);
                        } else {
                          const updated = { ...selectedInvestigations };
                          delete updated[item.id];
                          updateSelectedInvestigations(updated);
                        }
                      }}
                    />
                    {/* Capitalize first letter, rest lowercase */}
                    {item.type.charAt(0) + item.type.slice(1).toLowerCase()}
                    </label>

                    {selectedInvestigations[item.id] && (
                      <>
                        {catalogueLoading ? (
                          <p className="text-sm text-gray-500">
                            Loading catalogues...
                          </p>
                        ) : (
                          <MultiSelect
                            dropdownMode="overlay"
                            selectedValues={selectedInvestigations[item.id]}
                            onChange={(values) => {
                              updateSelectedInvestigations({
                                ...selectedInvestigations,
                                [item.id]: values,
                              });
                            }}
                            options={
                              catalogues[item.id]?.map((c) => ({
                                value: c.id,
                                label: `${c.code} - (${c.description})`,
                              })) || []
                            }
                          />
                        )}

                        {selectedInvestigations[item.id]?.length > 0 && (
                          <div className="mt-2 text-sm text-slate-600">
                            Selected:
                            {catalogues[item.id]
                              ?.filter((c) =>
                                selectedInvestigations[item.id].includes(c.id)
                              )
                              .map((c) => (
                                <div key={c.id}>
                                  {c.code} - {c.description}
                                </div>
                              ))}
                          </div>
                        )}
                      </>
                    )}
                </div>
              ))}
          </div>
          <FieldError
            error={detailsErrors.catalogueIds}
            touched={detailsTouched.catalogueIds}
          />
        </div>    

        {submitError && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {submitError}
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSave}>Submit</Button>
        </div>
      </div>

      {showContinueModal && (
        <ConfirmModal
          title="Meeting Details Submitted"
          message="Meeting details are successfully submitted. Would you like to add another patient?"
          confirmText="Add Another Patient"
          cancelText="Finish"
          onConfirm={handleContinue}
          onClose={handleFinish}
        />
      )}

      {addedPatients.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md">
          <div className="px-4 sm:px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-heading font-bold text-xl text-text">
                Patients Added to This Meeting
              </h2>
          </div>
          <Table
            columns={addedPatientsColumns}
            data={addedPatients}
          />
        </div>
      )}
    </div>
  );
}
