import React, { useState } from 'react';
import ReactCountryFlag from 'react-country-flag';

/**
 * Custom Dropdown Component
 * @param {Object} props
 * @param {Array} props.options - Array of options (objects or strings)
 * @param {string} props.value - Selected value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.showFlags - Show country flags for language options
 */
const CustomDropdown = ({ options, value, onChange, placeholder, showFlags = false }) => {
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
        className="w-full border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between text-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-colors"
      >
        {selected ? (
          <span className="flex items-center gap-2">
            {showFlags && selected.code && (
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
        <span className="text-gray-500 transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </button>

      {open && (
        <>
          {/* Overlay to close dropdown when clicking outside */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
            {options.map((opt, idx) => (
              <div
                key={opt.code || idx}
                onClick={() => handleSelect(opt)}
                className="px-4 py-3 flex items-center gap-2 cursor-pointer hover:bg-blue-50 transition-colors"
              >
                {showFlags && opt.code && (
                  <ReactCountryFlag
                    countryCode={opt.code}
                    svg
                    className="text-2xl"
                  />
                )}
                <span>{opt.name || opt}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomDropdown;
