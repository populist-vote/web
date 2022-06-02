const minute = 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const month = day * 30;
const year = day * 365;

// Returns date string with format Jun 28 2022
// https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off
export function dateString(date: string): string {
  if (!date) {
    return "-";
  }
  const dateObj = new Date(date.replace(/-/g, "/"));
  return dateObj.toDateString().split(" ").slice(1).join(" ");
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
