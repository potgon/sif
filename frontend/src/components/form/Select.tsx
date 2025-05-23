import React, {useEffect, useState} from "react";

export interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    label?: string;
    options: Option[];
    placeholder?: string;
    onChange: (value: string) => void;
    className?: string;
    defaultValue?: string;
    value?: string;
}

const Select: React.FC<SelectProps> = ({
                                           label,
                                           options,
                                           placeholder = "Select an option",
                                           onChange,
                                           className = "",
                                           defaultValue = "",
                                           value
                                       }) => {
    const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

    useEffect(() => {
        if (value !== undefined) {
            setSelectedValue(value);
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedValue(value);
        onChange(value);
    };

    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {label}
            </label>
            <select
                className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                    selectedValue
                        ? "text-gray-800 dark:text-white/90"
                        : "text-gray-400 dark:text-gray-400"
                } ${className}`}
                value={selectedValue}
                onChange={handleChange}
            >
                <option
                    value=""
                    disabled
                    className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                >
                    {placeholder}
                </option>

                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>

    )
        ;
};

export default Select;