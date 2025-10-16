import React from 'react';
import { BookOpen } from 'lucide-react';
import CustomDropdown from './CustomDropdown';
import Button from '../../../components/Button';
import ErrorMessage from '../../../components/ErrorMessage';
import { LANGUAGES, DURATIONS } from '../../../utils/constants';

/**
 * Course Generation Form Component
 * @param {Object} props
 * @param {Object} props.form - Form state { language, expectedDuration }
 * @param {Function} props.setForm - Form state setter
 * @param {Function} props.onGenerate - Generate handler
 * @param {Function} props.onCancel - Cancel handler
 * @param {boolean} props.isGenerating - Loading state
 * @param {string} props.error - Error message
 */
const CourseGenerationForm = ({ 
  form, 
  setForm, 
  onGenerate, 
  onCancel, 
  isGenerating,
  error 
}) => {
  return (
    <div className="mb-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h4 className="text-lg font-semibold mb-4">Generate New Course</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <CustomDropdown
            options={LANGUAGES}
            value={form.language}
            onChange={(val) => setForm({ ...form, language: val })}
            placeholder="Select Language"
            showFlags
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <CustomDropdown
            options={DURATIONS}
            value={form.expectedDuration}
            onChange={(val) => setForm({ ...form, expectedDuration: val })}
            placeholder="Select Duration"
          />
        </div>
      </div>
      
      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}
      
      <div className="flex gap-2">
        <Button
          onClick={onGenerate}
          loading={isGenerating}
          disabled={isGenerating}
          icon={<BookOpen className="w-4 h-4" />}
        >
          {isGenerating ? 'Generating...' : 'Generate Course'}
        </Button>
        
        <Button
          onClick={onCancel}
          variant="ghost"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CourseGenerationForm;
