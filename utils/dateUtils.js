// 현재 날짜 정보 반환
export function getCurrentDate() {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1, // 0-based를 1-based로 변환
      day: now.getDate(),
      dayOfWeek: now.getDay()
    };
  }
  
  // 특정 월의 달력 데이터 생성
  export function getCalendarData(year, month) {
    // 해당 월의 첫 번째 날
    const firstDay = new Date(year, month - 1, 1);
    // 해당 월의 마지막 날
    const lastDay = new Date(year, month, 0);
    
    // 해당 월의 총 일수
    const daysInMonth = lastDay.getDate();
    
    // 첫 번째 날의 요일 (0: 일요일, 1: 월요일, ...)
    const firstDayOfWeek = firstDay.getDay();
    
    // 달력 표시를 위한 주 수 계산
    const totalCells = daysInMonth + firstDayOfWeek;
    const weeksCount = Math.ceil(totalCells / 7);
    
    return {
      year,
      month,
      daysInMonth,
      firstDayOfWeek,
      weeksCount,
      monthName: getMonthName(month),
      yearMonth: `${year}년 ${month}월`
    };
  }
  
  // 월 이름 반환
  export function getMonthName(month) {
    const monthNames = [
      '', '1월', '2월', '3월', '4월', '5월', '6월',
      '7월', '8월', '9월', '10월', '11월', '12월'
    ];
    return monthNames[month];
  }
  
  // 요일 이름 반환
  export function getDayName(dayOfWeek) {
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    return dayNames[dayOfWeek];
  }
  
  // 특정 날짜가 오늘인지 확인
  export function isToday(year, month, day) {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() + 1 === month &&
      today.getDate() === day
    );
  }
  
  // 특정 날짜가 현재 날짜 이전인지 확인
  export function isBeforeToday(year, month, day) {
    const today = new Date();
    const targetDate = new Date(year, month - 1, day);
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    return targetDate < todayDate;
  }
  
  // 특정 날짜가 현재 날짜 이후인지 확인
  export function isAfterToday(year, month, day) {
    const today = new Date();
    const targetDate = new Date(year, month - 1, day);
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    return targetDate > todayDate;
  }
  
  // 이전 월로 이동
  export function getPreviousMonth(year, month) {
    if (month === 1) {
      return { year: year - 1, month: 12 };
    }
    return { year, month: month - 1 };
  }
  
  // 다음 월로 이동
  export function getNextMonth(year, month) {
    if (month === 12) {
      return { year: year + 1, month: 1 };
    }
    return { year, month: month + 1 };
  }