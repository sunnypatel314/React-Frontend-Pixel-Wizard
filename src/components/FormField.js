import React from "react";

const FormField = ({
  labelName,
  type,
  name,
  placeholder,
  value,
  handleChange,
  isSurpriseMe,
  handleSurpriseMe,
  isDisabled,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-900"
        >
          {labelName}
        </label>
        {isSurpriseMe && (
          <button
            className="font-semibold text-xs bg-[#EcECF1] py-1 px-2 rounded-[5px]
             text-black hover:cursor-pointer hover:bg-gray-300 "
            type="button"
            onClick={handleSurpriseMe}
            disabled={isDisabled}
          >
            Surprise Me
          </button>
        )}
      </div>
      <input
        type={type}
        id={name}
        name={name}
        disabled={isDisabled}
        className="bg-gray-50 border border-gray-600 text-gray-900 
        text-sm rounded-lg focus:ring-[#6469ff] focus:border-[#6469ff] 
        outline-none block w-full p-3"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required
      />
    </div>
  );
};

export default FormField;
