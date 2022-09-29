const minute = 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const month = day * 30;
const year = day * 365;

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Returns date string with format Jun 28 2022
// https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off
export function dateString(date: string, showComma?: boolean): string {
  if (!date) {
    return "-";
  }
  const dateObj = new Date(date.replace(/-/g, "/"));
  return showComma // Returns date string with format Jun 28, 2022
    ? `${
        months[dateObj.getMonth()]
      } ${dateObj.getDate()}, ${dateObj.getFullYear()}`
    : dateObj.toDateString().split(" ").slice(1).join(" ");
}

// Convert a date to a relative time string, such as
// "a minute ago", "in 2 hours", "yesterday", "3 months ago", etc.
// Credit: https://gist.github.com/steve8708/ada9bff2600228789fce2fcc95427e39
export function getRelativeTimeString(
  date: Date | number,
  lang = navigator.language
): string {
  const time = date instanceof Date ? date.getTime() : date;
  const delta = Math.round((time - Date.now()) / 1000);
  const absoluteDelta = Math.abs(delta);
  const times: [number, Intl.RelativeTimeFormatUnit, number][] = [
    [minute, "second", 1],
    [hour, "minute", minute],
    [day, "hour", hour],
    [week, "day", day],
    [month, "week", week],
    [year, "month", month],
    [Infinity, "year", year],
  ];
  let divider = year;
  let timeType: Intl.RelativeTimeFormatUnit = "year";
  for (const [num, timeInterval, div] of times) {
    if (absoluteDelta < num) {
      divider = div;
      timeType = timeInterval;
      break;
    }
  }
  const rtf = new Intl.RelativeTimeFormat(lang, {
    numeric: "auto",
  });

  return rtf.format(Math.floor(delta / divider), timeType);
}

// Get the year from a date string
export function getYear(date: string) {
  return new Date(date).getFullYear();
}

// https://bobbyhadz.com/blog/javascript-check-if-date-is-in-the-future
export function isInTheFuture(date: string) {
  const compareDate = new Date(date);
  const today = new Date();

  // 👇️ OPTIONAL!
  // This line sets the time of the current date to the
  // last millisecond, so the comparison returns `true` only if
  // date is at least tomorrow
  today.setHours(23, 59, 59, 998);

  return compareDate > today;
}
