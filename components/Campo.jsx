import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TextInput } from "react-native-gesture-handler";
import { tema } from "../constants/tema";
import { alto } from '../helpers/dimensiones'

const Campo = (props) => {
  return (
    <View
      style={[styles.container, props.containerStyles && props.containerStyles]}
    >
      {props.icon && props.icon}
      <TextInput
        style={{ flex: 1 }}
        placeholderTextColor={tema.colors.textLight}
        ref={props.inputRef && props.inputRef}
        {...props}
      />
    </View>
  );
};

export default Campo;

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        height: alto(8),
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderColor: tema.colors.text,
        borderRadius: tema.radius.xxl,
        borderCurve: 'continuous',
        paddingHorizontal: 18,
        gap:12

    }
});
