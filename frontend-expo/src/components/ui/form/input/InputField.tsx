import { FC, useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TextStyle,
  ViewStyle,
  Pressable,
  Platform,
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  label?: string;
  placeholder?: string;
  value?: string | number | Date;
  onChange?: (value: string | Date) => void;
  style?: ViewStyle;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  minDate?: Date;
  maxDate?: Date;
}

const Input: FC<InputProps> = ({
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  style,
  disabled = false,
  success = false,
  error = false,
  hint,
  minDate,
  maxDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  // Determine border colors like the web version
  let borderColor = "#d1d5db"; // gray-300
  let hintColor = "#6b7280"; // gray-500

  if (disabled) {
    borderColor = "#e5e7eb"; // gray-200
  } else if (error) {
    borderColor = "#ef4444"; // red-500
    hintColor = "#ef4444";
  } else if (success) {
    borderColor = "#22c55e"; // green-500
    hintColor = "#22c55e";
  }

  const getInputPropsFromType = (type: string) => {
    switch (type) {
      case "email":
        return { keyboardType: "email-address" as const, secureTextEntry: false };
      case "number":
        return { keyboardType: "numeric" as const, secureTextEntry: false };
      case "password":
        return { keyboardType: "default" as const, secureTextEntry: true };
      default:
        return { keyboardType: "default" as const, secureTextEntry: false };
    }
  };

  const { keyboardType, secureTextEntry } = getInputPropsFromType(type);

  const handleDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate && onChange) {
      onChange(selectedDate);
    }
  };

  const displayValue =
    type === "date" || type === "time"
      ? value instanceof Date
        ? type === "date"
          ? value.toLocaleDateString()
          : value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : ""
      : value?.toString() || "";

  const renderInput = () => {
    if (type === "date" || type === "time") {
      // fake an input field using Pressable + Text
      return (
        <>
          <Pressable
            onPress={() => !disabled && setShowPicker(true)}
            style={[
              styles.input,
              { borderColor, opacity: disabled ? 0.5 : 1 },
              style,
            ]}
          >
            <Text
              style={{
                fontSize: 14,
                color: displayValue ? "#111827" : "#9ca3af", // gray-900 or placeholder gray
              }}
            >
              {displayValue || placeholder || (type === "date" ? "Select date" : "Select time")}
            </Text>
          </Pressable>

          {showPicker && (
            <DateTimePicker
              mode={type === "date" ? "date" : "time"}
              value={value instanceof Date ? value : new Date()}
              onChange={handleDateChange}
              minimumDate={minDate}
              maximumDate={maxDate}
              display={Platform.OS === "ios" ? "spinner" : "default"}
            />
          )}
        </>
      );
    }

    // normal text-like input
    return (
      <TextInput
        style={[
          styles.input,
          { borderColor, opacity: disabled ? 0.5 : 1 },
          style,
        ]}
        placeholder={placeholder}
        value={displayValue}
        onChangeText={(text) => onChange?.(text)}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        editable={!disabled}
        placeholderTextColor="#9ca3af"
      />
    );
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      {renderInput()}
      {hint && <Text style={[styles.hint, { color: hintColor }]}>{hint}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500",
    color: "#374151", // gray-700
  },
  input: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    justifyContent: "center",
    fontSize: 14,
    backgroundColor: "transparent",
  } as TextStyle,
  hint: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default Input;
