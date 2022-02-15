function datetime() {
  const dateObj = new Date();
  const hhr = dateObj.getHours() || 12;
  const parts = {
    date: dateObj.getDate().toString().padStart(2, "0"),
    mont: dateObj.getMonth().toString().padStart(2, "0"),
    year: dateObj.getFullYear() + 543,
    hour: hhr.toString().padStart(2, "0"),
    minute: dateObj.getMinutes().toString().padStart(2, "0"),
    amOrPm: dateObj.getHours() < 12 ? "AM" : "PM",
  };
  if (parts.mont === "00") parts.mont = "01";
  return `${parts.date}-${parts.mont}-${parts.year} ${parts.hour}:${parts.minute} ${parts.amOrPm}`;
}

export default datetime;
