import { format, parseISO } from 'date-fns';
import { HOURS_PER_DAY, MILLISECONDS, MINUTES_PER_HOUR } from '../constants/timer';

export const getTimeFormatter = (date) => {
  return parseISO(date).getTime() ? format(parseISO(date), 'HH:mm:ss') : '...';
};

export const getDateTimeFormatter = (date) => {
  return parseISO(date).getTime() ? format(parseISO(date), 'dd/MM/yyyy HH:mm:ss') : '-';
};

export const getDateFormatter = (dateStr) => {
  return parseISO(dateStr).getTime() ? format(parseISO(dateStr), 'dd/MM/yyyy') : '-';
};

export function convertTime(duration) {
  let seconds = Math.floor((duration / MILLISECONDS) % MINUTES_PER_HOUR);
  let minutes = Math.floor((duration / (MILLISECONDS * MINUTES_PER_HOUR)) % MINUTES_PER_HOUR);
  let hours = Math.floor(
    (duration / (MILLISECONDS * MINUTES_PER_HOUR * MINUTES_PER_HOUR)) % HOURS_PER_DAY,
  );

  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${hours}:${minutes}:${seconds}`;
}

export function formatTime(valueSeconds, extense) {
  const minutes = Math.floor(valueSeconds / MINUTES_PER_HOUR);
  const seconds = valueSeconds % MINUTES_PER_HOUR;

  const minutesStr = minutes < 10 ? `0${minutes}` : minutes.toString();
  const secondsStr = seconds < 10 ? `0${seconds}` : seconds.toString();

  if (extense) {
    return `${minutesStr} minutos e ${secondsStr} segundos`;
  }

  return `${minutesStr}m ${secondsStr}s`;
}
