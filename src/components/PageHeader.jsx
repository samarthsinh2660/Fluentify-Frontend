import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Page Header Component
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Optional subtitle
 * @param {React.ReactNode} props.icon - Optional icon to display
 * @param {boolean} props.showBack - Show back button
 * @param {Function} props.onBack - Custom back handler
 * @param {React.ReactNode} props.actions - Action buttons/elements
 * @param {boolean} props.smallTitle - Use smaller title size
 */
const PageHeader = ({ title, subtitle, icon, showBack = false, onBack, actions, smallTitle = false }) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };
  
  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBack && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-white hover:text-green-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            {icon && (
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                {icon}
              </div>
            )}
            <div>
              <h1 className={`${smallTitle ? 'text-lg md:text-xl' : 'text-2xl md:text-3xl'} font-bold`}>{title}</h1>
              {subtitle && (
                <p className={`text-green-100 mt-2 ${smallTitle ? 'text-sm md:text-base' : 'text-lg'}`}>{subtitle}</p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
