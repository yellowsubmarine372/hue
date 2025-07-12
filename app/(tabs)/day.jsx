import { View, Text, StyleSheet } from 'react-native'
import { useState, useEffect } from 'react'
import DayPaper from '../../components/DayPaper'

function getComplementaryColor(hex) {
  const r = 255 - parseInt(hex.slice(1, 3), 16)
  const g = 255 - parseInt(hex.slice(3, 5), 16)
  const b = 255 - parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

export default function DayScreen() {
  const [isAfternoon, setIsAfternoon] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  const baseColor = '#89CFF0'
  const complementaryColor = getComplementaryColor(baseColor)

  useEffect(() => {
    const now = new Date()
    setCurrentTime(now)
    setIsAfternoon(now.getHours() >= 12)
  }, [])

  const toggleTime = () => {
    setIsAfternoon(prev => !prev)
    const newTime = new Date(currentTime)
    newTime.setHours(isAfternoon ? 9 : 15)
    setCurrentTime(newTime)
  }

  return (
    <View style={styles.container}>
      <DayPaper
        isAfternoon={isAfternoon}
        onFlip={toggleTime}
        frontColor={baseColor}
        backColor={complementaryColor}
      />
      <Text style={styles.timeText}>
        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  timeText: {
    marginTop: 24,
    fontSize: 20,
    color: '#333',
    fontFamily: 'System',
  },
})