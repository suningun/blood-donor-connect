import { getHospital } from "../services/hospitals.js";
import { getUser } from "../services/users.js";

export const verifyAccountRole = async (uid, idToken, expectedRole) => {
  const [userProfile, hospitalProfile] = await Promise.all([
    getUser(uid, idToken),
    getHospital(uid, idToken),
  ]);

  if (userProfile && hospitalProfile) {
    throw new Error("This account has both donor and hospital profiles. Please contact support.");
  }

  if (expectedRole === "user" && !userProfile) {
    if (hospitalProfile) {
      throw new Error("This is a hospital account. Please use Hospital Login.");
    }
    throw new Error("No donor profile was found for this account. Please register as a donor.");
  }

  if (expectedRole === "hospital" && !hospitalProfile) {
    if (userProfile) {
      throw new Error("This is a donor account. Please use Donor Login.");
    }
    throw new Error("No hospital profile was found for this account. Please register your hospital.");
  }
};
