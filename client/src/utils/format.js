export const dateFullFormat = (dateStr) => {
  const date = new Date(dateStr);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;
};

export const dateShortFormat = (dateStr) => {
  const date = new Date(dateStr);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const deSerialDate = (serialDate) => {
  const startDate = new Date('1900-01-01T00:00:00Z');
  return new Date(startDate.getTime() + (serialDate - 2) * 24 * 60 * 60 * 1000);
};