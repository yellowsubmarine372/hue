import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function DayPaper3D({ rotationShared }) {
  const meshRef = useRef()

  useFrame(() => {
    const rad = (rotationShared.value * Math.PI) / 180
    if (meshRef.current) meshRef.current.rotation.y = rad
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2,2,20,20]} />
      <meshBasicMaterial color="#A5D8FF" side={2} />
    </mesh>
  )
}