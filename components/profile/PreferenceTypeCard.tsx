import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import {
  BORDER_RADIUS_LARGE,
  BORDER_RADIUS_MEDIUM,
  BORDER_RADIUS_SMALL,
} from "@/constants/ScreenParams";

type Preference = {
  id: number;
  name: string;
};

const PreferenceTypeCard = ({
  title,
  selected,
  options,
  placeholder,
  optionSelect,
  deleteSelected,
}: {
  title: string;
  placeholder: string;
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
            <Text style={{ color: Colors.midnight }}>{item.name}</Text>
            <Ionicons
              name="close"
              size={20}
              color={Colors.midnight}
              onPress={() => {
                deleteSelected(item);
              }}
            />
          </View>
        ))}
        <TextInput
          onFocus={handleDropdownToggle}
          placeholder={placeholder + "..."}
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
    backgroundColor: Colors.pearl,
    display: "flex",
    rowGap: 5,
    borderRadius: BORDER_RADIUS_SMALL,
    padding: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.pearl,

    shadowColor: Colors.midnight,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.midnight,
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
    backgroundColor: Colors.frost,
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
