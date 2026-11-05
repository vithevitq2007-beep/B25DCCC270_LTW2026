export const POINTS = { 1: 100, 2: 200, 3: 300 };

export const LEVELS = { 1: 'Dễ', 2: 'Trung bình', 3: 'Khó' };

export const LETTERS = ['A', 'B', 'C', 'D'];

export const TOTAL_TIME = 90; // số giây cho cả lượt chơi

export const MAX_LIVES = 3;

// Từ câu đúng thứ 3 liên tiếp trở đi, mỗi câu đúng được thưởng thêm
export const STREAK_BONUS = 50;

export const formatScore = (n) => `${n.toLocaleString('vi-VN')} điểm`;
