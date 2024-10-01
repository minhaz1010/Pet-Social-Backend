export const formattedDate = (days: number) => {
  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + days);

  const formatWithSuffix = (date: Date) => {
    const formattedDate = date.toLocaleString("en-GB", {
      weekday: undefined,
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const day = date.getDate();
    const dayWithSuffix =
      day +
      ["th", "st", "nd", "rd"][
        day % 10 > 3 || ~~(day / 10) === 1 ? 0 : day % 10
      ];

    return formattedDate.replace(day.toString(), dayWithSuffix);
  };

  const currentTimeFormatted = formatWithSuffix(currentDate);
  const activationTimeFormatted = formatWithSuffix(futureDate);

  const dates = {
    currentTime: currentTimeFormatted,
    endTime: activationTimeFormatted,
  };

  return dates;
};
