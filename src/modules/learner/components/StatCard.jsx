import React from 'react';

/**
 * Stat Card Component for displaying statistics
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string} props.label - Stat label
 * @param {string|number} props.value - Stat value
 * @param {string} props.bgColor - Background color class
 * @param {string} props.iconColor - Icon color class
 */
const StatCard = ({ icon: Icon, label, value, bgColor = 'bg-blue-100', iconColor = 'text-blue-600' }) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
        {Icon && <Icon className={`w-6 h-6 ${iconColor}`} />}
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
