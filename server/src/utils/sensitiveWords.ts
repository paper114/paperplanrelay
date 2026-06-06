const sensitiveWords: string[] = [
  "fuck", "shit", "damn", "asshole", "bitch",
  "傻逼", "操你", "草泥马", "他妈的", "去死",
  "废物", "滚蛋", "白痴", "脑残", "弱智",
  "垃圾人", "恶心", "变态", "下流",
  "色情", "裸体", "做爱", "嫖娼",
  "毒品", "赌博", "诈骗",
  "恐怖", "炸弹", "杀人", "自杀",
  "法轮功", "反动", "颠覆",
];

export function containsSensitiveWord(text: string): boolean {
  const lowerText = text.toLowerCase();
  return sensitiveWords.some((word) => lowerText.includes(word.toLowerCase()));
}

export default sensitiveWords;
