const InputField = ({
  label,
  id,
  type = "text",
  placeholder,
  icon: Icon,
  value,
  onChange,
  onIconClick,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative flex items-center">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {Icon && (
        <Icon
          className="w-[18px] h-[18px] absolute right-4 text-gray-400 cursor-pointer"
          onClick={onIconClick}
        />
      )}
    </div>
  </div>
);

export default InputField;
