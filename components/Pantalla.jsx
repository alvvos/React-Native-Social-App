import React, { Component } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Pantalla = ({ children, colorFondo }) => {
  const { top } = useSafeAreaInsets();
    const paddingTop = top > 0 ? top + 5 : 30;
  return <View style={{ flex: 1, paddingTop, backgroundColor: colorFondo }}>{children}</View>;
};

export default Pantalla;