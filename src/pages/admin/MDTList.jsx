import { useState, useEffect } from "react";

import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import TableActions from "../../components/ui/TableActions";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal"; 
import Input from "../../components/ui/Input";
import useForm from "../../hooks/useForm";
import { getMDTs, createMDT, updateMDT, deleteMDT } from "../../services/mdtService";

const validate = (values) => {
  const errors = {};
  if (!values.type.trim())
    errors.type = "MDT Type is required";
  else if (/\d/.test(values.type))
    errors.type = "MDT Type must not contain numbers";
  return errors;
};

export default function MDTList() {
  const [showModal, setShowModal]   = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [tableData, setTableData]   = useState([]);
  const [loading, setLoading]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [apiError, setApiError]     = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [deletingRow, setDeletingRow] = useState(null);
  const [deleting, setDeleting]       = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm, prefillForm } =
    useForm({ type: "" }, validate);

  useEffect(() => {
    fetchMDTs();
  }, []);

  const fetchMDTs = async () => {
    try {
      setLoading(true);
      const response = await getMDTs();
      setTableData(response.data);
    } catch (error) {
      setApiError("Failed to load MDT list.");
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
        await updateMDT(editingRow.id, { type: formValues.type });
      } else {
        await createMDT({ type: formValues.type });
      }

      await fetchMDTs();
      handleCloseModal();

    } catch (error) {
      setApiError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  });

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteMDT(deletingRow.id);
      await fetchMDTs();
      setShowConfirm(false);
      setDeletingRow(null);
    } catch (error) {
      setApiError("Failed to delete. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: "id",   label: "S.No", render: (_, index) => index + 1 },
    { key: "type", label: "MDT Type" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <TableActions
          onEdit={() => {
            setEditingRow(row);
            prefillForm({ type: row.type });
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
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">MDT List</h2>
        <Button
          className="w-full sm:w-auto px-6"
          onClick={() => { setEditingRow(null); resetForm(); setShowModal(true); }}
        >
          Add MDT Type
        </Button>
      </div>

      {apiError && !showModal && !showConfirm && (
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

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal
          title={editingRow ? "Edit MDT Type" : "Add MDT Type"}
          onClose={handleCloseModal}
        >
          <Input
            label="MDT Type"
            name="type"
            type="text"
            placeholder="Enter MDT Type"
            value={values.type}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.type}
            touched={touched.type}
          />

          {apiError && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {apiError}
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button className="w-full sm:w-auto px-6" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editingRow ? "Update" : "Add"}
            </Button>
          </div>
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <ConfirmModal
          title="Delete MDT Type"
          message={`Are you sure you want to delete "${deletingRow?.type}"?`}
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
