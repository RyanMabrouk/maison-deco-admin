'use client';
import React, { useState, useEffect } from 'react';
import { Select, SelectTrigger, SelectContent } from '@/components/ui/select';
import { Trash } from 'lucide-react';

export default function SelectGeneric({
  options,
  placeholder,
  name,
  selectedValue,
  setSelectedValue,
  handleDeleteOption
}: {
  options: { value: string; label: string }[];
  placeholder: string;
  name?: string;
  selectedValue?: string;
  setSelectedValue?: (option: string) => void;
  handleDeleteOption?: (id: string) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<string>();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false); // État pour suivre l'ouverture/fermeture du menu

  useEffect(() => {
    if (selectedValue) {
      setSelectedValue?.(selectedValue);
      setSelectedOption(selectedValue);
    }
  }, [selectedValue]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Select
      onValueChange={(value) => {
        if (setSelectedValue) {
          setSelectedValue(value);
        }
        setIsOpen(false);
      }}
      defaultValue={selectedOption}
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <SelectTrigger
        className={`mt-2 line-clamp-1 h-11 w-[15rem] overflow-hidden break-words rounded-sm border-gray-300 bg-white focus:ring-2 focus:ring-color2 ${
          selectedOption ? '' : 'text-gray-400'
        }`}
      >
        <div>
          {selectedOption
            ? options.find((option) => option.value === selectedOption)?.label
            : placeholder}
        </div>
        {name && (
          <input className="hidden" name={name} value={selectedOption} />
        )}
      </SelectTrigger>
      <SelectContent className="max-h-[16rem] w-[15rem] overflow-y-auto">
        <div className="relative pt-10">
          <input
            type="text"
            placeholder="Rechercher..."
            className="fixed left-0 top-0 z-[9999] w-full border border-gray-300 p-2 outline-none focus:ring-1 focus:ring-color2"
            value={searchTerm ?? ''}
            onChange={(e) => {
              e.stopPropagation();
              setSearchTerm(e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                if (setSelectedValue) {
                  setSelectedValue(option.value);
                }
                setSelectedOption(option.value);
                setIsOpen(false);
              }}
              className="relative line-clamp-1 w-full cursor-pointer overflow-hidden truncate break-words px-4 py-2 text-left hover:bg-stone-200"
            >
              <span className="line-clamp-1 w-[11rem] overflow-hidden truncate break-words text-left">
                {option.label}
              </span>

              {handleDeleteOption && (
                <div
                  className="absolute left-2 top-2"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteOption(option.value);
                  }}
                >
                  <Trash className="size-4 hover:text-red-500" />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-2 text-gray-500">Aucun résultat</div>
        )}
      </SelectContent>
    </Select>
  );
}
