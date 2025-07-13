// DayScreen.jsx
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { Canvas } from '@react-three/fiber/native'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import { useEffect, useState } from 'react'
import DayPaper3D from '../../components/DayPaper3d'
import { useSharedValue, runOnJS } from 'react-native-reanimated'

const { width } = Dimensions.get('window')

// 보색 계산 함수
const getComplementaryColor = (hexColor) => {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // 보색 계산
  const compR = (255 - r).toString(16).padStart(2, '0')
  const compG = (255 - g).toString(16).padStart(2, '0')
  const compB = (255 - b).toString(16).padStart(2, '0')
  
  return `#${compR}${compG}${compB}`
}

// 랜덤 색깔 생성
const getRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D2B4DE'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export default function DayScreen() {
  const [currentTime, setCurrentTime] = useState(() => new Date())
  const [frontColor, setFrontColor] = useState('#A5D8FF')
  const [backColor, setBackColor] = useState(() => getComplementaryColor('#A5D8FF'))
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

  const changeColors = () => {
    const newFrontColor = getRandomColor()
    const newBackColor = getComplementaryColor(newFrontColor)
    setFrontColor(newFrontColor)
    setBackColor(newBackColor)
  }

  let base = 0
  const panRotation = Gesture.Pan()
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

  const tapColor = Gesture.Tap()
    .onEnd(() => {
      runOnJS(changeColors)()
    })

  const combinedGesture = Gesture.Simultaneous(panRotation, tapColor)

  return (
    <GestureDetector gesture={combinedGesture}>
      <View style={styles.container}>
        <Canvas style={styles.canvas}>
          <ambientLight />
          <directionalLight position={[0, 5, 5]} />
          <DayPaper3D 
            rotationShared={rotationShared} 
            frontColor={frontColor}
            backColor={backColor}
          />
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