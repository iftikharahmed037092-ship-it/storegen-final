export function normalizePhone(
  value: string
) {
  return value
    .trim()
    .replace(/[^\d+]/g, "")
    .replace(/^00/, "+");
}

export function isReasonablePhone(
  value: string
) {
  const phone =
    normalizePhone(value);

  const digits =
    phone.replace(/\D/g, "");

  return (
    digits.length >= 10 &&
    digits.length <= 15
  );
}
