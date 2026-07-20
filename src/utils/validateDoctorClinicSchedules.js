const toMinutes = (time) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

const validateDoctorClinicSchedules = (clinics) => {
  for (let i = 0; i < clinics.length; i++) {
    const first = clinics[i];

    for (let j = i + 1; j < clinics.length; j++) {
      const second = clinics[j];

      const commonDays = first.availability.workingDays.filter((day) =>
        second.availability.workingDays.includes(day)
      );

      if (commonDays.length === 0) {
        continue;
      }

      const firstStart = toMinutes(first.availability.startTime);
      const firstEnd = toMinutes(first.availability.endTime);

      const secondStart = toMinutes(second.availability.startTime);
      const secondEnd = toMinutes(second.availability.endTime);

      const overlaps =
        firstStart < secondEnd &&
        secondStart < firstEnd;

      if (overlaps) {
        return {
          valid: false,
          message: `Schedule overlaps for ${commonDays.join(
            ", "
          )} between two clinics.`,
        };
      }
    }
  }

  return {
    valid: true,
  };
};

module.exports = validateDoctorClinicSchedules;