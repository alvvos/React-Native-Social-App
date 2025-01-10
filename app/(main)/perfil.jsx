import { StyleSheet, View } from 'react-native'
import React from 'react'
import Pantalla from '../../components/Pantalla'
import { useRouter } from 'expo-router'
import  Cabecera  from '../../components/Cabecera'
import { useAuth } from '../../context/AuthContext'
import { ancho, alto } from '../../helpers/dimensiones'
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler'
import Icon from '../../assets/icons'
import { tema } from '../../constants/tema'

const perfil = () => {

  const {user, setAuth} = useAuth()
  const router = useRouter()

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Logout", "Ha habido un problema cerrando tu sesión!");
    }
  }; 

  return (
    <GestureHandlerRootView>
      <Pantalla colorFondo="white">
        <View style={{flex:1, paddingHorizontal:ancho(7)}}>
          <Cabecera titulo="Perfil" atras={true}></Cabecera>
          <TouchableOpacity style={styles.logout} onPress={onLogout}>
            <Icon name="logout"  strokeWidth={2} color={tema.colors.text}></Icon>
          </TouchableOpacity>
        </View>
      </Pantalla>
    </GestureHandlerRootView>
  )
}

export default perfil

const styles = StyleSheet.create({

  container:{
    flex:1
  },
  contenedorCabecera: {
    marginHorizontal: ancho(4),
    marginBottom: 20
  },
  formaCabecera:{
    width: ancho(100),
    height: alto(20),
  },
  contenedorAvatar: {
    height: alto(12),
    width : ancho(12),
    alignSelf: 'center'
  },
  iconoEditar: {
    position: 'absolute',
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius:50,
    backgroundColor:'white'
  },
  info:{
    flex:'row',
    alignItems:'center',
    gap:10
  },
  usuario:{
    fontSize: alto(3),
    fontWeight: '500',
    color: tema.colors.primaryDark
  }


})