export const generateAppointmentId = () => {
  const currentYear = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `HMC-${currentYear}-${randomSuffix}`;
};
