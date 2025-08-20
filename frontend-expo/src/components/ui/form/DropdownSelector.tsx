import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  FlatList,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';

export interface Option {
  value: string;
  label: string;
}

interface DropdownSelectorProps {
  label?: string;
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export default function DropdownSelector({
  label,
  options,
  placeholder = "Seleccionar opción",
  onChange,
  defaultValue = "",
  value,
  disabled = false
}: DropdownSelectorProps) {
  const { colors } = useAppTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Update selected value when prop changes
  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
      const option = options.find(opt => opt.value === value);
      setSelectedLabel(option?.label || "");
    }
  }, [value, options]);

  const handleToggle = () => {
    if (disabled) return;
    
    if (isOpen) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setIsOpen(false));
    } else {
      setIsOpen(true);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleSelect = (option: Option) => {
    setSelectedValue(option.value);
    setSelectedLabel(option.label);
    onChange(option.value);
    handleToggle();
  };

  const selectedOption = options.find(opt => opt.value === selectedValue);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.selector,
          { 
            backgroundColor: colors.inputBackground,
            borderColor: isOpen ? colors.inputBorderFocus : colors.border,
            opacity: disabled ? 0.6 : 1
          }
        ]}
        onPress={handleToggle}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.selectorText,
          { 
            color: selectedOption ? colors.inputText : colors.inputPlaceholder 
          }
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        
        <Animated.View style={{
          transform: [{
            rotate: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '180deg']
            })
          }]
        }}>
          <Ionicons 
            name="chevron-down" 
            size={20} 
            color={colors.textSecondary} 
          />
        </Animated.View>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleToggle}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleToggle}
        >
          <View style={[styles.dropdownContainer, { backgroundColor: colors.modalBackground }]}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    { 
                      backgroundColor: item.value === selectedValue ? colors.surfaceSecondary : 'transparent',
                      borderBottomColor: colors.borderSecondary
                    }
                  ]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.optionText,
                    { 
                      color: item.value === selectedValue ? colors.textPrimary : colors.textSecondary,
                      fontWeight: item.value === selectedValue ? '600' : '400'
                    }
                  ]}>
                    {item.label}
                  </Text>
                  
                  {item.value === selectedValue && (
                    <Ionicons 
                      name="checkmark" 
                      size={20} 
                      color={colors.info} 
                    />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              style={styles.optionsList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

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
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectorText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    width: screenWidth * 0.8,
    maxWidth: 300,
    maxHeight: 300,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
});
