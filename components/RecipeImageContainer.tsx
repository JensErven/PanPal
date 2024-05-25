import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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

const RecipeImageContainer = ({
  allowedToEdit = false,
  img,
  handleNewImage,
}: {
  allowedToEdit: boolean;
  img: string;
  handleNewImage: (image: string) => void;
}) => {
  // image string
  const [image, setImage] = React.useState<string>("");
  // modal
  const modalRef = useRef<BottomSheetModal>(null);
  const handleOpenModal = () => {
    if (!allowedToEdit) return;
    modalRef.current?.present();
  };

  const handleCloseModal = () => {
    modalRef.current?.dismiss();
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
      setImage(result.assets[0].uri);
      handleNewImage(result.assets[0].uri);
      handleCloseModal();
    } else {
      handleCloseModal();
    }
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
        snapPoints={[hp(22)]}
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
    height: hp(ComponentParams.button.height.medium),

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
    backgroundColor: Colors.secondaryWhite,
    paddingHorizontal: wp(4),
  },
  modalBackground: {
    borderTopLeftRadius: hp(ComponentParams.button.height.medium / 2),
    borderTopRightRadius: hp(ComponentParams.button.height.medium / 2),
    backgroundColor: Colors.secondaryWhite,
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
    gap: hp(2),
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
});
