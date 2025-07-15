import React from 'react';
import StickyNote from './StickyNote';

export default function StickyNotesContainer({ notesData, calendarData }) {
  return (
    <group>
      {notesData.map((note) => (
        <StickyNote
          key={note.id}
          position={note.position}
          color={note.color}
          day={note.day}
          rotation={getRandomRotation()}
          scale={getRandomScale()}
        />
      ))}
    </group>
  );
}

// 자연스러운 회전값 생성
function getRandomRotation() {
  return [
    (Math.random() - 0.5) * 0.15, // x축 살짝 회전
    (Math.random() - 0.5) * 0.15, // y축 살짝 회전
    (Math.random() - 0.5) * 0.4   // z축 회전 (포스트잇 기울기)
  ];
}

// 자연스러운 크기 변화 (화면 크기에 맞춤)
function getRandomScale() {
  const baseScale = 0.8 + Math.random() * 0.3; // 0.8 ~ 1.1
  return [baseScale, baseScale, 1];
}