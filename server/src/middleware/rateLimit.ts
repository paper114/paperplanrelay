const minuteMap = new Map<string, number[]>();
const dailyMap = new Map<string, number>();

const MAX_PER_MINUTE = 3;
const MAX_PER_DAY = 50;

function cleanupMinuteMap(userId: string) {
  const now = Date.now();
  const timestamps = minuteMap.get(userId);
  if (timestamps) {
    const filtered = timestamps.filter((t) => now - t < 60 * 1000);
    if (filtered.length === 0) {
      minuteMap.delete(userId);
    } else {
      minuteMap.set(userId, filtered);
    }
  }
}

export function checkRateLimit(userId: string): { allowed: boolean; reason?: string } {
  const now = Date.now();

  cleanupMinuteMap(userId);

  const minuteTimestamps = minuteMap.get(userId) || [];
  if (minuteTimestamps.length >= MAX_PER_MINUTE) {
    return { allowed: false, reason: "每分钟最多投递3次" };
  }

  const dailyCount = dailyMap.get(userId) || 0;
  if (dailyCount >= MAX_PER_DAY) {
    return { allowed: false, reason: "每天最多投递50次" };
  }

  minuteTimestamps.push(now);
  minuteMap.set(userId, minuteTimestamps);
  dailyMap.set(userId, dailyCount + 1);

  return { allowed: true };
}

setInterval(() => {
  const now = Date.now();
  for (const [userId, timestamps] of minuteMap.entries()) {
    const filtered = timestamps.filter((t) => now - t < 60 * 1000);
    if (filtered.length === 0) {
      minuteMap.delete(userId);
    } else {
      minuteMap.set(userId, filtered);
    }
  }
}, 60 * 1000);

setInterval(() => {
  dailyMap.clear();
}, 24 * 60 * 60 * 1000);
