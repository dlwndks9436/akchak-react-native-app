export const formatDuration = (duration: number) => {
  const hours = Math.floor(duration! / 60 / 60);
  const minutes = Math.floor(duration! / 60) - hours * 60;
  const seconds = duration! % 60;

  const formattedHMS =
    hours === 0
      ? minutes.toString().padStart(2, '0') +
        ':' +
        seconds.toString().padStart(2, '0')
      : hours +
        ':' +
        minutes.toString().padStart(2, '0') +
        ':' +
        seconds.toString().padStart(2, '0');

  return formattedHMS;
};
