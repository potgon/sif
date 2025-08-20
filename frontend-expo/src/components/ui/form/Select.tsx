import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAppTheme } from "../../../theme/useAppTheme";

export interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  value?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  placeholder = "Select an option",
  onChange,
  defaultValue = "",
  value,
}) => {
  const { colors } = useAppTheme();
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleChange = (itemValue: string) => {
    setSelectedValue(itemValue);
    onChange(itemValue);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}
      <View style={[styles.pickerContainer, { 
        borderColor: colors.border,
        backgroundColor: colors.inputBackground 
      }]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={handleChange}
          style={[styles.picker, { color: colors.inputText }]}
          dropdownIconColor={colors.textSecondary}
        >
          <Picker.Item label={placeholder} value="" color={colors.inputPlaceholder} />
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
              color={colors.inputText}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    minWidth: 140,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  picker: {
    height: 48,
    fontSize: 16,
  },
});

export default Select;