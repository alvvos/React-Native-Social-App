import { View } from 'react-native'
import React from 'react'
import { tema } from '../constants/tema'
import AnimatedLoader from 'react-native-animated-loader';


const Carga = ({tam="large", color=tema.colors.primary}) => {
  return (
    <View style={{justifyContent:'center', alignItems:'center', }}>
        <AnimatedLoader
        visible={true}
        overlayColor="rgba(255,255,255,0.75)"
        source={require('../constants/loader.json')}
        animationStyle={{ width: 300, height: 100 }}
        speed={1}
      />
    </View>
  )
}

export default Carga