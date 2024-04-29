import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from "react-native";
import React, { useState } from "react";
import { createRecipe } from "@/services/db/recipe.service";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSession } from "@/context/auth";

const CustomRecipeScreen = () => {
  const { session } = useSession();
  const baseUrl = "https://www.themealdb.com/";
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [ingredientInputField, setIngredientInputField] = useState<string>("");
  const [instructionInputField, setInstructionInputField] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0); // in minutes
  const [ingredients, setIngredients] = useState<{ name: string }[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const saveRecipe = async () => {
    const recipe = {
      uuid: session,
      title,
      description,
      duration,
      ingredients,
      instructions,
    };
    console.log(recipe);
    setIsLoading(true);
    const response = await createRecipe(recipe);
    router.back();
    setIsLoading(false);

    console.log(response);
  };

  // useEffect(() => {
  //   const fetchIngredientImage = async () => {
  //     if (
  //       ingredients.length > 0 &&
  //       !ingredients[ingredients.length - 1].imageUrl
  //     ) {
  //       console.log("get ingredient image");
  //       const response = await getIngredientImage(
  //         ingredients[ingredients.length - 1].name.toLocaleLowerCase()
  //       );
  //       console.log(response);
  //       setIngredients((prevIngredients) => {
  //         const newIngredients = [...prevIngredients];
  //         newIngredients[ingredients.length - 1].imageUrl = response.url;
  //         return newIngredients;
  //       });
  //     }
  //   };

  //   fetchIngredientImage();
  // }, [ingredients]);

  return (
    <>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView>
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Recipe title"
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
          <View style={styles.divider}></View>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="A short description"
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
          <View style={styles.divider}></View>
          <View style={styles.ingredientsHeadercontainer}>
            <Text style={styles.inputLabel}>Ingredients</Text>
            <TouchableOpacity onPress={() => setIngredients([])}>
              <Text>Clear all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ingredientsContainer}>
            <Text style={styles.infoLabel}>Tap to edit or delete</Text>
            {ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientContainer}>
                {ingredient.name && (
                  <View style={styles.ingredientImageContainer}>
                    <Image
                      source={{
                        uri: `${baseUrl}images/ingredients/${ingredient.name}-Small.png`,
                      }}
                      style={styles.ingredientImage}
                    />
                  </View>
                )}
                <Text>{ingredient.name}</Text>
                {/* <Text>{ingredient.quantity}</Text>
                <Text>{ingredient.unit}</Text> */}
              </View>
            ))}
            <TextInput
              value={ingredientInputField}
              style={styles.input}
              placeholder="Add ingredient"
              onChangeText={(text) => setIngredientInputField(text)}
              onSubmitEditing={async (event) => {
                const name = event.nativeEvent.text.toLocaleLowerCase();
                setIngredients((prevIngredients) => [
                  ...prevIngredients,
                  {
                    name: name,
                    quantity: 0,
                    unit: "",
                    imageUrl: `${baseUrl}images/ingredients/${name}-Small.png`,
                  },
                ]);
                setIngredientInputField("");
              }}
            />
          </View>
          <View style={styles.divider}></View>
          <View style={styles.ingredientsHeadercontainer}>
            <Text style={styles.inputLabel}>Instructions</Text>
            <TouchableOpacity onPress={() => setInstructions([])}>
              <Text>Clear all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ingredientsContainer}>
            <Text style={styles.infoLabel}>Tap to edit or delete</Text>
            {instructions.map((instruction, index) => (
              <View key={index} style={styles.outerInstructionContainer}>
                <View style={styles.instructionContainer}>
                  <View style={styles.stepCountContainer}>
                    <Text style={styles.stepCountText}> {index + 1}</Text>
                  </View>
                  <Text>{instruction}</Text>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setInstructions((prevInstructions) => {
                      const newInstructions = [...prevInstructions];
                      newInstructions.splice(index, 1);
                      return newInstructions;
                    });
                  }}
                >
                  <Ionicons name="close" size={24} color="grey" />
                </TouchableOpacity>
              </View>
            ))}
            <TextInput
              value={instructionInputField}
              style={styles.input}
              placeholder="Add instruction"
              onChangeText={(text) => setInstructionInputField(text)}
              onSubmitEditing={async (event) => {
                setInstructions((prevInstructions) => [
                  ...prevInstructions,
                  event.nativeEvent.text,
                ]);
                setInstructionInputField("");
              }}
            />
          </View>
          <View style={styles.divider}></View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => saveRecipe()}
            disabled={
              isLoading ||
              !title ||
              !description ||
              !instructions.length ||
              !ingredients.length
            }
          >
            {isLoading ? <Text>Loading...</Text> : <Text>Save</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default CustomRecipeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  pageTitle: {
    fontSize: 24,
    marginBottom: 10,
  },

  inputLabel: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    padding: 10,
    display: "flex",
    gap: 10,

    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10, // added border radius
  },
  divider: {
    height: 1,
    backgroundColor: "lightgrey",
    marginVertical: 10,
  },
  ingredientContainer: {
    width: "100%",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  ingredientImageContainer: {
    marginLeft: 2,
    width: 35,
    height: 35,
    backgroundColor: "#f5f5f5", // eggshell color
    borderRadius: 50,
    shadowColor: "#000",
    padding: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ingredientImage: {
    width: "100%",
    height: "100%",
  },

  infoLabel: {
    fontSize: 12,
    color: "grey",
  },
  ingredientsContainer: {
    display: "flex",
    gap: 10,
  },
  ingredientsHeadercontainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  instructionContainer: {
    width: "80%",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },

  stepCountContainer: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    marginLeft: 2,
    padding: 5,
    width: 35,
    height: 35,
    backgroundColor: "#f5f5f5",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stepCountText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  outerInstructionContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
  },

  closeButton: {
    padding: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "lightblue",
    padding: 15,
    width: "100%",
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
