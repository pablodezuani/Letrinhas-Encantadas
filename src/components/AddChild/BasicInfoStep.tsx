"use client"

import { View, StyleSheet, Alert } from "react-native"
import { PhotoSelector } from "./PhotoSelector"
import { ElegantInput } from "./ElegantInput"
import { ChildData } from "../../../types"
import { GenderSelector } from "./GenderSelector"
import { TeaSelector } from "./TeaSelector"


interface BasicInfoStepProps {
  childData: ChildData
  setChildData: (data: ChildData) => void
}

export function BasicInfoStep({ childData, setChildData }: BasicInfoStepProps) {
  const selectPhoto = () => {
    Alert.alert("Selecionar Foto", "Escolha uma opção:", [
      { text: "Câmera", onPress: () => console.log("Abrir câmera") },
      { text: "Galeria", onPress: () => console.log("Abrir galeria") },
      { text: "Cancelar", style: "cancel" },
    ])
  }

  return (
    <>
      <PhotoSelector photo={childData.photo} onSelectPhoto={selectPhoto} />

      <View style={styles.fieldsContainer}>
        <ElegantInput
          placeholder="Nome da criança"
          value={childData.name}
          onChangeText={(text) => setChildData({ ...childData, name: text })}
          icon="person"
          required
        />

        <ElegantInput
          placeholder="Apelido (opcional)"
          value={childData.nickname}
          onChangeText={(text) => setChildData({ ...childData, nickname: text })}
          icon="heart-outline"
        />

        <View style={styles.rowInputs}>
          <View style={styles.halfInput}>
            <ElegantInput
              placeholder="Idade"
              value={childData.age}
              onChangeText={(text) => setChildData({ ...childData, age: text })}
              icon="calendar-outline"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.halfInput}>
            <GenderSelector value={childData.gender} onSelect={(gender) => setChildData({ ...childData, gender })} />
          </View>
        </View>
      </View>

      <TeaSelector
        hasAutism={childData.hasAutism}
        autismLevel={childData.autismLevel}
        onSelectAutism={(hasAutism) => setChildData({ ...childData, hasAutism })}
        onSelectLevel={(autismLevel) => setChildData({ ...childData, autismLevel })}
      />
    </>
  )
}

const styles = StyleSheet.create({
  fieldsContainer: {
    gap: 16,
    marginBottom: 25,
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
})
