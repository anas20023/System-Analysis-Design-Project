import { motion } from "framer-motion";
import React from "react";

// Define the props for our Icon components
interface IconProps {
  className?: string;
}

// Information Icon SVG
const InfoIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Success Icon SVG
const SuccessIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Warning Icon SVG
const WarningIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

// Error Icon SVG
const ErrorIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Close Icon SVG
const CloseIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Loading Spinner SVG
const LoadingSpinner: React.FC<IconProps> = ({ className }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "loading";

export interface NotificationProps {
  type: NotificationType;
  title: string;
  message?: string;
  showIcon?: boolean;
  duration?: number;
  onClose: () => void;
  position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
}

const notificationConfig = {
  info: { 
    icon: <InfoIcon className="h-5 w-5 text-blue-600" />,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-800",
    progressColor: "bg-blue-500"
  },
  success: { 
    icon: <SuccessIcon className="h-5 w-5 text-green-600" />,
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-800",
    progressColor: "bg-green-500"
  },
  warning: { 
    icon: <WarningIcon className="h-5 w-5 text-yellow-600" />,
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-800",
    progressColor: "bg-yellow-500"
  },
  error: { 
    icon: <ErrorIcon className="h-5 w-5 text-red-600" />,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-800",
    progressColor: "bg-red-500"
  },
  loading: { 
    icon: <LoadingSpinner className="h-5 w-5 text-slate-600" />,
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    textColor: "text-slate-800",
    progressColor: "bg-slate-500"
  },
};

const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  showIcon = true,
  duration,
  onClose,
  position = "top-right",
}) => {
  const config = notificationConfig[type];

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`fixed ${positionClasses[position]} z-50 max-w-sm w-full rounded-lg border shadow-lg ${config.bgColor} ${config.borderColor}`}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {showIcon && (
            <div className="flex-shrink-0 mt-0.5">
              {config.icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold ${config.textColor}`}>
              {title}
            </p>
            {message && (
              <p className={`text-sm mt-1 ${config.textColor} opacity-90`}>
                {message}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {duration && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          onAnimationComplete={onClose}
          className={`h-1 ${config.progressColor} rounded-b-lg`}
        />
      )}
    </motion.div>
  );
};

export default Notification;