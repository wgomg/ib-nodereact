const timeSince = date => {
  if (!date) return 'nunca';

  date = new Date(date);
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return 'hace ' + interval + ' años';

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return 'hace ' + interval + ' meses';

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return 'hace ' + interval + ' días';

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return 'hace ' + interval + ' hrs';

  interval = Math.floor(seconds / 60);
  if (interval > 1) return 'hace ' + interval + ' min';

  return Math.floor(seconds) + ' seg';
};

export default timeSince;
