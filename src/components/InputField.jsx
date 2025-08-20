const InputField = ({
  label,
  id,
  type = "text",
  placeholder,
  icon: Icon,
  value,
  onChange,
  onIconClick,
  options = [],
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative flex items-center">
      {type === "select" ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            {placeholder || "Select an option"}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
      {Icon && type !== "select" && (
        <Icon
          className="w-[18px] h-[18px] absolute right-4 text-gray-400"
          onClick={onIconClick}
        />
      )}
    </div>
  </div>
);

export default InputField;
