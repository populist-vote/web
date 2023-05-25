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

export function getMissingDates(isoDates: string[]): string[] {
  // Step 1: Convert ISO date strings to Date objects
  const dates: Date[] = isoDates
    .map((dateString) => new Date(dateString))
    .filter((date) => !isNaN(date.getTime()));

  // Check if the array is empty or contains invalid dates
  if (dates.length === 0) {
    return [];
  }

  // Step 2: Determine the minimum and maximum dates
  const minDate: Date = new Date(
    Math.min(...dates.map((date) => date.getTime()))
  );
  const maxDate: Date = new Date(
    Math.max(...dates.map((date) => date.getTime()))
  );

  // Step 3: Create an array of all dates in the range
  const allDates: Date[] = [];
  for (
    let d: Date = new Date(minDate);
    d <= maxDate;
    d.setDate(d.getDate() + 1)
  ) {
    allDates.push(new Date(d));
  }

  // Step 4: Compare arrays and find missing dates
  const missingDates: string[] = [];
  for (let i = 0; i < allDates.length; i++) {
    const currentDate = allDates[i] as Date;
    if (!dates.some((date) => isSameDate(date, currentDate))) {
      missingDates.push(currentDate.toISOString().split("T")[0] as string);
    }
  }

  return missingDates;
}

// Helper function to compare dates without comparing time
export function isSameDate(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
