import { useState, useRef, useEffect } from "react";

import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import TableActions from "../../components/ui/TableActions";
import ConfirmModal from "../../components/ui/ConfirmModal"; 
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import FieldError from "../../components/ui/FieldError";
import MultiSelect from "../../components/ui/MultiSelect";

import useForm from "../../hooks/useForm";

import { getClinicians } from "../../services/clinicianService";
import { getMDTs } from "../../services/mdtService";
import { getMappings, createMapping, updateMappings, deleteMapping } from "../../services/mappingService";

const validate = (values) => {
  const errors = {};
  if (!values.clinicianId)
    errors.clinicianId = "Please select a clinician";
  if (!values.mdtIds || values.mdtIds.length === 0)
    errors.mdtIds = "Please select at least one MDT type";
  return errors;
};

export default function MappingList() {
  const [showModal, setShowModal]               = useState(false);
  const [editingRow, setEditingRow]             = useState(null);
  const [tableData, setTableData]               = useState([]);
  const [clinicianOptions, setClinicianOptions] = useState([]);
  const [mdtOptions, setMdtOptions]             = useState([]);
  const [mdtDropdownOpen, setMdtDropdownOpen]   = useState(false);
  const [loading, setLoading]                   = useState(false);
  const [saving, setSaving]                     = useState(false);
  const [apiError, setApiError]                 = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [deletingRow, setDeletingRow] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const mdtDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mdtDropdownRef.current && !mdtDropdownRef.current.contains(e.target)) {
        setMdtDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [mappingsRes, cliniciansRes, mdtsRes] = await Promise.all([
        getMappings(),
        getClinicians(),
        getMDTs(),
      ]);
      setTableData(mappingsRes.data);
      setClinicianOptions(cliniciansRes.data);
      setMdtOptions(mdtsRes.data);
    } catch (error) {
      setApiError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMappings = async () => {
    try {
      const response = await getMappings();
      setTableData(response.data);
    } catch (error) {
      setApiError("Failed to refresh mappings.");
    }
  };

  const {
    values, errors, touched,
    handleChange, handleSubmit,
    resetForm, prefillForm, setFieldValue,
  } = useForm({ clinicianId: "", mdtIds: [] }, validate);

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRow(null);
    setMdtDropdownOpen(false);
    setApiError("");
    resetForm();
  };

  const handleSave = handleSubmit(async (formValues) => {
    try {
      setSaving(true);
      setApiError("");

      if (editingRow) {
        // PUT /mdt-clinicians/{clinicianId}/mappings
        await updateMappings(editingRow.clinicianId, {
          mdtIds: formValues.mdtIds,
        });
        console.log("ClinicianId:", editingRow.clinicianId);
        console.log("Payload:", {
          mdtIds: formValues.mdtIds,
        });
      } else {
        // POST /mdt-clinicians
        await createMapping({
          clinicianId: Number(formValues.clinicianId),
          mdtIds: formValues.mdtIds,
        });
      }

      await fetchMappings();
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

      await deleteMapping(deletingRow.clinicianId);
      await fetchMappings();

      setShowConfirm(false);
      setDeletingRow(null);
    } catch (error) {
      setApiError("Failed to delete. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const toggleMdtType = (id) => {
    const current = values.mdtIds;
    const updated = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];
    setFieldValue("mdtIds", updated);
  };

  const getMdtNames = (mdts) => {
    if (!mdts || mdts.length === 0) return "";
    return mdts.map((m) => m.type).join(", ");
  };

  const columns = [
    { key: "id",                 
      label: "S.No",         
      render: (_, index) => index + 1 },
    {
      key: "clinicianFirstname",
      label: "Clinician Name",
      render: (row) => `${row.clinicianFirstname} ${row.clinicianSurname}`,
    },
    {
      key: "mdts",
      label: "MDT Types",
      render: (row) => getMdtNames(row.mdts),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <TableActions
          onEdit={() => {
            setEditingRow(row);
            prefillForm({
              clinicianId: String(row.clinicianId),
              mdtIds: row.mdts.map((m) => m.id),
            });
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
          Mapping List
        </h2>
        <Button
          className="w-full sm:w-auto px-6"
          onClick={() => { setEditingRow(null); resetForm(); setShowModal(true); }}
        >
          Create Mapping
        </Button>
      </div>

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
          title={editingRow ? "Edit Mapping" : "Create Mapping"}
          onClose={handleCloseModal}
          size="lg"
        >
          <div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Clinician */}
              <div>
                <label className="block mb-2 font-semibold text-text">
                  Clinician
                </label>
                <Select
                  name="clinicianId"
                  value={values.clinicianId}
                  onChange={handleChange}
                  placeholder="Select Clinician"
                  options={clinicianOptions.map((c) => ({
                    value: c.id,
                    label: `${c.firstname} ${c.surname}`,
                  }))}
                  error={errors.clinicianId}     
                  touched={touched.clinicianId}
                />
              </div>

              {/* MDT Types */}
              <MultiSelect
                label="MDT Types"
                options={mdtOptions.map((mdt) => ({
                  value: mdt.id,
                  label: mdt.type,
                }))}
                selectedValues={values.mdtIds}
                onChange={(selected) =>
                  setFieldValue("mdtIds", selected)
                }
                placeholder="Select MDT Types"
                error={errors.mdtIds}      
                touched={touched.mdtIds} 
              />
            </div>

            {/* Preview */}
            {values.clinicianId && values.mdtIds.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-slate-700 mb-3">Preview</h3>
                <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm border rounded-lg overflow-hidden">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="border border-gray-300 p-2 text-left font-semibold text-slate-600">Clinician</th>
                      <th className="border border-gray-300 p-2 text-left font-semibold text-slate-600">MDT Types</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2 text-slate-700">
                        {clinicianOptions.find((c) => String(c.id) === String(values.clinicianId))
                          ? `${clinicianOptions.find((c) => String(c.id) === String(values.clinicianId)).firstname} ${clinicianOptions.find((c) => String(c.id) === String(values.clinicianId)).surname}`
                          : ""
                        }
                      </td>
                      <td className="border border-gray-300 p-2 text-slate-700">
                        {mdtOptions.filter((m) => values.mdtIds.includes(m.id)).map((m) => m.type).join(", ")}
                      </td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </div>
            )}

            {apiError && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {apiError}
              </div>
            )}

            <div className="flex justify-end">
              <Button className="w-full sm:w-auto px-6" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editingRow ? "Update Mapping" : "Create Mapping"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {showConfirm && (
        <ConfirmModal
          title="Delete Mapping"
          message={`Are you sure you want to delete the mapping between "${deletingRow?.clinicianFirstname} ${deletingRow?.clinicianSurname}" and the selected MDT types?`}
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
