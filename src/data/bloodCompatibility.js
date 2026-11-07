export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const COMPATIBILITY = {
    "O-":  { give: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"], receive: ["O-"] },
    "O+":  { give: ["O+", "A+", "B+", "AB+"], receive: ["O-", "O+"] },
    "A-":  { give: ["A-", "A+", "AB-", "AB+"], receive: ["O-", "A-"] },
    "A+":  { give: ["A+", "AB+"], receive: ["O-", "O+", "A-", "A+"] },
    "B-":  { give: ["B-", "B+", "AB-", "AB+"], receive: ["O-", "B-"] },
    "B+":  { give: ["B+", "AB+"], receive: ["O-", "O+", "B-", "B+"] },
    "AB-": { give: ["AB-", "AB+"], receive: ["O-", "A-", "B-", "AB-"] },
    "AB+": { give: ["AB+"], receive: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"] },
};