import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function StickyNote({ 
  position, 
  color, 
  day, 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1] 
}) {
  const meshRef = useRef();
  const shadowRef = useRef();
  
  // 포스트잇 기본 크기 (화면 크기에 맞춤)
  const noteWidth = 0.6;
  const noteHeight = 0.6;
  const noteDepth = 0.03;
  
  // 그림자 오프셋
  const shadowOffset = useMemo(() => [
    position[0] + 0.05,
    position[1] - 0.05,
    position[2] - 0.01
  ], [position]);
  
  // 포스트잇 모서리 곡선을 위한 rounded rectangle shape
  const roundedRectShape = useMemo(() => {
    const shape = new THREE.Shape();
    const width = noteWidth;
    const height = noteHeight;
    const radius = 0.05;
    
    shape.moveTo(-width/2 + radius, -height/2);
    shape.lineTo(width/2 - radius, -height/2);
    shape.quadraticCurveTo(width/2, -height/2, width/2, -height/2 + radius);
    shape.lineTo(width/2, height/2 - radius);
    shape.quadraticCurveTo(width/2, height/2, width/2 - radius, height/2);
    shape.lineTo(-width/2 + radius, height/2);
    shape.quadraticCurveTo(-width/2, height/2, -width/2, height/2 - radius);
    shape.lineTo(-width/2, -height/2 + radius);
    shape.quadraticCurveTo(-width/2, -height/2, -width/2 + radius, -height/2);
    
    return shape;
  }, [noteWidth, noteHeight]);
  
  // 포스트잇 재질
  const noteMaterial = useMemo(() => {
    return new THREE.MeshLambertMaterial({ 
      color: color,
      transparent: true,
      opacity: 0.9
    });
  }, [color]);
  
  // 그림자 재질
  const shadowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({ 
      color: '#000000',
      transparent: true,
      opacity: 0.2
    });
  }, []);
  
  // 미세한 흔들림 애니메이션 (idle state)
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const frequency = 0.5 + Math.sin(position[0] + position[1]) * 0.2;
      
      // 자연스러운 흔들림
      meshRef.current.rotation.z = rotation[2] + Math.sin(time * frequency) * 0.01;
      meshRef.current.rotation.x = rotation[0] + Math.cos(time * frequency * 0.7) * 0.005;
    }
  });
  
  return (
    <group>
      {/* 그림자 */}
      <mesh
        ref={shadowRef}
        position={shadowOffset}
        rotation={rotation}
        scale={scale}
      >
        <extrudeGeometry args={[roundedRectShape, { depth: noteDepth * 0.1, bevelEnabled: false }]} />
        <primitive object={shadowMaterial} />
      </mesh>
      
      {/* 포스트잇 본체 */}
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        scale={scale}
      >
        <extrudeGeometry args={[roundedRectShape, { depth: noteDepth, bevelEnabled: true, bevelSize: 0.005, bevelThickness: 0.001 }]} />
        <primitive object={noteMaterial} />
      </mesh>
      
      {/* 포스트잇 상단 접착 부분 (더 어두운 색) */}
      <mesh
        position={[position[0], position[1] + noteHeight/2 - 0.05, position[2] + noteDepth/2]}
        rotation={rotation}
        scale={scale}
      >
        <boxGeometry args={[noteWidth, 0.1, noteDepth * 0.5]} />
        <meshLambertMaterial color={getDarkerColor(color)} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

// 더 어두운 색상 생성 (접착 부분용)
function getDarkerColor(color) {
  const tempColor = new THREE.Color(color);
  tempColor.multiplyScalar(0.7);
  return tempColor;
}