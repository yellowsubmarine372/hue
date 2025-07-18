// (tabs)/week.jsx
import { View, Text, StyleSheet, Dimensions, PanResponder } from 'react-native'
import { useState, useRef } from 'react'

const { width } = Dimensions.get('window')

// 완전히 랜덤한 색깔 생성
const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `rgb(${r}, ${g}, ${b})`
}

// 중복되지 않는 색깔들 생성
const generateUniqueColors = (count) => {
  const colors = []
  const usedColors = new Set()
  
  while (colors.length < count) {
    const color = getRandomColor()
    if (!usedColors.has(color)) {
      colors.push(color)
      usedColors.add(color)
    }
  }
  
  return colors
}

const generateInitialSegments = () => {
  const count = Math.floor(Math.random() * 6) + 2
  const colors = generateUniqueColors(count)
  const segments = []
  
  for (let i = 0; i < count; i++) {
    segments.push({
      id: Date.now() + i,
      width: 100 / count,
      color: colors[i]
    })
  }
  
  return segments
}

export default function WeekScreen() {
  const [segments, setSegments] = useState(generateInitialSegments)
  const [isDragging, setIsDragging] = useState(false)
  const [dragIndex, setDragIndex] = useState(-1)
  const barRef = useRef(null)
  const barLayout = useRef({ x: 0, y: 0, width: 0, height: 0 })
  
  // 더블클릭 감지를 위한 상태
  const [lastTouchTime, setLastTouchTime] = useState(0)
  const [lastTouchIndex, setLastTouchIndex] = useState(-1)
  const DOUBLE_CLICK_DELAY = 300 // 300ms 이내 두 번 터치

  // 전체 색깔 조합 변경
  const changeAllColors = () => {
    const newColors = generateUniqueColors(segments.length)
    setSegments(prev => prev.map((segment, index) => ({
      ...segment,
      color: newColors[index]
    })))
  }

  // 터치 위치가 어느 사각형 내부인지 확인
  const findSegmentIndex = (touchEvent) => {
    // 절대 좌표에서 바의 시작점을 빼서 바 내부의 상대 좌표 계산
    const barStartX = barLayout.current.x
    const absoluteX = touchEvent.pageX || touchEvent.locationX
    const relativeX = absoluteX - barStartX
    
    // 바 영역 밖이면 -1 반환
    if (relativeX < 0 || relativeX > barLayout.current.width) {
      return -1
    }
    
    let currentX = 0
    const barWidth = barLayout.current.width
    
    for (let i = 0; i < segments.length; i++) {
      const segmentWidth = (segments[i].width / 100) * barWidth
      if (relativeX >= currentX && relativeX < currentX + segmentWidth) {
        return i
      }
      currentX += segmentWidth
    }
    return -1
  }

  // 터치 위치가 경계선 근처인지 확인 (경계선에서 ±12px)
  const findBoundaryIndex = (touchEvent) => {
    // 절대 좌표에서 바의 시작점을 빼서 바 내부의 상대 좌표 계산
    const barStartX = barLayout.current.x
    const absoluteX = touchEvent.pageX || touchEvent.locationX
    const relativeX = absoluteX - barStartX
    
    if (relativeX < 0 || relativeX > barLayout.current.width) {
      return -1
    }
    
    let currentX = 0
    const barWidth = barLayout.current.width
    
    for (let i = 0; i < segments.length - 1; i++) {
      currentX += (segments[i].width / 100) * barWidth
      if (Math.abs(relativeX - currentX) <= 12) {
        return i
      }
    }
    return -1
  }

  // 경계 더블클릭으로 사각형 합치기
  const mergeSegments = (boundaryIndex) => {
    // 최소 2개 사각형이 있을 때만 합치기 가능
    if (segments.length <= 1) return
    
    setSegments(prev => {
      const newSegments = [...prev]
      const leftIndex = boundaryIndex
      const rightIndex = boundaryIndex + 1
      
      // 기존 색깔들과 중복되지 않는 새로운 색깔 생성
      const existingColors = new Set(newSegments.map(s => s.color))
      let newColor
      do {
        newColor = getRandomColor()
      } while (existingColors.has(newColor))
      
      // 두 사각형의 너비를 합치고 새로운 색깔 적용
      const mergedWidth = newSegments[leftIndex].width + newSegments[rightIndex].width
      newSegments[leftIndex] = {
        ...newSegments[leftIndex],
        width: mergedWidth,
        color: newColor
      }
      
      // 오른쪽 사각형 제거
      newSegments.splice(rightIndex, 1)
      
      return newSegments
    })
  }

  // 경계 터치 처리 (더블클릭 감지)
  const handleBoundaryTouch = (touchEvent) => {
    const boundaryIndex = findBoundaryIndex(touchEvent)
    if (boundaryIndex === -1) return
    
    const currentTime = Date.now()
    const timeDiff = currentTime - lastTouchTime
    
    // 더블클릭 감지: 같은 경계를 300ms 이내에 두 번 터치
    if (timeDiff < DOUBLE_CLICK_DELAY && boundaryIndex === lastTouchIndex) {
      mergeSegments(boundaryIndex)
      // 더블클릭 후 상태 초기화
      setLastTouchTime(0)
      setLastTouchIndex(-1)
    } else {
      // 첫 번째 터치 또는 다른 경계 터치
      setLastTouchTime(currentTime)
      setLastTouchIndex(boundaryIndex)
    }
  }

  const splitSegment = (index, touchEvent) => {
    if (segments.length >= 7) return
    
    setSegments(prev => {
      const newSegments = [...prev]
      const targetSegment = newSegments[index]
      const barWidth = barLayout.current.width
      
      const barStartX = barLayout.current.x
      const absoluteX = touchEvent.pageX || touchEvent.locationX
      const relativeX = absoluteX - barStartX
      
      let segmentStartX = 0
      for (let i = 0; i < index; i++) {
        segmentStartX += (newSegments[i].width / 100) * barWidth
      }
      
      const segmentWidth = (targetSegment.width / 100) * barWidth
      const relativeXInSegment = relativeX - segmentStartX
      const splitRatio = Math.max(0.2, Math.min(0.8, relativeXInSegment / segmentWidth))

      const existingColors = new Set(newSegments.map(s => s.color))
      let newColor
      do {
        newColor = getRandomColor()
      } while (existingColors.has(newColor))
      
      const leftWidth = targetSegment.width * splitRatio
      const rightWidth = targetSegment.width * (1 - splitRatio)
      
      newSegments[index] = {
        ...targetSegment,
        width: leftWidth
      }
      
      newSegments.splice(index + 1, 0, {
        id: Date.now(),
        width: rightWidth,
        color: newColor
      })
      
      return newSegments
    })
  }

  const handleBoundaryDrag = (gestureState) => {
    if (dragIndex === -1) return
    
    const barWidth = barLayout.current.width
    const deltaX = gestureState.dx
    const deltaPercent = (deltaX / barWidth) * 100
    
    setSegments(prev => {
      const newSegments = [...prev]
      const leftIndex = dragIndex
      const rightIndex = dragIndex + 1
      
      // 최소 크기 제한 (5%)
      const minWidth = 5
      const leftSegment = newSegments[leftIndex]
      const rightSegment = newSegments[rightIndex]
      
      const totalWidth = leftSegment.width + rightSegment.width
      const newLeftWidth = Math.max(minWidth, Math.min(totalWidth - minWidth, leftSegment.width + deltaPercent))
      const newRightWidth = totalWidth - newLeftWidth
      
      if (newLeftWidth >= minWidth && newRightWidth >= minWidth) {
        newSegments[leftIndex].width = newLeftWidth
        newSegments[rightIndex].width = newRightWidth
      }
      
      return newSegments
    })
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => {
      const boundaryIndex = findBoundaryIndex(evt.nativeEvent)
      return boundaryIndex !== -1
    },
    
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      const boundaryIndex = findBoundaryIndex(evt.nativeEvent)
      return boundaryIndex !== -1 && Math.abs(gestureState.dx) > 8
    },
    
    onPanResponderGrant: (evt, gestureState) => {
      const boundaryIndex = findBoundaryIndex(evt.nativeEvent)
      if (boundaryIndex !== -1) {
        setDragIndex(boundaryIndex)
        // 처음에는 드래그 상태가 아님
        setIsDragging(false)
        
        // 경계 터치 처리 (더블클릭 감지)
        handleBoundaryTouch(evt.nativeEvent)
      }
    },
    
    onPanResponderMove: (evt, gestureState) => {
      if (dragIndex !== -1 && Math.abs(gestureState.dx) > 8) {
        // 실제로 드래그가 시작되면 드래그 상태로 변경
        if (!isDragging) {
          setIsDragging(true)
        }
        handleBoundaryDrag(gestureState)
      }
    },
    
    onPanResponderRelease: (evt, gestureState) => {
      setIsDragging(false)
      setDragIndex(-1)
    }
  })

  return (
    <View style={styles.container} onTouchEnd={changeAllColors}>
      {/* 실제 바 */}
      <View 
        ref={barRef}
        style={styles.bar}
        onLayout={(event) => {
          const { x, y, width, height } = event.nativeEvent.layout
          barLayout.current = { x, y, width, height }
        }}
        {...panResponder.panHandlers}
      >
        {segments.map((segment, index) => (
          <View
            key={segment.id}
            style={[
              styles.segment,
              {
                width: `${segment.width}%`,
                backgroundColor: segment.color
              }
            ]}
            onTouchEnd={(e) => {
              e.stopPropagation()
              if (!isDragging) {
                const segmentIndex = findSegmentIndex(e.nativeEvent)
                if (segmentIndex !== -1) {
                  splitSegment(segmentIndex, e.nativeEvent)
                }
              }
            }}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  bar: {
    width: '90%',
    height: 60,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  segment: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
})