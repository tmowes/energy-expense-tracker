import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  Keyboard,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialIcons } from '@expo/vector-icons'

import styles from './styles'
import Colors from '../constants/colors'
import Size from '../constants/sizes'

const kwhConsumedPrevious = 19383
const kwhBasicCostPrevious = 0.583733
const kwhExtraCostPrevious = 0.696173
const termoTaxPrevious = 0
const publicTaxPrevious = 12.94

const dateOpen = new Date('03/18/2020')
const dateClose = new Date('04/17/2020')
const dateToday = Date.now()

const diffTimeTotal = Math.abs(dateClose - dateOpen)
const diffDaysTotal = Math.ceil(diffTimeTotal / (1000 * 60 * 60 * 24))
console.log(diffDaysTotal)

export default function Home() {
  const [settingsState, setSettingsState] = useState(0)
  const [kwhConsumedPartial, setKwhConsumedPartial] = useState(
    kwhConsumedPrevious,
  )
  const [kwhConsumedToday, setKwhConsumedToday] = useState(0)
  const [kwhConsumedTotal, setKwhConsumedTotal] = useState(0)
  const [kwhBasicCost, setKwhBasicCost] = useState(kwhBasicCostPrevious)
  const [kwhExtraCost, setKwhExtraCost] = useState(kwhExtraCostPrevious)
  const [termoTax, setTermoTax] = useState(termoTaxPrevious)
  const [publicTax, setPublicTax] = useState(publicTaxPrevious)
  const [calcTotal, setCalcTotal] = useState(0)
  const [calcKwh, setCalcKwh] = useState(0)
  const [diffDaysPartial, setDiffDaysPartial] = useState(0)

  useEffect(() => {
    console.log('renderizou')
  }, [])

  function numberInputHandler(inputText) {
    setKwhConsumedPartial(inputText.replace(/[^0-9]/g, ''))
  }

  function handleCalcTotal(kwhConsumed) {
    let calcSubValue = 0
    if (kwhConsumed <= 150) {
      calcSubValue = kwhConsumed * kwhBasicCost
    } else {
      calcSubValue = 150 * kwhBasicCost + (kwhConsumed - 150) * kwhExtraCost
    }
    console.log('handleCalcTotal - calcKwhTemp', kwhConsumed)
    console.log('handleCalcTotal - calcSubValue', calcSubValue)
    console.log('handleCalcTotal - kwhBasicCost', kwhBasicCost)
    console.log('handleCalcTotal - kwhExtraCost', kwhExtraCost)
    return setCalcTotal(calcSubValue + publicTax + termoTax)
  }

  function handleCalcPartial(calcKwhTemp) {
    const dateToday = Date.now()
    const diffTimePartial = Math.abs(dateToday - dateOpen)
    const diffDaysPartial =
      Math.ceil(diffTimePartial / (1000 * 60 * 60 * 24)) - 1
    // console.log(diffDaysPartial)
    let kwhAverage = calcKwhTemp / diffDaysPartial
    setKwhConsumedToday(kwhAverage)
    let kwhConsumed = parseInt(kwhAverage * diffDaysTotal)
    setKwhConsumedTotal(kwhConsumed)
    handleCalcTotal(kwhConsumed)
    setDiffDaysPartial(diffDaysPartial)
    console.log('handleCalcPartial - kwhAverage', kwhAverage)
    console.log('handleCalcPartial - kwhConsumed', kwhConsumed)
  }

  function handleKwhConsumedSubmit() {
    parseInt(kwhConsumedPartial)
    if (
      isNaN(kwhConsumedPartial) ||
      kwhConsumedPartial <= kwhConsumedPrevious ||
      kwhConsumedPartial > kwhConsumedPrevious + 800
    ) {
      Alert.alert(
        'Kwh Invalido!',
        `Kwh precisa ser entre ${kwhConsumedPrevious} e ${
          kwhConsumedPrevious + 800
        }.`,
        [{ text: 'OK', style: 'destructive', onPress: alertAddHandler }],
      )
      return
    }
    let calcKwhTemp = kwhConsumedPartial - kwhConsumedPrevious
    setKwhConsumedPartial(kwhConsumedPartial)
    setCalcKwh(calcKwhTemp)
    handleCalcPartial(calcKwhTemp)
    Keyboard.dismiss()
  }

  function alertAddHandler() {
    setKwhConsumedPartial(kwhConsumedPrevious)
  }

  function handleSettings() {
    console.log('chegou aqui', settingsState)
    let newState = 0
    if (settingsState === 0) {
      newState = 1
    } else {
      newState = 0
    }
    setSettingsState(newState)
  }

  return (
    <LinearGradient
      style={styles.container}
      colors={Colors.colorGradient2}
      start={[0.3, 0.3]}
      end={[0, 0]}>
      <View style={styles.header}>
        <Text style={styles.titleApp}>Energy Expense Tracker</Text>
      </View>
      <View style={styles.cardList}>
        <View style={styles.leftList}>
          <Text style={styles.titleText}>Estimativa Mensal:</Text>
          <Text style={styles.simpleText}>Valor Projetado</Text>
          <Text style={styles.simpleText}>Consumo Projetado</Text>
          <Text style={styles.simpleText}>Data Proxima Leitura</Text>
          <Text style={styles.simpleText}>Data Leitura Anterior</Text>
          <Text style={styles.simpleText}>Leitura Anterior</Text>
          <Text style={styles.simpleText}>Leitura Projetado</Text>
          <Text style={styles.simpleText}></Text>

          <Text style={styles.simpleText}>Consumo Decorrido</Text>
          <Text style={styles.simpleText}>Dia Decorridos</Text>
          <Text style={styles.simpleText}>Média Consumo Dia</Text>
        </View>
        <View style={styles.rightList}>
          <Text style={styles.titleText}>Abril / 2020</Text>
          <Text style={styles.simpleText}>
            {Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(calcTotal)}
          </Text>
          <Text style={styles.simpleText}>{kwhConsumedTotal} Kwh</Text>
          <Text style={styles.simpleText}>
            {Intl.DateTimeFormat('pt-BR').format(dateClose)}
          </Text>
          <Text style={styles.simpleText}>
            {Intl.DateTimeFormat('pt-BR').format(dateOpen)}
          </Text>
          <Text style={styles.simpleText}>{kwhConsumedPrevious} Kwh</Text>
          <Text style={styles.simpleText}>
            {kwhConsumedTotal + kwhConsumedPrevious} Kwh
          </Text>
          <Text style={styles.simpleText}>{'    '}</Text>
          <Text style={styles.simpleText}>{calcKwh} kwh</Text>
          <Text style={styles.simpleText}>{diffDaysPartial} Dias</Text>
          <Text style={styles.simpleText}>
            {Intl.NumberFormat('pt-BR').format(kwhConsumedToday)} Kwh/D
          </Text>
        </View>
      </View>
      <View style={styles.botButtons}>
        <Text style={styles.inputText}>Leitura Hoje:</Text>
        <TextInput
          style={styles.input}
          blurOnSubmit
          autoCapitalize='none'
          maxLength={5}
          keyboardType='number-pad'
          onChangeText={numberInputHandler}
          value={'' + kwhConsumedPartial}
          placeholder={`${kwhConsumedPartial}`}
        />

        <View style={styles.addButton}>
          <TouchableOpacity onPress={handleKwhConsumedSubmit}>
            <MaterialIcons
              name={'flash-on'}
              size={Size.iconSize}
              color={Colors.colorArrPreset[0]}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.botRowButtons}>
        <View style={styles.settingsButtons}>
          <TouchableOpacity activeOpacity={0.5} onPress={handleSettings}>
            <MaterialIcons
              name={'play-for-work'}
              size={Size.iconSize / 1.6}
              color={Colors.colorArrPreset[5]}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.settingsButtons}>
          <TouchableOpacity activeOpacity={0.5} onPress={handleSettings}>
            <MaterialIcons
              name={'keyboard-capslock'}
              size={Size.iconSize / 1.6}
              color={Colors.colorArrPreset[5]}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.settingsButtons}>
          <TouchableOpacity activeOpacity={0.5} onPress={handleSettings}>
            <MaterialIcons
              name={'clear'}
              size={Size.iconSize / 1.6}
              color={Colors.colorArrPreset[5]}
            />
          </TouchableOpacity>
        </View>

        {/* <Text style={styles.titleText}></Text>
        <Text style={styles.simpleText}>Tarifa 150 {data[0]}</Text>
        <Text style={styles.simpleText}>Tarifa Extra {data[1]}</Text>
        <Text style={styles.simpleText}></Text>
        <Text style={styles.simpleText}>
          SubTotal{Math.round(data[0] * 150 + data[0] * 150 + data[2])}
        </Text>
        <Text style={styles.simpleText}>
          {' '}
          COSIP:{'      '}
          {Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(data[2])}
        </Text>
        <Text style={styles.simpleText}>
          {' '}
          Bandeira:{'     '}
          {Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(data[3])}
        </Text>
        <Text style={styles.simpleText}></Text> */}
      </View>
      {settingsState === 1 ? (
        <View style={styles.settingsList}>
          <View
            style={{
              flexDirection: 'row',
              width: '50%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.settingsText}>Tarifa 150</Text>
            <TextInput
              style={styles.settingsInput}
              placeholder={`${kwhBasicCost}`}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '50%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.settingsText}>Tarifa Extra</Text>
            <TextInput
              style={styles.settingsInput}
              placeholder={`${kwhExtraCost}`}
            />
          </View>
          <View style={styles.settingsButtons}>
            <TouchableOpacity activeOpacity={0.5} onPress={handleSettings}>
              <MaterialIcons
                name={'play-for-work'}
                size={Size.iconSize / 1.6}
                color={Colors.colorArrPreset[5]}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View />
      )}
    </LinearGradient>
  )
}
