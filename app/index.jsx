import React from 'react'
import Pantalla from '../components/Pantalla'
import { useRouter } from 'expo-router'

const index = () => {
  const router=useRouter()
  return (
   <Pantalla  bg="black"></Pantalla>
  )
}

export default index