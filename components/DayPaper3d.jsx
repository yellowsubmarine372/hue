// DayPaper3D.jsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function DayPaper3D({ rotationShared, frontColor, backColor }) {
  const meshRef = useRef()

  useFrame(() => {
    const rad = (rotationShared.value * Math.PI) / 180
    if (meshRef.current) meshRef.current.rotation.y = rad
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2, 20, 20]} />
      <meshBasicMaterial 
        color={frontColor} 
        side={0}
      />
      {/* 뒷면을 위한 두 번째 mesh */}
      <mesh>
        <planeGeometry args={[2, 2, 20, 20]} />
        <meshBasicMaterial 
          color={backColor} 
          side={1}
        />
      </mesh>
    </mesh>
  )
}