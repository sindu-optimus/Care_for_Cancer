import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import TableActions from "../../components/ui/TableActions";
import ConfirmModal from "../../components/ui/ConfirmModal";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import FieldError from "../../components/ui/FieldError";
// import VoiceButton from "../../components/ui/VoiceButton";
import DateTimePicker from "../../components/ui/DateTimePicker/DateTimePicker";

import useForm from "../../hooks/useForm";

import MeetingForm from "./MeetingForm";

import { getMDTs } from "../../services/mdtService";
import { getMappingsByMDT } from "../../services/mdtClinicianService";
import { getMDTMeetings, createMDTMeetings, updateMDTMeetings, deleteMDTMeetings } from "../../services/meetingService";

const validate = (values) => {
  const errors = {};
  if (!values.mdtType)
    errors.mdtType = "Please select an MDT type";
  if (!values.meetingTime)
    errors.meetingTime = "Please select a meeting date and time";
  if (values.additionalNotes.length > 250)
    errors.additionalNotes = "Additional notes must not exceed 250 characters";
  return errors;
};

const formatDateTime = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

export default function Meetings() {
  const [tableData, setTableData]     = useState([]);
  const [editingRow, setEditingRow]   = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletingRow, setDeletingRow] = useState(null);

  const [mdtOptions, setMdtOptions] = useState([]);
  const [clinicians, setClinicians] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMDTs();
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await getMDTMeetings();
      setTableData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMDTs = async () => {
    try {
      const response = await getMDTs();
      setMdtOptions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCliniciansByMDT = async (mdtId) => {
    try {
      const response = await getMappingsByMDT(mdtId);

      setClinicians(
        response.data?.[0]?.clinicians || []
      );
    } catch (error) {
      console.error(error);
      setClinicians([]);
    }
  };

  const {
    values, errors, touched,
    handleChange, handleBlur,
    handleSubmit, resetForm, prefillForm,
  } = useForm({
    mdtType:         "",
    meetingTime:     "",
    additionalNotes: "",
  }, validate);

  const handleMDTChange = async (e) => {
    handleChange(e);

    const mdtId = e.target.value;

    if (mdtId) {
      await fetchCliniciansByMDT(mdtId);
    } else {
      setClinicians([]);
    }
  };

  const handleSave = handleSubmit(async (formValues) => {
    try {
      const payload = {
        meetingDateTime: new Date(formValues.meetingTime).toISOString(),
        mdtId: Number(formValues.mdtType),
        notes: formValues.additionalNotes,
      };

      if (editingRow) {
        await updateMDTMeetings(editingRow.id, payload);
      } else {
        await createMDTMeetings(payload);
      }

      await fetchMeetings(); 

      setEditingRow(null);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  });

  // const handleVoiceTranscript = (text) => {
  //   handleChange({
  //     target: {
  //       name: "additionalNotes",
  //       value: text,
  //     },
  //   });
  // };

  const handleDelete = () => {
    setTableData((prev) => prev.filter((item) => item.id !== deletingRow.id));
    setShowConfirm(false);
    setDeletingRow(null);
  };

  const columns = [
    {
      key: "mdtType",
      label: "MDT Type",
    },
    {
      key: "meetingDateTime",
      label: "Meeting Date & Time",
      render: (row) => (
        <span className="whitespace-nowrap">
          {formatDateTime(row.meetingDateTime)}
        </span>
      ),
    },
    {
      key: "clinicians",
      label: "Clinician",
      render: (row) =>
        row.clinicians?.length
          ? row.clinicians
              .map((c) => `${c.firstname} ${c.surname}`)
              .join(", ")
          : "-",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <TableActions
          onEdit={(e) => {
            e?.stopPropagation?.();

            setEditingRow(row);

            prefillForm({
              mdtType: row.mdtId,
              meetingTime: row.meetingDateTime.slice(0, 16),
              additionalNotes: row.notes,
            });
          }}
          onDelete={(e) => {
            e?.stopPropagation?.();

            setDeletingRow(row);
            setShowConfirm(true);
          }}
        />
      ),
    },
  ];

  // console.log(values.meetingTime);
  // console.log(errors.meetingTime);

  return (
    <div className="flex-1 overflow-auto">
      <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text mb-4">Schedule MDT Meetings</h2>

     <MeetingForm
        values={values}
        errors={errors}
        touched={touched}
        clinicians={clinicians}
        mdtOptions={mdtOptions}
        editingRow={editingRow}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleMDTChange={handleMDTChange}
        handleSave={handleSave}
        resetForm={resetForm}
        setEditingRow={setEditingRow}
      />

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-md">
        <div className="px-4 sm:px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-heading font-bold text-xl text-text">
              Scheduled Meeting
            </h2>
        </div>
        <Table
          columns={columns}
          data={tableData}
          onRowClick={(row) => {
            navigate(`/mdt/meetings/${row.id}`, {
              state: { meeting: row },
            });
          }}
        />
      </div>

      {editingRow && (
        <Modal
          title="Edit Meeting"
          onClose={() => {
            setEditingRow(null);
            resetForm();
          }}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-semibold text-text">
                  MDT Type
                </label>

                <Select
                  name="mdtType"
                  value={values.mdtType}
                  onChange={handleChange}
                  placeholder="Select MDT Type"
                  options={mdtOptions.map((mdt) => ({
                    value: mdt.id,
                    label: mdt.type,
                  }))}
                  error={errors.mdtType}
                  touched={touched.mdtType}
                />
              </div>

              <div>
                <DateTimePicker
                  label="Meeting Date & Time"
                  name="meetingTime"
                  value={values.meetingTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.meetingTime}
                  touched={touched.meetingTime}
                  showTime
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Additional Notes
              </label>

              <textarea
                name="additionalNotes"
                value={values.additionalNotes}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={250}
                className="w-full min-h-32 px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingRow(null);
                  resetForm();
                }}
                className="px-5 py-2.5 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <Button onClick={handleSave}>
                Update Meeting
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Delete */}
      {showConfirm && (
        <ConfirmModal
          title="Delete Meeting"
          message={`Are you sure you want to delete the "${deletingRow?.mdtType}" meeting? This action cannot be undone.`}
          onConfirm={handleDelete}
          onClose={() => {
            setShowConfirm(false);
            setDeletingRow(null);
          }}
        />
      )}
    </div>
  );
}
