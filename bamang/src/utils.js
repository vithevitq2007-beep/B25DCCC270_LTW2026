import { POINTS, STREAK_BONUS } from './data';

export const calcScore = (results, questions) => {
  if (!results || !Array.isArray(results)) return 0;
  return results.reduce(
    (acc, res, index) => {
      if (res === 'correct') {
        const streak = acc.streak + 1;
        const level = questions[index]?.level || 1;
        const basePoint = POINTS[level] || 0;
        const bonus = streak >= 3 ? STREAK_BONUS : 0;
        return {
          score: acc.score + basePoint + bonus,
          streak: streak,
        };
      } else if (res === 'wrong') {
        return {
          score: acc.score,
          streak: 0,
        };
      } else {
        // e.g. 'skipped'
        return {
          score: acc.score,
          streak: acc.streak,
        };
      }
    },
    { score: 0, streak: 0 }
  ).score;
};

export const calcStreak = (results) => {
  if (!results || !Array.isArray(results)) return 0;
  return results.reduce((acc, res) => {
    if (res === 'correct') return acc + 1;
    if (res === 'wrong') return 0;
    return acc;
  }, 0);
};
