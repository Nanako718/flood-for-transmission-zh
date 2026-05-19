const MS = 1;
const MS_PER_SECOND = MS * 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

const MINUTES_PER_HOUR = 60;

export function relativeTime(timestamp) {
  let timeLeft = Date.now() - timestamp;

  const days = Math.floor(timeLeft / MS_PER_DAY);
  const daysText = '天';
  timeLeft %= MS_PER_DAY;

  const hours = Math.floor(timeLeft / MS_PER_HOUR);
  const hoursText = '小时';
  timeLeft %= MS_PER_HOUR;

  if (days && hours) {
    return `${days}${daysText}${hours}${hoursText}前`;
  }
  if (days) {
    return `${days}${daysText}前`;
  }

  const minutes = Math.floor(timeLeft / MS_PER_MINUTE);
  const minutesText = '分钟';
  timeLeft %= MS_PER_MINUTE;

  if (hours && minutes) {
    return `${hours}${hoursText}${minutes}${minutesText}前`;
  }
  if (hours) {
    return `${hours}${hoursText}前`;
  }

  const seconds = Math.floor(timeLeft / MS_PER_SECOND);
  const secondsText = '秒';
  timeLeft %= MS_PER_SECOND;

  if (minutes && seconds) {
    return `${minutes}${minutesText}${seconds}${secondsText}前`;
  }
  if (minutes) {
    return `${minutes}${minutesText}前`;
  }

  if (seconds) {
    return `${seconds}${secondsText}前`;
  }
  return '刚刚';
}

export function minutesToTime(minutes) {
  if (minutes == null || Number.isNaN(Number(minutes))) {
    return '00:00';
  }

  let minutesLeft = Number(minutes);

  let hours = Math.floor(minutesLeft / MINUTES_PER_HOUR);
  minutesLeft %= MINUTES_PER_HOUR;

  if (hours === 0) {
    hours = '00';
  } else if (hours < 10) {
    hours = `0${hours}`;
  }

  if (minutesLeft === 0) {
    minutesLeft = '00';
  } else if (minutesLeft < 10) {
    minutesLeft = `0${minutesLeft}`;
  }

  return `${hours}:${minutesLeft}`;
}

export function timeToMinutes(time) {
  if (!time || typeof time !== 'string') {
    return 0;
  }

  const splitTime = time.split(':');
  const hours = parseInt(splitTime[0], 10);
  const minutes = parseInt(splitTime[1], 10);
  return hours * MINUTES_PER_HOUR + minutes;
}
