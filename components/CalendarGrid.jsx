import React from 'react';
import * as THREE from 'three';

export default function CalendarGrid({ calendarData, selectedMonth }) {
  const { year, month, daysInMonth, firstDayOfWeek, weeksCount } = calendarData;
  
  // 화면에 맞춘 그리드 설정 (적절한 크기로 조정)
  const gridWidth = 2;
  const gridHeight = 1.5;
  const cellWidth = gridWidth / 7;
  const cellHeight = gridHeight / 6;
  
  // 실제 날짜 셀만 생성 (빈 칸은 제외)
  const dateCells = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dayOfWeek = (firstDayOfWeek + day - 1) % 7;
    const weekNumber = Math.floor((firstDayOfWeek + day - 1) / 7);
    
    const x = (dayOfWeek - 3) * cellWidth;
    const y = (2 - weekNumber) * cellHeight;
    
    dateCells.push({
      id: `date-${day}`,
      day: day,
      position: [x, y, 0],
      isToday: isToday(year, month, day)
    });
  }
  
  return (
    <group>
      {/* 오늘 날짜 표시만 */}
      {dateCells.map((cell) => (
        <group key={cell.id}>
          {/* 오늘 날짜 원형 표시 */}
          {cell.isToday && (
            <mesh position={[cell.position[0], cell.position[1], 0.01]}>
              <circleGeometry args={[cellWidth * 0.3, 32]} />
              <meshBasicMaterial color="#2196f3" transparent opacity={0.3} />
            </mesh>
          )}
        </group>
      ))}
      
      {/* 그리드 라인 (실제 날짜 셀만) */}
      <GridLines 
        dateCells={dateCells} 
        cellWidth={cellWidth} 
        cellHeight={cellHeight}
      />
    </group>
  );
}

// 실제 날짜 셀만 둘러싸는 얇은 회색 격자선
function GridLines({ dateCells, cellWidth, cellHeight }) {
  const lines = [];
  
  // 각 날짜 셀 테두리 (얇은 회색 선)
  dateCells.forEach((cell, index) => {
    const { position } = cell;
    const halfWidth = cellWidth * 0.5;
    const halfHeight = cellHeight * 0.5;
    
    // 셀 테두리 (사각형)
    const borderPoints = [
      new THREE.Vector3(position[0] - halfWidth, position[1] - halfHeight, 0),
      new THREE.Vector3(position[0] + halfWidth, position[1] - halfHeight, 0),
      new THREE.Vector3(position[0] + halfWidth, position[1] + halfHeight, 0),
      new THREE.Vector3(position[0] - halfWidth, position[1] + halfHeight, 0),
      new THREE.Vector3(position[0] - halfWidth, position[1] - halfHeight, 0)
    ];
    
    const geometry = new THREE.BufferGeometry().setFromPoints(borderPoints);
    
    lines.push(
      <line key={`border-${index}`} geometry={geometry}>
        <lineBasicMaterial color="#d0d0d0" />
      </line>
    );
  });
  
  return <group>{lines}</group>;
}

// 오늘 날짜 확인 함수
function isToday(year, month, day) {
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() + 1 === month &&
    today.getDate() === day
  );
}