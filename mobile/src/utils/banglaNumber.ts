const bnDigits: Record<string, string> = {
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
};

const wordValues: Record<string, number> = {
  শূন্য: 0,
  এক: 1,
  দুই: 2,
  দু: 2,
  তিন: 3,
  চার: 4,
  পাঁচ: 5,
  ছয়: 6,
  সাত: 7,
  আট: 8,
  নয়: 9,
  দশ: 10,
  এগারো: 11,
  বারো: 12,
  তেরো: 13,
  চৌদ্দ: 14,
  পনেরো: 15,
  ষোল: 16,
  সতেরো: 17,
  আঠারো: 18,
  উনিশ: 19,
  বিশ: 20,
  ত্রিশ: 30,
  চল্লিশ: 40,
  পঞ্চাশ: 50,
  ষাট: 60,
  সত্তর: 70,
  আশি: 80,
  নব্বই: 90,
};

const multipliers: Record<string, number> = {
  শত: 100,
  শ: 100,
  হাজার: 1000,
  লাখ: 100000,
  লক্ষ: 100000,
  কোটি: 10000000,
};

export function normalizeBanglaDigits(input: string) {
  return input.replace(/[০-৯]/g, digit => bnDigits[digit] ?? digit);
}

export function extractAmount(input: string): number | null {
  const normalized = normalizeBanglaDigits(input.replace(/,/g, ''));
  const numericMatch = normalized.match(/\d+(\.\d+)?/);

  if (numericMatch) {
    const base = Number(numericMatch[0]);
    const after = normalized.slice(numericMatch.index ?? 0);
    const multiplier = Object.entries(multipliers).find(([word]) => after.includes(word));
    return multiplier ? base * multiplier[1] : base;
  }

  const words = normalized.split(/\s+/);
  let total = 0;
  let current = 0;

  for (const word of words) {
    if (wordValues[word] !== undefined) {
      current += wordValues[word];
      continue;
    }

    if (multipliers[word]) {
      current = Math.max(current, 1) * multipliers[word];
      total += current;
      current = 0;
    }
  }

  const amount = total + current;
  return amount > 0 ? amount : null;
}
