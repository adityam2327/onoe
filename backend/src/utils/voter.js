export const generateVoterId = (state) => {
  const prefix = state.slice(0, 3).toUpperCase(); // e.g. UP
  const random = Math.floor(100000000 + Math.random() * 900000000);
  return `${prefix}${random}`;
};

export const isUserFullyVerified = (verificationArray) => {
  if (!verificationArray || verificationArray.length === 0) return false;

  const requiredLevels = ["BLO", "ERO", "DEO"];

  return requiredLevels.every(level =>
    verificationArray.some(v => v.level === level && v.status === "verified")
  );
};