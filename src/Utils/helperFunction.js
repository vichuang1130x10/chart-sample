export function outputDate(date) {
  return date.toLocaleString().split(",")[0] || "";
}

export function separateString(str) {
  return str.split("(");
}

export function getWeek(d) {
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const jan4 = new Date(target.getFullYear(), 0, 4);
  const dayDiff = (target - jan4) / 86400000;
  const weekNr = 1 + Math.ceil(dayDiff / 7);
  return weekNr;
}

export function getDateOfISOWeek(w, y) {
  var simple = new Date(y, 0, 1 + (w - 1) * 7);
  var dow = simple.getDay();
  var ISOweekStart = simple;
  if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}

export function getSevenDayBoundary(d) {
  return new Date(new Date(d).valueOf() + -90 * 24 * 3600 * 1000);
}

export function milToMiliMeter(mil) {
  return parseFloat((mil * 0.0254).toFixed(2));
}

export const MBKEYWORD = [
  "MBD",
  "X10",
  "X11",
  "X12",
  "M11",
  "P8D",
  "X8D",
  "H11",
  "H12",
  "B11",
  "B8D",
  "X8D",
  "B9D",
  "A2S",
  "A1S",
  "A3S",
  "B1D",
  "C2C",
  "C9X",
  "C9Z",
  "C7C",
  "C7H",
  "C2S",
  "B2S",
  "B10",
  "B11",
  "B12",
  "B1S",
];

export const BPNKEYWORD = ["BPN", "SAS", "SAT", "CSE"];

// For CM station types
export const USITYPE = ["SMT1", "SMT2", "ASM", "FCT"];
export const WSZTYPE = [
  "SMT_AOI(BOT)",
  "SMT_AOI(TOP)",
  "DIP_FINAL",
  "DIP_Function_A",
];
export const WIHTYPE = [
  "AOI BOT",
  "AOI TOP",
  "DIP Final Inspection",
  "DIP Function A",
];
export const OSETYPE = ["AOI-A1", "AOI-A2", "DIP-VI", "First & Function TEST"];
export const RISETYPE = ["SMT1", "AOI1", "DIP1", "FCT"];
export const CPWTYPE = [
  "04_AOI_B",
  "09_AOI_T",
  "24_DIP_VI",
  "24_DIP_VI_T",
  "34_FT_1",
];
