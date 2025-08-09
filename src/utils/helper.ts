function getCurrentTime() {
  const now = new Date();

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}
function calculateRemainingLeaveDays(joined_date: Date): number {
  const joinMonth = joined_date.getMonth() + 1; // Months are 0-indexed in JS
  const monthsLeft = 12 - joinMonth + 1;
  const leaveDaysPerMonth = 2;

  return monthsLeft * leaveDaysPerMonth;
}

export { getCurrentTime, calculateRemainingLeaveDays };
