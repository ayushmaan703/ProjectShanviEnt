export const DB_NAME = `selvara`;

const USER_ROLES = Object.freeze([
  "superAdmin",
  "admin",
  "staff",
  "salesPerson",
]);

const MATERIAL_TYPE = Object.freeze([
  { name: "Metal", code: "M" },
  { name: "Diamond", code: "D" },
  { name: "Fancy Diamond", code: "F" },
  { name: "Gems Stone", code: "G" },
  { name: "Semi Precious", code: "S" },
  { name: "Jade", code: "J" },
  { name: "Pearl", code: "P" },
  { name: "Accessory", code: "A" },
  { name: "Ruby", code: "R" },
  { name: "Sapphire", code: "H" },
  { name: "Emerald", code: "E" },
  { name: "Cubic Zirconia", code: "Z" },
  { name: "Synthetic Stone", code: "X" },
  { name: "Others", code: "O" },
  { name: "Lab Grown Diamonds", code: "L" },
]);

const CALCULATION_TYPE = Object.freeze([
  { name: "pieces", code: "CP" },
  { name: "quantity", code: "CQ" },
]);

const PARAMETER = Object.freeze([
  { name: "shape", code: "DS" },
  { name: "size", code: "DSI" },
  { name: "color", code: "DC" },
  { name: "clarity", code: "DCL" },
  { name: "metal", code: "DM" },
]);

const PERMISSION = Object.freeze({
  edit: {
    type: Boolean,
    default: true,
  },
  remove: {
    type: Boolean,
    default: true,
  },
  create: {
    type: Boolean,
    default: true,
  },
  show: {
    type: Boolean,
    default: true,
  },
  viewOnly: {
    type: Boolean,
    default: true,
  },
  toggle: {
    type: Boolean,
    default: true,
  },
});

const CARAT = Object.freeze([
  "24k",
  "22k",
  "18k",
  "14k",
  "10k",
  "9k",
  "8k",
  "PT",
]);

export {
  USER_ROLES,
  MATERIAL_TYPE,
  CALCULATION_TYPE,
  PARAMETER,
  PERMISSION,
  CARAT,
};
