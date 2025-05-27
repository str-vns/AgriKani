import React, { useRef, useEffect } from "react";
import { View } from "react-native";
import style from "@stylesheets/Shared/Loading/style";
import LottieView from "lottie-react-native";

export default function Loader() {
  const load = require("@assets/animation/Loading");

  return (
    <View style={style.container}>
      <LottieView source={load} autoPlay loop style={style.animationImg} />
    </View>
  );
}
