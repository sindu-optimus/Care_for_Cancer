import { useState, useEffect } from "react";

import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import TableActions from "../../components/ui/TableActions";
import ConfirmModal from "../../components/ui/ConfirmModal";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import FieldError from "../../components/ui/FieldError";
import DateTimePicker from "../../components/ui/DateTimePicker/DateTimePicker";

import useForm from "../../hooks/useForm";

import { getMDTs } from "../../services/mdtService";
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

  const {
    values, errors, touched,
    handleChange, handleBlur,
    handleSubmit, resetForm, prefillForm,
  } = useForm({
    mdtType:         "",
    meetingTime:     "",
    additionalNotes: "",
  }, validate);

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

  const handleDelete = () => {
    setTableData((prev) => prev.filter((item) => item.id !== deletingRow.id));
    setShowConfirm(false);
    setDeletingRow(null);
  };

  const columns = [
    {
      key: "id",
      label: "S.No",
      render: (_, index) => index + 1,
    },
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
          onEdit={() => {
            setEditingRow(row);

            prefillForm({
              mdtType: row.mdtId,
              meetingTime: row.meetingDateTime.slice(0, 16),
              additionalNotes: row.notes,
            });
          }}
          onDelete={() => {
            setDeletingRow(row);
            setShowConfirm(true);
          }}
        />
      ),
    },
  ];

  console.log(values.meetingTime);
console.log(errors.meetingTime);

  return (
    <div className="flex-1 overflow-auto">
      <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text mb-4">Schedule MDT Meetings</h2>

      {/* ── Form (always visible) ── */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-8 mb-8">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block mb-2 font-semibold text-text">
                  MDT Type
              </label>
             <Select
                name="mdtType"
                value={values.mdtType}
                onChange={handleChange}
                placeholder="Select MDT Type"
                dropdownMode="overlay"
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
                label="Schedule"
                name="meetingTime"
                value={values.meetingTime}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.meetingTime}
                touched={touched.meetingTime}
                showTime={true}
                minDate={new Date()}
              />
            </div>
          </div>

          {/* Left — Additional Notes (tall) */}
          <div className="flex flex-col">
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Additional Notes
            </label>
            <textarea
              name="additionalNotes"
              value={values.additionalNotes}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter additional notes (max 250 characters)"
              maxLength={250}
              className={`flex-1 px-4 py-3 border rounded-lg text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 min-h-40
                ${errors.additionalNotes && touched.additionalNotes
                  ? "border-red-400 bg-red-50 focus:ring-red-200"
                  : "border-gray-300 focus:border-primary focus:ring-primary/20"
                }`}
            />
            <div className="flex justify-between items-center min-h-4 mt-1">
              <FieldError error={errors.additionalNotes} touched={touched.additionalNotes} />
              <span className="text-xs text-slate-400 ml-auto">
                {values.additionalNotes.length}/250
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
          <Button className="w-full sm:w-auto px-6" onClick={handleSave}>
            {editingRow ? "Update Meeting" : "Create Meeting"}
          </Button>
          {editingRow && (
            <button
              onClick={() => { setEditingRow(null); resetForm(); }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-md">
        <div className="px-4 sm:px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-heading font-bold text-xl text-text">
              Scheduled Meeting
            </h2>
        </div>
        <Table columns={columns} data={tableData} />
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
