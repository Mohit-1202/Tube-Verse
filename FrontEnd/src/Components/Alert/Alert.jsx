/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const Alert = ({ message, onClose, type = "error" }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg flex items-center justify-between ${
        type === "error" ? "bg-red-800" : "bg-green-500"
      } text-white min-w-[300px] max-w-md`}
    >
      <div className="flex-1">
        <p className="font-medium">{message}</p>
      </div>
      <button onClick={onClose} className="ml-4">
        <FontAwesomeIcon icon={faCircleXmark} />
      </button>
    </div>
  );
};

export default Alert;
