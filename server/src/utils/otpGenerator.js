export function generateOtp(length = 6) {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < length; i += 1) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}
