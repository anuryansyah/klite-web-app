import { format, formatDistance, parseJSON } from 'date-fns';
import { id } from 'date-fns/locale';

interface Props {
  dateTime?: string;
  date?: string;
  time?: string;
  formatStr?: string;
}
export const timeFormat = ({
  date,
  time,
  dateTime,
  formatStr = 'd MMM yyyy, HH:mm',
}: Props) => {

  let dateToConvert = `${date} ${time}`;

  if (dateTime) {
    dateToConvert = dateTime;
  }

  try {
    return format(parseJSON(dateToConvert), formatStr, {
      locale: id,
    });
  } catch (error) {
    return '-';
  }
};

export const timestampNow = (formatStr?: string) => {
  const formatTime = 'yyyyMMddHHmmss';
  if (!formatStr) formatStr = formatTime;
  return format(new Date(), formatStr, { locale: id });
}

export const timeDistance = (date: string | Date, baseDate?: Date) => {
  const now = new Date();
  if (!baseDate) baseDate = now;
  return formatDistance(new Date(date), baseDate, { locale: id, addSuffix: true });
}

export const timeFromUntilFormat = (dateTime1: string, dateTime2: string, formatStr: string) => {
  const date1 = timeFormat({ dateTime: dateTime1, formatStr });
  const date2 = timeFormat({ dateTime: dateTime2, formatStr });
  return `${date1} s.d. ${date2}`
}