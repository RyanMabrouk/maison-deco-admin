export default function Textarea({ label, name, placeholder , defaultValue,error }: { label: string,defaultValue?:string, name: string, placeholder: string ,error?:string[]}) {
    return (
      <div>
        <label className="block font-semibold text-color5">{label}</label>
        <textarea
          name={name}
          className="mt-2 w-full rounded-sm border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-color2"
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
              {error?.map((err, index) => (
          <p key={index} className="text-red-500 mt-2">{err}</p>
        ))}
      </div>
    );
  }