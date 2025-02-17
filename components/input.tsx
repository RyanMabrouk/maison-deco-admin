export default function Input({
  label,
  name,
  value,
  type = 'text',
  placeholder,
  defaultValue,
  disabled,
  error
}: {
  label: string;
  defaultValue?: any;
  name: string;
  type?: string;
  value?: any;
  placeholder?: string;
  disabled?: boolean;
  error?: string[];
}) {
  return (
    <div className="w-full">
      <label className="block font-semibold ">{label}</label>
      <input
        type={type}
        name={name}
        className="mt-2 h-11 w-full rounded-sm border border-gray-300 p-2 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-color2"
        placeholder={placeholder}
        defaultValue={defaultValue}
        disabled={disabled}
        {...(value && { value })}
      />
      {error?.map((err, index) => (
        <p key={index} className="mt-2 text-red-500">
          {err}
        </p>
      ))}
    </div>
  );
}
