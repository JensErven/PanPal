import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import React, { useRef } from "react";
import { Image } from "expo-image";
import { blurhash } from "@/utils/general.utils";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import Fonts from "@/constants/Fonts";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import ComponentParams from "@/constants/ComponentParams";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import StandardButton from "./buttons/StandardButton";
import * as ImagePicker from "expo-image-picker";
import RoundButton from "./buttons/RoundButton";
import { openaiServices } from "@/services/api/openai.services";
import { RecipeType } from "@/models/RecipeType";
import { AuthContext } from "@/context/authContext";

const RecipeImageContainer = ({
  allowedToEdit = false,
  img,
  recipe,
  handleNewImage,
  setRecipe,
}: {
  allowedToEdit: boolean;
  recipe?: RecipeType;
  img: string;
  handleNewImage: (image: string) => void;
  setRecipe?: (recipe: RecipeType) => void;
}) => {
  // image string
  const generateImageCreditCost = 10;
  const [image, setImage] = React.useState<string>("");
  // modal
  const modalRef = useRef<BottomSheetModal>(null);
  const handleOpenModal = () => {
    if (!allowedToEdit) return;
    modalRef.current?.present();
  };
  const [isGeneratingImage, setIsGeneratingImage] =
    React.useState<boolean>(false);
  const { credits, subtractCredits } = React.useContext<any>(AuthContext);

  const { generateRecipeImage } = openaiServices;

  const handleCloseModal = () => {
    modalRef.current?.dismiss();
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      handleNewImage(result.assets[0].uri);
      handleCloseModal();
    } else {
      handleCloseModal();
    }
  };

  const handleGenerateImage = () => {
    if (!recipe) {
      console.error("Recipe not found");
      return;
    }
    if (credits < generateImageCreditCost) {
      ToastAndroid.show("Insufficient Panpal Credits", ToastAndroid.SHORT);
      return;
    }
    setIsGeneratingImage(true);
    generateRecipeImage(recipe as RecipeType).then(
      (res) => {
        if (res) {
          handleNewImage(res);
          subtractCredits(generateImageCreditCost);
          ToastAndroid.show(
            `${generateImageCreditCost} PanPal Credits deducted`,
            ToastAndroid.SHORT
          );
        }
        handleCloseModal();
        setIsGeneratingImage(false);
      },
      (err) => {
        Alert.alert("Failed to generate image", err.message);
        setIsGeneratingImage(false);
      }
    );
  };

  return (
    <>
      <BottomSheetModal
        backgroundStyle={styles.modalBackground}
        handleComponent={() => (
          <View style={styles.handleContainer}>
            <View style={styles.handle}></View>
          </View>
        )}
        ref={modalRef}
        snapPoints={[hp(28)]}
        index={0}
        backdropComponent={(backdropProps) => (
          <TouchableOpacity
            activeOpacity={0.6}
            {...backdropProps}
            style={styles.backdrop}
            onPress={handleCloseModal}
          ></TouchableOpacity>
        )}
      >
        <BottomSheetView style={styles.modalViewContainer}>
          <Text style={styles.modalTitle}>Image</Text>
          <View style={styles.modalContent}>
            <StandardButton
              isDisabled={isGeneratingImage}
              textValue="Choose from gallery"
              colors={[Colors.primarySkyBlue, Colors.primarySkyBlue]}
              height={ComponentParams.button.height.medium}
              borderColor="transparent"
              iconRight={
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: hp(ComponentParams.button.height.small),
                    aspectRatio: 1,
                    borderRadius: hp(ComponentParams.button.height.small),
                    marginRight: wp(2),
                  }}
                >
                  <Ionicons
                    name="images"
                    size={hp(3.2)}
                    color={Colors.darkGrey}
                  />
                </View>
              }
              textColor={Colors.darkGrey}
              clickHandler={() => pickImageAsync()}
            />
            <StandardButton
              isDisabled={isGeneratingImage}
              loading={isGeneratingImage}
              textValue="Generate image"
              colors={[Colors.primarySkyBlue, Colors.primarySkyBlue]}
              height={ComponentParams.button.height.medium}
              borderColor="transparent"
              iconRight={
                <View style={styles.panpalCreditsContainer}>
                  <Text style={styles.panpalCreditsText}>
                    {generateImageCreditCost}
                  </Text>
                  <LinearGradient
                    style={styles.panpalCreditsButtonContainer}
                    colors={[
                      Colors.light.components.button.gold.background[0],
                      Colors.light.components.button.gold.background[1],
                    ]}
                    start={[0.5, 0]}
                    end={[0.5, 1]}
                  >
                    <Text style={styles.panpalCreditsButtonText}>pp</Text>
                  </LinearGradient>
                </View>
              }
              iconLeft={
                <View style={styles.generateButtonIconLeft}>
                  <Ionicons
                    name="sparkles"
                    size={hp(2.7)}
                    color={Colors.mediumPurple}
                  />
                </View>
              }
              textColor={Colors.darkGrey}
              clickHandler={() => handleGenerateImage()}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>

      <LinearGradient
        colors={[Colors.white, Colors.primarySkyBlue]}
        style={styles.container}
      >
        {allowedToEdit && (
          <View style={styles.smallFloatingButton}>
            <RoundButton
              transparent={false}
              handlePress={handleOpenModal}
              backgroundColor={"rgba(0, 0, 0, 0.4)"}
            >
              <Ionicons name="camera" size={hp(2.7)} color={Colors.white} />
            </RoundButton>
          </View>
        )}

        {img ? (
          <Image
            style={styles.recipeImage}
            source={img ? img : blurhash}
            placeholder={blurhash}
            contentFit="cover"
            transition={500}
          />
        ) : (
          <View style={styles.emptyImage}>
            <Ionicons
              name="image"
              size={hp(10)}
              color={Colors.primarySkyBlue}
            />
          </View>
        )}
      </LinearGradient>
    </>
  );
};

export default RecipeImageContainer;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 3 / 2,
    backgroundColor: Colors.secondaryWhite,
    justifyContent: "center",
    alignItems: "center",
  },
  recipeImage: {
    width: "100%",
    aspectRatio: 3 / 2,
  },
  emptyImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  smallFloatingButton: {
    position: "absolute",
    bottom: hp(2),
    right: wp(4),
    zIndex: 1,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    opacity: 0.6,
  },
  // modal
  handleContainer: {
    alignItems: "center",
    height: hp(ComponentParams.button.height.small),
    justifyContent: "center",
  },
  handle: {
    width: wp(10),
    height: hp(1),
    borderRadius: hp(0.5),
    backgroundColor: Colors.primarySkyBlue,
  },

  modalViewContainer: {
    flex: 1,

    paddingHorizontal: wp(4),
  },
  modalBackground: {
    borderTopLeftRadius: hp(ComponentParams.button.height.medium / 2),
    borderTopRightRadius: hp(ComponentParams.button.height.medium / 2),
    borderColor: Colors.secondaryWhite,
    borderWidth: 2,
    backgroundColor: Colors.white,
  },
  modalTitle: {
    fontSize: Fonts.heading_3.fontSize,
    fontFamily: Fonts.heading_3.fontFamily,
    lineHeight: Fonts.heading_3.lineHeight,
    color: Colors.darkBlue,
    textTransform: "capitalize",
  },
  modalContent: {
    paddingVertical: hp(2),
    gap: hp(1),
  },
  modalButton: {
    paddingHorizontal: wp(4),
    backgroundColor: Colors.primarySkyBlue,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
  },
  modalButtonText: {
    fontSize: Fonts.text_1.fontSize,
    fontFamily: Fonts.text_1.fontFamily,
    color: Colors.darkGrey,
    textTransform: "capitalize",
  },
  panpalCreditsContainer: {
    display: "flex",
    flexDirection: "row",
    marginRight: wp(1),
    gap: wp(1),
    justifyContent: "center",
    alignItems: "center",
  },
  panpalCreditsText: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_1.lineHeight,
  },
  panpalCreditsButtonText: {
    textTransform: "uppercase",
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGold,
    textAlign: "center",
    position: "absolute",
    textAlignVertical: "center",
  },
  panpalCreditsButtonContainer: {
    borderBottomColor: Colors.darkGold,
    borderBottomWidth: 1,
    borderRightColor: Colors.darkGold,
    borderRightWidth: 1,
    borderRadius: hp(ComponentParams.button.height.small),
    width: hp(ComponentParams.button.height.small),
    height: hp(ComponentParams.button.height.small),
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 1,
  },
  generateButtonIconLeft: {
    justifyContent: "center",
    alignItems: "center",
    width: hp(ComponentParams.button.height.small),
    aspectRatio: 1,
    borderRadius: hp(ComponentParams.button.height.small),
    marginLeft: wp(1),
  },
});
