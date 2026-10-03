export const normalizeIndianPhone = (
  phone: string
): string => {
  const cleaned = phone.trim();

  if (/^\+91[6-9]\d{9}$/.test(cleaned)) {
    return cleaned;
  }

  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return `+91${cleaned}`;
  }

  if (/^91[6-9]\d{9}$/.test(cleaned)) {
    return `+${cleaned}`;
  }

  throw new Error(
    "Invalid Indian phone number"
  );
};