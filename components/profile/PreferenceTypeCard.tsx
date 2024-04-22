import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

type Preference = {
  id: number;
  name: string;
};

const PreferenceTypeCard = ({
  title,
  selected,
  options,
  optionSelect,
  deleteSelected,
}: {
  title: string;
  selected: Preference[];
  options: Preference[];
  optionSelect: (option: Preference) => void;
  deleteSelected: (option: Preference) => void;
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const [searchText, setSearchText] = useState<string>("");
  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };
  const handleSearchTextChange = (text: string) => {
    setShowDropdown(true);
    setSearchText(text);
  };
  const filteredAllergyTypes = options.filter((option) =>
    option.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.preferenceTypeCard}>
      <Text style={styles.preferenceTitle}>{title}</Text>
      <View style={styles.userAllergiesContainer}>
        {selected.map((item) => (
          <View style={styles.selectedOptionTag} key={item.id}>
            <Text>{item.name}</Text>
            <Ionicons
              name="close"
              size={20}
              onPress={() => {
                deleteSelected(item);
              }}
            />
          </View>
        ))}
        <TextInput
          onFocus={handleDropdownToggle}
          placeholder="Enter your allergies"
          keyboardType="default"
          value={searchText}
          onChangeText={handleSearchTextChange}
        />
      </View>

      {showDropdown && (
        <View style={styles.dropdownContainer}>
          {filteredAllergyTypes.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownOption}
              onPress={() => {
                setSearchText("");
                setShowDropdown(false);
                optionSelect(option);
              }}
            >
              <Text>{option.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default PreferenceTypeCard;

const styles = StyleSheet.create({
  preferenceTypeCard: {
    display: "flex",
    rowGap: 5,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownButton: {
    backgroundColor: "lightgrey",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  dropdownContainer: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
  },
  dropdownOption: {
    padding: 10,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
  },
  selectedOptionTag: {
    display: "flex",
    flexDirection: "row",
    rowGap: 5,
    backgroundColor: "lightgrey",
    padding: 5,
    borderRadius: 5,
  },
  userAllergiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 5,
    columnGap: 5,
  },
});
