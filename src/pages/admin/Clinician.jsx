import { useState, useEffect } from "react";

import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import TableActions from "../../components/ui/TableActions";
import ConfirmModal from "../../components/ui/ConfirmModal"; 
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";

import useForm from "../../hooks/useForm";

import { getClinicians, createClinician, updateClinician, deleteClinician } from "../../services/clinicianService";

const validate = (values) => {
  const errors = {};

  if (!values.surname.trim())
    errors.surname = "Surname is required";
  else if (/\d/.test(values.surname))
    errors.surname = "Surname must contain only letters";

  if (!values.firstname.trim())
    errors.firstname = "First Name is required";
  else if (/\d/.test(values.firstname))
    errors.firstname = "First Name must contain only letters";

  if (!values.gmcCode.trim())
    errors.gmcCode = "GMC Code is required";

  return errors;
};

export default function Clinician() {
  const [showModal, setShowModal]   = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [tableData, setTableData]   = useState([]);
  const [loading, setLoading]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [apiError, setApiError]     = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [showConfirm, setShowConfirm] = useState(false);
  const [deletingRow, setDeletingRow] = useState(null);
  const [deleting, setDeleting]       = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm, prefillForm } =
    useForm({ surname: "", firstname: "", gmcCode: "" }, validate);

  useEffect(() => {
    fetchClinicians();
  }, []);

  const fetchClinicians = async () => {
    try {
      setLoading(true);
      const response = await getClinicians();
      setTableData(response.data);
    } catch (error) {
      setApiError("Failed to load clinicians.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRow(null);
    setApiError("");
    resetForm();
  };

  const handleSave = handleSubmit(async (formValues) => {
    try {
      setSaving(true);
      setApiError("");

      if (editingRow) {
        await updateClinician(editingRow.id, {
          surname:   formValues.surname,
          firstname: formValues.firstname,
          gmcCode:   formValues.gmcCode,
        });
      } else {
        await createClinician({
          surname:   formValues.surname,
          firstname: formValues.firstname,
          gmcCode:   formValues.gmcCode,
        });
      }

      await fetchClinicians();
      handleCloseModal();

    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("RESPONSE DATA:", error?.response?.data);

      const message = error?.response?.data?.message;

      if (message?.toLowerCase().includes("gmc")) {
        setFieldErrors({
          gmcCode: "This GMC Code already exists.",
        });
      } else {
        setApiError("Failed to save. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  });

  const handleDelete = async () => {
      try {
        setDeleting(true);
        await deleteClinician(deletingRow.id);
        await fetchClinicians();
        setShowConfirm(false);
        setDeletingRow(null);
      } catch (error) {
        setApiError("Failed to delete. Please try again.");
      } finally {
        setDeleting(false);
      }
    };

  const columns = [
    { key: "id",        label: "S.No",       render: (_, index) => index + 1 },
    { key: "surname",   label: "Surname" },
    { key: "firstname", label: "Firstname" },
    { key: "gmcCode",   label: "GMC Code" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <TableActions
          onEdit={() => {
            setEditingRow(row);
            prefillForm({ surname: row.surname, firstname: row.firstname, gmcCode: row.gmcCode });
            setShowModal(true);
          }}
          onDelete={() => {
            setDeletingRow(row); 
            setShowConfirm(true); 
          }}
        />
      ),
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
          Clinician List
        </h2>
        <Button
          className="w-full sm:w-auto px-6"
          onClick={() => { setEditingRow(null); resetForm(); setShowModal(true); }}
        >
          Add Clinician
        </Button>
      </div>

      {/* Table error */}
      {apiError && !showModal && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {apiError}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-md">
        {loading ? (
          <div className="flex items-center justify-center p-16 text-slate-400">
            Loading...
          </div>
        ) : (
          <Table columns={columns} data={tableData} />
        )}
      </div>

      {showModal && (
        <Modal
          title={editingRow ? "Edit Clinician" : "Add Clinician"}
          onClose={handleCloseModal}
        >
          <div className="space-y-1">
            <Input
              label="Surname"
              name="surname"
              type="text"
              placeholder="Enter Surname"
              value={values.surname}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.surname}
              touched={touched.surname}
            />
            <Input
              label="Firstname"
              name="firstname"
              type="text"
              placeholder="Enter First Name"
              value={values.firstname}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.firstname}
              touched={touched.firstname}
            />
            <Input
              label="GMC Code"
              name="gmcCode"
              type="text"
              placeholder="Enter GMC Code"
              value={values.gmcCode}
              onChange={handleChange}
              onBlur={handleBlur}
              error={fieldErrors.gmcCode || errors.gmcCode}
              touched={touched.gmcCode || !!fieldErrors.gmcCode}
            />

            {/* Modal API error */}
            {apiError && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {apiError}
              </div>
            )}

            <div className="flex justify-end mt-6">
              <Button className="w-full sm:w-auto px-6" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editingRow ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {showConfirm && (
        <ConfirmModal
          title="Delete Clinician"
          message={`Are you sure you want to delete "${deletingRow?.firstname} ${deletingRow?.surname}"?`}
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
