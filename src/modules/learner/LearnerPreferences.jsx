import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { useSaveLearnerPreferences } from '../../hooks/usePreferences';
import { Button, ErrorMessage } from '../../components';
import { CustomDropdown } from './components';
import { LANGUAGES, DURATIONS, EXPERTISE_LEVELS } from '../../utils/constants';

const LearnerPreferences = () => {
  const [form, setForm] = useState({
    language: "",
    expected_duration: "",
    expertise: "",
  });
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  // React Query mutation
  const savePreferencesMutation = useSaveLearnerPreferences();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    savePreferencesMutation.mutate(form, {
      onSuccess: () => {
        // Preferences saved successfully
        navigate("/dashboard", { 
          replace: true,
          state: { fromForm: true }
        });
      },
      onError: (err) => {
        setError(err.message || "Could not save preferences. Please try again.");
      }
    });
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
                options={LANGUAGES}
                value={form.language}
                onChange={(val) => setForm({ ...form, language: val })}
                placeholder="Select a language"
                showFlags
              />
              <Button
                type="button"
                onClick={nextStep}
                disabled={!form.language}
                variant="success"
                className="w-full mt-4"
              >
                Next →
              </Button>
            </div>
          )}

          {/* Step 2: Duration */}
          {step === 1 && (
            <div className="space-y-4 text-center">
              <p className="text-lg font-medium text-gray-700">
                What's your estimated learning duration?
              </p>
              <CustomDropdown
                options={DURATIONS}
                value={form.expected_duration}
                onChange={(val) => setForm({ ...form, expected_duration: val })}
                placeholder="Select duration"
              />
              <div className="flex justify-between mt-4">
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="ghost"
                >
                  ← Back
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!form.expected_duration}
                  variant="success"
                >
                  Next →
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 3: Expertise */}
          {step === 2 && (
            <div className="space-y-4 text-center">
              <p className="text-lg font-medium text-gray-700">
                What's your expertise level?
              </p>
              <CustomDropdown
                options={EXPERTISE_LEVELS}
                value={form.expertise}
                onChange={(val) => setForm({ ...form, expertise: val })}
                placeholder="Select expertise"
              />
              <ErrorMessage message={error} />
              <div className="flex justify-between mt-4">
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="ghost"
                >
                  ← Back
                </Button>
                <Button
                  type="submit"
                  loading={savePreferencesMutation.isPending}
                  variant="success"
                >
                  Save Preferences
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LearnerPreferences;
