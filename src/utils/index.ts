export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const formatDateWithTime = (dateString: Date): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};