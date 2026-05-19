import React from 'react';
import { FiCheckCircle, FiInfo } from 'react-icons/fi';

const LumiereAlert = ({ message, type = "success" }) => {
  const styles = {
    success: "bg-[#F2F7D6] text-[#4F5C18] border-[#D9E67E]",
    info: "bg-gray-50 text-gray-500 border-gray-200"
  };

  return (
    <div className={`flex items-center gap-4 p-6 rounded-[2rem] border ${styles[type]} animate-fadeIn`}>
      {type === "success" ? <FiCheckCircle /> : <FiInfo />}
      <p className="text-[10px] font-bold uppercase tracking-widest">{message}</p>
    </div>
  );
};

export default LumiereAlert;