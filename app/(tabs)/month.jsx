import React, { useState, useEffect, useMemo } from 'react';
import { View, Dimensions, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import CalendarGrid from '../../components/CalendarGrid';
import StickyNotesContainer from '../../components/StickyNotesContainer';
import { getCalendarData, getCurrentDate } from '../../utils/dateUtils';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function MonthScreen() {
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  const [selectedMonth, setSelectedMonth] = useState({
    year: currentDate.year,
    month: currentDate.month
  });
  const [colorPalette, setColorPalette] = useState(0); // 색상 팔레트 인덱스

  // 달력 데이터 생성
  const calendarData = useMemo(() => {
    return getCalendarData(selectedMonth.year, selectedMonth.month);
  }, [selectedMonth]);

  // 현재 날짜까지의 포스트잇 데이터 생성
  const stickyNotesData = useMemo(() => {
    const notes = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    // 현재 월이 아니면 모든 날짜, 현재 월이면 오늘까지만
    const maxDay = (selectedMonth.year === currentYear && selectedMonth.month === currentMonth) 
      ? currentDay 
      : calendarData.daysInMonth;

    for (let day = 1; day <= maxDay; day++) {
      const position = getPositionForDate(day, calendarData);
      if (position) {
        notes.push({
          id: `note-${day}`,
          day,
          position,
          color: getStickyColorFromPalette(day - 1, colorPalette)
        });
      }
    }
    return notes;
  }, [calendarData, selectedMonth, colorPalette]);

  // 화면 터치 핸들러
  const handleScreenTouch = () => {
    setColorPalette(prev => (prev + 1) % getColorPalettesCount());
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenTouch}>
      <View style={styles.container}>
        <Canvas 
          style={styles.canvas}
          camera={{ position: [0, 0, 3], fov: 75 }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={0.6} />
          
          {/* 달력 그리드 */}
          <CalendarGrid 
            calendarData={calendarData} 
            selectedMonth={selectedMonth}
          />
          
          {/* 포스트잇 컨테이너 - 임시 비활성화 */}
          {/* <StickyNotesContainer 
            notesData={stickyNotesData}
            calendarData={calendarData}
          /> */}
        </Canvas>
      </View>
    </TouchableWithoutFeedback>
  );
}

// 날짜에 따른 3D 공간 위치 계산 (화면 크기에 맞춤)
function getPositionForDate(day, calendarData) {
  const { firstDayOfWeek, daysInMonth } = calendarData;
  
  if (day < 1 || day > daysInMonth) return null;
  
  // 실제 달력 구조에 맞춘 위치 계산
  const dayOfWeek = (firstDayOfWeek + day - 1) % 7;
  const weekNumber = Math.floor((firstDayOfWeek + day - 1) / 7);
  
  // 화면 크기에 맞춘 3D 공간 위치 (적절한 크기로 조정)
  const gridWidth = 2;
  const gridHeight = 1.5;
  const cellWidth = gridWidth / 7;
  const cellHeight = gridHeight / 6;
  
  const x = (dayOfWeek - 3) * cellWidth;
  const y = (2 - weekNumber) * cellHeight;
  const z = 0.1;
  
  return [x, y, z];
}

// 색상 팔레트 시스템
const COLOR_PALETTES = [
  // 팔레트 1: 따뜻한 색상
  ['#FFE066', '#FF6B6B', '#FF8E53', '#FFA07A', '#FFD700', '#FF69B4', '#FF4500', '#FFB347'],
  // 팔레트 2: 차가운 색상
  ['#4ECDC4', '#45B7D1', '#6A5ACD', '#87CEEB', '#20B2AA', '#00CED1', '#4169E1', '#8A2BE2'],
  // 팔레트 3: 자연 색상
  ['#96CEB4', '#90EE90', '#98FB98', '#ADFF2F', '#7FFF00', '#32CD32', '#00FF7F', '#00FA9A'],
  // 팔레트 4: 파스텔 색상
  ['#FFEAA7', '#DDA0DD', '#F0E68C', '#E6E6FA', '#FFB6C1', '#FFC0CB', '#FFCCCB', '#F5DEB3'],
  // 팔레트 5: 비비드 색상
  ['#FF1493', '#FF4500', '#FF6347', '#FF8C00', '#FFA500', '#FFD700', '#FFFF00', '#ADFF2F']
];

function getStickyColorFromPalette(index, paletteIndex) {
  const palette = COLOR_PALETTES[paletteIndex % COLOR_PALETTES.length];
  return palette[index % palette.length];
}

function getColorPalettesCount() {
  return COLOR_PALETTES.length;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // 배경색 흰색으로 변경
  },
  canvas: {
    flex: 1,
  },
});