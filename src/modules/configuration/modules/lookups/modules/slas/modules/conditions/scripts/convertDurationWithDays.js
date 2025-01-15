const convertDurationWithDays = (duration) => {
  if (!duration) return '00:00:00';

  let days = `${Math.floor(duration / 1440)}`;
  let hours = `${Math.floor((duration % 1440) / 60)}`;
  let minutes = `${Math.floor(duration % 60)}`;

  if (days.length === 1) days = `0${days}`;
  if (hours.length === 1) hours = `0${hours}`;
  if (minutes.length === 1) minutes = `0${minutes}`;

  return `${days}:${hours}:${minutes}`;
};

export default convertDurationWithDays;
