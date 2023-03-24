export default function validateUrl(url: string) {
  const regex = /^https:\/\/.*$/;
  return regex.test(url);
}
