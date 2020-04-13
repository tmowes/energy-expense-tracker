import React from 'react'
import { View, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

import Colors from '../constants/colors'
import Size from '../constants/sizes'

export default function AddButton(props) {
  return (
    <View style={{ ...styles.addButton, ...props.style }}>
      {props.children}
      <MaterialIcons
        name={'flash-on'}
        size={Size.iconSize}
        color={Colors.colorArrPreset[0]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Size.buttonSize,
    height: Size.buttonSize,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    backgroundColor: Colors.colorArrPreset[4],
    borderRadius: Size.buttonSize / 2,
    elevation: 8,
    padding: 10,
    marginVertical: 10,
  },
})
