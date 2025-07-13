import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { TouchableWithoutFeedback, StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'

export default function DayPaper({ isAfternoon, onFlip, frontColor, backColor }) {
  const rotation = useSharedValue(isAfternoon ? 180 : 0)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateY: `${withTiming(rotation.value, { duration: 400 })}deg` }
      ],
    }
  })

  const handleFlip = () => {
    rotation.value = rotation.value === 0 ? 180 : 0
    onFlip()
  }

  return (
    <TouchableWithoutFeedback onPress={handleFlip}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={[styles.face, { backgroundColor: rotation.value === 0 ? frontColor : backColor }]} />
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#fff',
    backfaceVisibility: 'hidden',
  },
  face: {
    flex: 1,
    borderRadius: 12,
  },
})