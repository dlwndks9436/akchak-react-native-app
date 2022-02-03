export const formatDuration = (duration: number) => {
  const hours = Math.floor(duration! / 60 / 60);
  const minutes = Math.floor(duration! / 60) - hours * 60;
  const seconds = duration! % 60;
  let secondsToString: string;
  if (seconds < 10) {
    secondsToString = '0' + seconds;
  } else {
    secondsToString = seconds.toString();
  }

  const formattedHMS =
    hours === 0
      ? minutes.toString().padStart(2, '0') + ':' + secondsToString
      : hours +
        ':' +
        minutes.toString().padStart(2, '0') +
        ':' +
        secondsToString;

  return formattedHMS;
};

export const formatTime = (time: string) => {
  if (time.length === 1) {
    return 0 + time;
  } else {
    return time;
  }
};
