// smsParser.ts
type Parsed = {
  amount: number;
  type: 'debit' | 'credit';
  date: Date;
  bank?: string;
  description?: string;
};

const commonAmountRegex = /(?:Rs\.?|INR|\u20B9)\s?([0-9,]+(?:\.[0-9]{1,2})?)/i;

/**
 * Examples of bank message types:
 * - "AXISBK: A/C XX1234 debited by INR 1,234.00 on 12-05-2025 at ATM. Avl bal INR 5,667.00"
 * - "HDFCBK: Your a/c XX2345 credited by INR 5,000.00 on 2025-05-12. Ref: UPI1234"
 *
 * We'll use multiple regex patterns for some banks.
 */

const bankPatterns: {
  bank: string;
  patterns: RegExp[];
}[] = [
  {
    bank: 'AXISBK',
    patterns: [
      /AXISBK[:\-\s]+.*(?:debited|credit(?:ed)?)\s+by\s+(?:INR|Rs\.?|₹)\s?([0-9,]+(?:\.[0-9]{1,2})?).*on\s*([0-9\-\/ :T]+)?.*/i,
      /A\/c .* debited by (?:INR|Rs\.?|₹)\s?([0-9,]+).*on\s*([0-9\-\/]+)/i,
    ],
  },
  {
    bank: 'HDFCBK',
    patterns: [
      /HDFCBK[:\-\s]+.*(?:debited|credited)\s+by\s+(?:INR|Rs\.?|₹)\s?([0-9,]+).*on\s*([0-9\-\/]+)/i,
      /Your a\/c .* (?:debited|credited) by (?:INR|Rs\.?|₹)\s?([0-9,]+)/i,
    ],
  },
  {
    bank: 'ICICI',
    patterns: [
      /ICICIBANK[:\-\s]+.*(?:debited|credit).*?(?:INR|Rs\.?|₹)\s?([0-9,]+)/i,
    ],
  },
  {
    bank: 'SBI',
    patterns: [
      // Debit or Credit transactions
      /(?:SBI|State Bank of India)[:\-\s]+.*?(?:debited|credited).*?(?:INR|Rs\.?|₹)\s?([0-9,]+)/i,

      // Sometimes SBI messages start with "Acct XX1234 debited by Rs 500.00"
      /(?:Acct|A\/c)\s?[Xx]*\d{2,4}.*?(?:debited|credited).*?(?:INR|Rs\.?|₹)\s?([0-9,]+)/i,

      // UPI transactions from SBI
      /(?:UPI|YONO|SBIUPI).*?(?:debited|credited).*?(?:INR|Rs\.?|₹)\s?([0-9,]+)/i,
    ],
  },
  // Add more bank specific patterns...
];

function parseAmountFromMatch(str?: string) {
  if (!str) return null;
  const cleaned = str.replace(/,/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

export function parseBankSms(body: string, sender?: string): Parsed | null {
  if (!body) return null;
  // quick check if message contains typical finance words
  const financeKeywords = ['debited', 'credited', 'withdrawn', 'avl bal', 'available balance', 'txn', 'transaction', 'purchase', 'credited by', 'debited by', 'spent'];
  const bodyLower = body.toLowerCase();
  if (!financeKeywords.some((k) => bodyLower.includes(k))) return null;

  // 1) Try bank-specific patterns
  for (const bankPat of bankPatterns) {
    for (const pat of bankPat.patterns) {
      const m = pat.exec(body);
      if (m) {
        // attempt to extract amount from capture groups
        let amount = null;
        for (let i = 1; i < m.length; i++) {
          const cand = m[i];
          const a = parseAmountFromMatch(cand);
          if (a !== null) {
            amount = a;
            break;
          }
        }
        // detect type
        const type = /debited|withdrawn|purchase|spent/i.test(body) ? 'debit' : 'credit';
        // naive date extraction: try to find a date pattern (dd-mm-yyyy or yyyy-mm-dd)
        const dateMatch = /(\d{2}[-\/]\d{2}[-\/]\d{2,4}|\d{4}-\d{2}-\d{2})/.exec(body);
        const date = dateMatch ? new Date(dateMatch[0].replace(/-/g, '/')) : new Date();
        if (amount !== null) {
          return {
            amount,
            type,
            date,
            bank: bankPat.bank,
            description: body.slice(0, 140),
          };
        }
      }
    }
  }

  // 2) Generic fallback: find first amount-looking substring + debit/credit keyword
  const am = commonAmountRegex.exec(body);
  if (am) {
    const amount = parseAmountFromMatch(am[1]);
    const type = /debited|withdrawn|purchase|spent/i.test(body) ? 'debit' : /credited|deposit/i.test(body) ? 'credit' : 'debit';
    const dateMatch = /(\d{2}[-\/]\d{2}[-\/]\d{2,4}|\d{4}-\d{2}-\d{2})/.exec(body);
    const date = dateMatch ? new Date(dateMatch[0].replace(/-/g, '/')) : new Date();
    const bankFromSender = sender ? sender.replace(/[^A-Z0-9]/ig, '') : undefined;
    return {
      amount: amount || 0,
      type,
      date,
      bank: bankFromSender,
      description: body.slice(0, 140),
    };
  }

  return null; // not finance related
}
