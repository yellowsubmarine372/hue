import { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import HueLogo from '../components/HueLogo'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

export default function SplashScreen() {
  const router = useRouter()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => {
        router.replace('/day')
      }, 500)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <Animated.View
      entering={FadeIn.duration(600)}
      exiting={FadeOut.duration(500)}
      style={styles.container}
    >
      <HueLogo />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
})