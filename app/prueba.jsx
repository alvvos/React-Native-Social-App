import { StyleSheet, Text, View } from "react-native";
import CajadeColor from "../components/CajadeColor";
import { useState, useEffect } from "react";
import { Pressable } from "react-native";

const prueba = () => {
  const [color, setColor] = useState("Black");

  return (
    <>
      <View style={{ marginTop: 80 }}>
        <Pressable onPress={""}>
          <CajadeColor color="black" texto={color} />
        </Pressable>
      </View>
    </>
  );
};

export default prueba;

const styles = StyleSheet.create({});
