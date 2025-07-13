// DayScreen.jsx
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { Canvas } from '@react-three/fiber/native'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import { useEffect, useState } from 'react'
import DayPaper3D from '../../components/DayPaper3d'
import { useSharedValue, runOnJS } from 'react-native-reanimated'

const { width } = Dimensions.get('window')

export default function DayScreen() {
  const [currentTime, setCurrentTime] = useState(() => new Date())
  const rotationShared = useSharedValue(0)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)

      const h  = now.getHours()
      const m  = now.getMinutes()
      const s  = now.getSeconds()
      const tot = h * 60 + m + s / 60
      rotationShared.value = (tot / 1440) * 360 - 180
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const updateTimeFromTimestamp = (timestamp) => {
    const newDate = new Date(timestamp)
    setCurrentTime(newDate)
  }

  let base = 0
  const pan = Gesture.Pan()
    .onStart(() => { base = rotationShared.value })
    .onUpdate(e => {
      const delta = (e.translationX / width) * 360
      const normalized = ((base + delta + 180) % 360) - 180
      rotationShared.value = normalized

      const minsTot = ((normalized + 180) / 360) * 1440
      let h = Math.floor(minsTot / 60)
      let m = Math.floor(minsTot % 60)

      // 유효성 검사
      if (isNaN(h) || h < 0 || h > 23) h = 0
      if (isNaN(m) || m < 0 || m > 59) m = 0

      const newDate = new Date()
      newDate.setHours(h, m, 0, 0)
      
      if (!isNaN(newDate.getTime())) {
        runOnJS(updateTimeFromTimestamp)(newDate.getTime())
      }
    })

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.container}>
        <Canvas style={styles.canvas}>
          <ambientLight />
          <directionalLight position={[0, 5, 5]} />
          <DayPaper3D rotationShared={rotationShared} />
        </Canvas>

        <Text style={styles.time}>
          {String(currentTime.getHours()).padStart(2,'0')}:
          {String(currentTime.getMinutes()).padStart(2,'0')}
        </Text>
      </View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#fff'},
  canvas:{ width:'100%', height:400},
  time:{ marginTop:24, marginBottom:32, textAlign:'center', fontSize:32, fontWeight:'bold'}
})