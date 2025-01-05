import { Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { tema } from '../constants/tema'
import Icon from '../assets/icons'

const Atras = ({router}) => {
  return (
    <Pressable onPress={()=>router.back()} style={styles.button}> 
      <Icon name="arrowLeft" strokeWidth={2.5} size={26} color={tema.colors.text} />
    </Pressable>
  )
}

export default Atras

const styles = StyleSheet.create({
  button:{
    alignSelf:'flex-start',
    padding:5,
    borderRadius: tema.radius.sm,
    backgroundColor: 'rgba(0,0,0,0.07)'
  }
})