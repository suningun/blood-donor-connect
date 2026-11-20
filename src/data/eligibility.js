export const DONOR_AGE_MIN = 18;
export const DONOR_AGE_MAX = 65;
export const DONOR_MIN_WEIGHT_KG = 50;

export const ELIGIBILITY = [
  `Generally aged ${DONOR_AGE_MIN}–${DONOR_AGE_MAX} (rules vary by blood service)`,
  `Weigh at least ${DONOR_MIN_WEIGHT_KG} kg`,
  "In good general health on the day of donation",
  "Not pregnant or recently ill",
  "Wait about 3 months between whole-blood donations",
];

export const assessEligibility = ({ age, weight }) => {
  const errors = [];
  const ageValue = Number(age);
  const weightValue = Number(weight);

  if (!Number.isFinite(ageValue) || ageValue <= 0) {
    errors.push("Age must be a positive number.");
  } else if (!Number.isInteger(ageValue)) {
    errors.push("Age must be a whole number.");
  } else if (ageValue < DONOR_AGE_MIN || ageValue > DONOR_AGE_MAX) {
    errors.push(`Donors must be aged ${DONOR_AGE_MIN}–${DONOR_AGE_MAX}.`);
  }

  if (!Number.isFinite(weightValue) || weightValue <= 0) {
    errors.push("Weight must be a positive number.");
  } else if (weightValue < DONOR_MIN_WEIGHT_KG) {
    errors.push(`Donors must weigh at least ${DONOR_MIN_WEIGHT_KG} kg.`);
  }

  return errors;
};
