import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default {
  /* Heading_1: Onboarding*/
  heading_1: {
    fontSize: wp(4.8 * 2),
    lineHeight: hp(6.5),
    fontFamily: "FredokaBold",
  },
  /* Heading_2: Primary*/
  heading_2: {
    fontSize: wp(8),
    lineHeight: hp(5.6),
    fontFamily: "FredokaSemiBold",
  },
  /* Heading_3: Secondary*/
  heading_3: {
    fontSize: wp(3.3 * 2),
    lineHeight: hp(4.7),
    fontFamily: "FredokaMedium",
  },
  /* text_1: Body/Headline*/
  text_1: {
    fontSize: wp(2.7 * 2),
    lineHeight: hp(3.9),
    fontFamily: "FredokaMedium",
  },
  /* text_2: body*/
  text_2: {
    fontSize: wp(2.3 * 2),
    lineHeight: hp(3.3),
    fontFamily: "QuickSandMedium",
  },
  /* text_3: details*/
  text_3: {
    fontSize: wp(1.9 * 2),
    lineHeight: hp(2.7),
    fontFamily: "QuickSandRegular",
  },
  /* text_4: tabbar/others*/
  text_4: {
    fontSize: wp(1.6 * 2),
    lineHeight: hp(2.3),
    fontFamily: "QuickSandLight",
  },
  QuickSandBold: {
    fontSize: wp(2.3 * 2),
    lineHeight: hp(3.3),
    fontFamily: "QuickSandBold",
  },
};
