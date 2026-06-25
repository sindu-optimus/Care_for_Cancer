import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Table from "../../components/ui/Table";
import {
  getPatientInvestigationMDT,
  getResultsByPatientId,
} from "../../services/investigationService";

const formatDateTime = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return value;
};

const getPatientName = (investigation) => {
  const name = [
    investigation?.patientTitle,
    investigation?.patientFirstname,
    investigation?.patientSurname,
  ]
    .filter(Boolean)
    .join(" ");

  return name || "-";
};

const getCliniciansText = (investigation) => {
  const clinicians = investigation?.clinicians || investigation?.meetingClinicians;

  if (!Array.isArray(clinicians) || clinicians.length === 0) {
    return "-";
  }

  return clinicians
    .map((clinician) =>
      [clinician?.title, clinician?.firstname, clinician?.surname]
        .filter(Boolean)
        .join(" ")
    )
    .filter(Boolean)
    .join(", ");
};

const getResultText = (resultItem) => {
  if (!resultItem) {
    return "Results are still pending";
  }

  return resultItem.result || "Results are still pending";
};

const findMatchingResult = (investigation, results) => {
  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }

  const samePatientResults = results.filter(
    (item) => String(item?.patientId) === String(investigation?.patientId)
  );

  const candidateResults = samePatientResults.length > 0 ? samePatientResults : results;

  return (
    candidateResults.find(
      (item) =>
        String(item?.catalogueId) === String(investigation?.catalogueId) &&
        String(item?.investigationId) === String(investigation?.investigationId)
    ) ||
    candidateResults.find(
      (item) =>
        String(item?.catalogueId) === String(investigation?.catalogueId)
    ) ||
    candidateResults.find(
      (item) =>
        item?.catalogueCode &&
        investigation?.catalogueCode &&
        String(item.catalogueCode).toLowerCase() ===
          String(investigation.catalogueCode).toLowerCase()
    ) ||
    candidateResults.find(
      (item) =>
        String(item?.investigationId) === String(investigation?.investigationId) &&
        item?.catalogueName &&
        investigation?.catalogueName &&
        String(item.catalogueName).toLowerCase() ===
          String(investigation.catalogueName).toLowerCase()
    ) ||
    null
  );
};

const getInvestigationRow = (investigation, results) => {
  const matchedResult = findMatchingResult(investigation, results);
  const catalogue = [investigation?.catalogueCode, investigation?.catalogueName]
    .filter(Boolean)
    .join(" - ");

  return {
    id: investigation?.id || "pending",
    investigationType: investigation?.investigationName || "Investigation",
    catalogue: catalogue || "-",
    result: getResultText(matchedResult),
  };
};

const getResultRows = (results, patientId) => {
  if (!Array.isArray(results) || results.length === 0) {
    return [];
  }

  return results
    .filter((item) => String(item?.patientId) === String(patientId))
    .map((item) => ({
      id: item?.id || `${item?.investigationId}-${item?.catalogueId}`,
      investigationType: item?.investigationName || "Investigation",
      catalogue: [item?.catalogueCode, item?.catalogueName]
        .filter(Boolean)
        .join(" - ") || "-",
      result: getResultText(item),
    }));
};

const getInvestigationRows = (investigations, results, patientId) => {
  const resultRows = getResultRows(results, patientId);

  if (resultRows.length > 0) {
    return resultRows;
  }

  if (!Array.isArray(investigations) || investigations.length === 0) {
    return [];
  }

  return investigations.map((item) => getInvestigationRow(item, results));
};

function DetailSection({ title, children }) {
  return (
    <div>
      <h3 className="text-primary p-2 bg-[#EAF0FB] font-semibold text-sm uppercase tracking-wide border-l-4 border-primary pl-3 mb-5">
        {title}
      </h3>
      {children}
    </div>
  );
}

function DetailGrid({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">{children}</div>;
}

function DetailField({ label, value, className = "" }) {
  return (
    <div className={className}>
      <strong>{label}:</strong> {formatValue(value)}
    </div>
  );
}

export default function InvestigationDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  const [investigation, setInvestigation] = useState(state?.investigation || null);
  const [loading, setLoading] = useState(!state?.investigation);
  const [results, setResults] = useState([]);
  const [relatedInvestigations, setRelatedInvestigations] = useState(
    state?.investigation ? [state.investigation] : []
  );

  useEffect(() => {
    const fetchInvestigation = async () => {
      try {
        setLoading(true);
        const response = await getPatientInvestigationMDT();
        const allInvestigations = response.data || [];
        const matchedInvestigation =
          state?.investigation ||
          allInvestigations.find(
          (item) => String(item.id) === String(id)
        );

        const matchingRows = allInvestigations.filter(
          (item) =>
            String(item?.patientId) === String(matchedInvestigation?.patientId) &&
            String(item?.mdtMeetingId) === String(matchedInvestigation?.mdtMeetingId)
        );

        setInvestigation(matchedInvestigation || null);
        setRelatedInvestigations(
          matchingRows.length > 0
            ? matchingRows
            : matchedInvestigation
              ? [matchedInvestigation]
              : []
        );
      } catch (error) {
        console.error("Failed to load investigation details", error);
        setInvestigation(null);
        setRelatedInvestigations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestigation();
  }, [id, state?.investigation]);

  useEffect(() => {
    if (!investigation?.patientId) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await getResultsByPatientId(investigation.patientId);
        setResults(response.data || []);
      } catch (error) {
        console.error("Failed to load results", error);
        setResults([]);
      }
    };

    fetchResults();
  }, [investigation?.patientId]);

  const investigationColumns = [
    { key: "investigationType", label: "Investigation" },
    { key: "catalogue", label: "Catalogue" },
    { key: "result", label: "Result" },
  ];

  if (loading) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="p-6 text-center">Loading...</div>
      </div>
    );
  }

  if (!investigation) {
    return (
      <main className="flex-1">
        <div
          className="flex items-center gap-2 mb-6 cursor-pointer text-primary font-medium"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          <span>Back to Dashboard</span>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
          Investigation details not found.
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div
        className="flex items-center gap-2 mb-6 cursor-pointer text-primary font-medium"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft />
        <span>Back to Dashboard</span>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 space-y-8">
        <DetailSection title="Meeting Information">
          <DetailGrid>
            <DetailField label="MDT Type" value={investigation?.mdtType} />
            <DetailField
              label="Meeting Date & Time"
              value={formatDateTime(investigation?.meetingDateTime)}
            />
            <DetailField
              label="Additional Notes"
              value={investigation?.meetingNotes}
            />
            <DetailField
              label="Clinicians"
              value={getCliniciansText(investigation)}
            />
          </DetailGrid>
        </DetailSection>

        <DetailSection title="Patient Information">
          <DetailGrid>
            <DetailField label="Name" value={getPatientName(investigation)} />
            <DetailField
              label="NHS Number"
              value={investigation?.patientNhsNumber}
            />
            <DetailField
              label="MRN"
              value={investigation?.patientMrn}
            />
            <DetailField
              label="Patient ID"
              value={investigation?.patientId}
            />
          </DetailGrid>
        </DetailSection>

        <DetailSection title="Clinical Notes">
          <div className="text-slate-700 whitespace-pre-wrap">
            {formatValue(investigation?.clinicalNotes)}
          </div>
        </DetailSection>
      </div>

      <div className="bg-white mt-6 sm:mt-10 rounded-2xl shadow-md overflow-hidden">
        <div className="px-4 sm:px-6 py-5 border-b border-gray-100">
          <h2 className="font-heading font-bold text-xl text-text">
            Investigations
          </h2>
        </div>

        <Table
          columns={investigationColumns}
          data={getInvestigationRows(
            relatedInvestigations,
            results,
            investigation?.patientId
          )}
        />
      </div>
    </main>
  );
}
