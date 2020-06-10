export default function phoneToDigits(phone) {
  let digits = phone.match(/\d/g);

  if (!digits) {
    return ''
  }

  if (digits.length === 11 && digits[0] === '1') {
    digits = digits.slice(1);
  }

  if (digits.length !== 10) {
    console.warn('Invalid phone number', phone);
    return phone;
  }

  return `+1${digits.join('')}`;
}