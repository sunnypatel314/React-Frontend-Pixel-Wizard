// 2024-05-26T21:39:58.079Z
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function dateConversion(dateString) {
  const year = dateString.slice(0, 4);
  const month = months[parseInt(dateString.slice(5, 7), 10) - 1];
  const day = dateString.slice(8, 10);
  // let hour = dateString.slice(11, 13);
  // const minute = dateString.slice(14, 16);
  // let am_or_pm = "AM";

  // if (parseInt(hour, 10) > 12) {
  //   hour = (parseInt(hour, 10) - 12).toString();
  //   am_or_pm = "PM";
  // } else if (parseInt(hour, 10) === 0) {
  //   hour = "12";
  // }
  return `${month} ${day}, ${year}`;
}
