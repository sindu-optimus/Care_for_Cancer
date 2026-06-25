import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import FieldError from "../../components/ui/FieldError";
import DateTimePicker from "../../components/ui/DateTimePicker/DateTimePicker";
// import VoiceButton from "../../components/ui/VoiceButton";

export default function MeetingForm({
  values,
  errors,
  touched,
  clinicians,
  mdtOptions,
  editingRow,
  handleChange,
  handleBlur,
  handleMDTChange,
  handleSave,
  resetForm,
  setEditingRow,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-8 mb-8">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-text">
              MDT Type
            </label>

            <Select
              name="mdtType"
              value={values.mdtType}
              onChange={handleMDTChange}
              placeholder="Select MDT Type"
              dropdownMode="overlay"
              options={mdtOptions.map((mdt) => ({
                value: mdt.id,
                label: mdt.type,
              }))}
              error={errors.mdtType}
              touched={touched.mdtType}
            />

            {clinicians.length > 0 && (
              <div className="my-2 text-sm">
                <span className="font-medium text-text">
                  Clinicians:
                </span>{" "}
                <span className="text-primary">
                  {clinicians
                    .map(
                      (c) =>
                        `${c.clinicianFirstname} ${c.clinicianSurname}`
                    )
                    .join(", ")}
                </span>
              </div>
            )}
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

        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700">
              Additional Notes
            </label>

            {/* <VoiceButton setTranscript={handleVoiceTranscript} /> */}
          </div>

          <textarea
            name="additionalNotes"
            value={values.additionalNotes}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter additional notes (max 250 characters)"
            maxLength={250}
            className={`flex-1 px-4 py-3 border rounded-lg text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 min-h-30
              ${
                errors.additionalNotes && touched.additionalNotes
                  ? "border-red-400 bg-red-50 focus:ring-red-200"
                  : "border-gray-300 focus:border-primary focus:ring-primary/20"
              }`}
          />

          <div className="flex justify-between items-center min-h-4 mt-1">
            <FieldError
              error={errors.additionalNotes}
              touched={touched.additionalNotes}
            />

            <span className="text-xs text-slate-400 ml-auto">
              {values.additionalNotes.length}/250
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
        <Button
          className="w-full sm:w-auto px-6"
          onClick={handleSave}
        >
          {editingRow ? "Update Meeting" : "Create Meeting"}
        </Button>

        {editingRow && (
          <button
            onClick={() => {
              setEditingRow(null);
              resetForm();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
