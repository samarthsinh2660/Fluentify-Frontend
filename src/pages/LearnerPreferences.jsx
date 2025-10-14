import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { jwtDecode } from 'jwt-decode';
import { saveLearnerPreferences } from '../routes/preferences';

const languages = [
  { code: "ES", name: "Spanish" },
  { code: "FR", name: "French" },
  { code: "JP", name: "Japanese" },
  { code: "DE", name: "German" },
  { code: "IT", name: "Italian" },
  { code: "IN", name: "Hindi" },
];

const durations = [
  "1 month",
  "3 months",
  "6 months",
  "1 year",
  "More than 1 year",
];

const expertiseLevels = ["Beginner", "Intermediate", "Advanced"];


const CustomDropdown = ({ options, value, onChange, placeholder, showFlags }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option.name || option);
    setOpen(false);
  };

  const selected = options.find(
    (opt) => (opt.name ? opt.name : opt) === value
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between text-lg bg-white shadow-sm focus:ring-2 focus:ring-emerald-500"
      >
        {selected ? (
          <span className="flex items-center gap-2">
            {showFlags && (
              <ReactCountryFlag
                countryCode={selected.code}
                svg
                className="text-2xl"
              />
            )}
            {selected.name || selected}
          </span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <span className="text-gray-500">▼</span>
      </button>

      {open && (
        <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {options.map((opt, idx) => (
            <div
              key={opt.code || idx}
              onClick={() => handleSelect(opt)}
              className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-emerald-50"
            >
              {showFlags && (
                <ReactCountryFlag
                  countryCode={opt.code}
                  svg
                  className="text-2xl"
                />
              )}
              {opt.name || opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const LearnerPreferences = () => {
  const [form, setForm] = useState({
    language: "",
    expected_duration: "",
    expertise: "",
  });
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const token = localStorage.getItem("jwt");
    
    if (!token) {
      setError("No authentication token found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const { status, data } = await saveLearnerPreferences(token, form);
      if (status === 200 && data.success) {
        // Preferences saved successfully
        navigate("/dashboard", { 
          replace: true,
          state: { fromForm: true }
        });
      } else {
        const errorMessage = data.error?.message || data.message || "Could not save preferences";
        setError(typeof errorMessage === 'string' ? errorMessage : "Could not save preferences");
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError("Could not save preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-emerald-50 p-4">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-3xl p-8 relative">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Learning Preferences
          </h2>
          <p className="text-gray-500 text-sm">Step {step + 1} of 3</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Step 1: Language */}
          {step === 0 && (
            <div className="space-y-4 text-center">
              <p className="text-lg font-medium text-gray-700">
                Which language do you want to learn?
              </p>
              <CustomDropdown
                options={languages}
                value={form.language}
                onChange={(val) => setForm({ ...form, language: val })}
                placeholder="Select a language"
                showFlags
              />
              <button
                type="button"
                onClick={nextStep}
                disabled={!form.language}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition-colors shadow-md disabled:bg-emerald-300"
              >
                Next →
              </button>
            </div>
          )}

          {/* Step 2: Duration */}
          {step === 1 && (
            <div className="space-y-4 text-center">
              <p className="text-lg font-medium text-gray-700">
                What’s your estimated learning duration?
              </p>
              <CustomDropdown
                options={durations}
                value={form.expected_duration}
                onChange={(val) => setForm({ ...form, expected_duration: val })}
                placeholder="Select duration"
              />
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!form.expected_duration}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md disabled:bg-emerald-300"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4 text-center">
              <p className="text-lg font-medium text-gray-700">
                What’s your expertise level?
              </p>
              <CustomDropdown
                options={expertiseLevels}
                value={form.expertise}
                onChange={(val) => setForm({ ...form, expertise: val })}
                placeholder="Select expertise"
              />
              {error && (
                <div className="bg-red-100 border border-red-300 rounded-lg p-2 text-red-600 text-sm text-center">
                  {error}
                </div>
              )}
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md disabled:bg-emerald-300"
                >
                  {loading ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LearnerPreferences;