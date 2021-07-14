import { getWeek, MBKEYWORD, BPNKEYWORD } from "../helperFunction";

// parsing yieldRate json to specfic format for each station failure symptom
export function parseForYieldRate(updatedJson) {
  // Date: Sun Jan 31 2021 00:00:00 GMT+0800 (Taipei Standard Time)
  // __proto__: Object
  // Fail: 4
  // Line: "PD2-T3"
  // MO: 801011
  // Model: "M2000"
  // Pass: 196
  // Total: 200
  // Type: "AOI2"
  // Vendor: "Foxconn"
  // Version: "A"

  let n = { startDate: null, endDate: null };

  updatedJson.YieldRate.forEach((obj) => {
    if (n.startDate === null) {
      n.startDate = obj.Date;
    } else if (obj.Date < n.startDate) {
      n.startDate = obj.Date;
    }

    if (n.endDate === null) {
      n.endDate = obj.Date;
    } else if (obj.Date > n.endDate) {
      n.endDate = obj.Date;
    }

    if (n[obj.Model] === undefined || n[obj.Model] === null) {
      n[obj.Model] = {};
      n[obj.Model]["RowData"] = [obj];
      n[obj.Model]["AOI2"] = { Pass: 0, Fail: 0, Total: 0, data: [], mo: [] };
      n[obj.Model]["AOI4"] = { Pass: 0, Fail: 0, Total: 0, data: [], mo: [] };
      n[obj.Model]["X-Ray"] = { Pass: 0, Fail: 0, Total: 0, data: [], mo: [] };
      n[obj.Model]["ICT"] = { Pass: 0, Fail: 0, Total: 0, data: [], mo: [] };

      if (
        obj.Type === "AOI2" ||
        obj.Type === "AOI4" ||
        obj.Type === "X-Ray" ||
        obj.Type === "ICT"
      ) {
        n[obj.Model][obj.Type].Pass += obj.Pass;
        n[obj.Model][obj.Type].Fail += obj.Fail;
        n[obj.Model][obj.Type].Total += obj.Total;
        const { Date, Pass, Fail, Total, MO } = obj;
        n[obj.Model][obj.Type].data = [{ Date, Pass, Fail, Total }];
        n[obj.Model][obj.Type].mo = [{ MO, Pass, Fail, Total }];
      }
    } else {
      n[obj.Model]["RowData"].push(obj);
      if (
        obj.Type === "AOI2" ||
        obj.Type === "AOI4" ||
        obj.Type === "X-Ray" ||
        obj.Type === "ICT"
      ) {
        n[obj.Model][obj.Type].Pass += obj.Pass;
        n[obj.Model][obj.Type].Fail += obj.Fail;
        n[obj.Model][obj.Type].Total += obj.Total;
        const { Date, Pass, Fail, Total, MO } = obj;
        const sameDateObje = n[obj.Model][obj.Type].data.find(
          (elem) => elem.Date.toString() === Date.toString()
        );
        if (sameDateObje) {
          sameDateObje.Pass += Pass;
          sameDateObje.Fail += Fail;
          sameDateObje.Total += Total;
        } else {
          n[obj.Model][obj.Type].data.push({ Date, Pass, Fail, Total });
        }
        const sameMoObj = n[obj.Model][obj.Type].mo.find(
          (elem) => elem.MO === MO
        );

        if (sameMoObj) {
          sameMoObj.Pass += Pass;
          sameMoObj.Fail += Fail;
          sameMoObj.Total += Total;
        } else {
          n[obj.Model][obj.Type].mo.push({ MO, Pass, Fail, Total });
        }
      }
    }
  });

  //{startDate: Wed Apr 01 2020 00:00:00 GMT+0800 (Taipei Standard Time), endDate: Thu Jun 04 2020 00:00:00 GMT+0800 (Taipei Standard Time), 2701-005240-60(X11DPG-SN): {…}, 2701-005280-61(X11DPG-OT-CPU): {…}, 2701-005222-61(X11DPFR-SN-LC019): {…}, …}
  //2701-001520-65(AOC-STGN-i2S): {RowData: Array(312), SMT1: {…}, SMT2: {…}, ASM: {…}, FCT: {…}, …}
  //ASM: {Pass: 5001, Fail: 0, Total: 5001, data: Array(10)}

  const result = transformToArray(n);
  // const BPNData = calculateSMT2AndFctYieldByGroup(result.BPN);
  // const MBData = calculateSMT2AndFctYieldByGroup(result.MB);
  // const OtherData = calculateSMT2AndFctYieldByGroup(result.Other);
  // // const BPNSMT2Total = BPNData.SMT2.reduce((acc, elem) => acc + elem.Total, 0);
  // const BPNSMT2Total = calculateTotal(BPNData, "SMT2");
  // const BPNFCTTotal = calculateTotal(BPNData, "FCT");
  // const MBSMT2Total = calculateTotal(MBData, "SMT2");
  // const MBFCTTotal = calculateTotal(MBData, "FCT");
  // const OtherSMT2Total = calculateTotal(OtherData, "SMT2");
  // const OtherFCTTotal = calculateTotal(OtherData, "FCT");
  // const smt2PieData = { BPNSMT2Total, MBSMT2Total, OtherSMT2Total };
  // const fct2PieData = { BPNFCTTotal, MBFCTTotal, OtherFCTTotal };
  // const piesData = { smt2PieData, fct2PieData };
  const { startDate, endDate, models } = result;
  return {
    startDate,
    endDate,
    models,
  };
}

// const calculateTotal = (obj, Type) =>
//   obj[Type].reduce((acc, elem) => acc + elem.Total, 0);

// transform yieldRate object into array for result page easy to render
function transformToArray(obj) {
  const { startDate, endDate } = obj;
  const o = { startDate, endDate, models: [] };
  const keys = Object.keys(obj).filter(
    (item) => item !== "startDate" && item !== "endDate"
  );
  keys.forEach((model) => {
    const newObject = { model, ...obj[model] };
    o.models.push(newObject);
  });
  return o;
}

// generate yield rate/ output data by week
const calculateData = (arr, type) => {
  const data = arr
    .filter((obj) => obj.Type === type)
    .map((obj) => ({
      Week: getWeek(obj.Date),
      Pass: obj.Pass,
      Total: obj.Total,
    }));

  const finalResult = {};
  data.forEach((obj) => {
    if (finalResult[obj.Week] === undefined || finalResult[obj.Week] === null) {
      finalResult[obj.Week] = {
        Week: obj.Week,
        Pass: obj.Pass,
        Total: obj.Total,
      };
    } else {
      finalResult[obj.Week].Pass += obj.Pass;
      finalResult[obj.Week].Total += obj.Total;
    }
  });
  const keys = Object.keys(finalResult);
  const finalArray = [];
  keys.forEach((key) => {
    finalArray.push(finalResult[key]);
  });
  return finalArray;
};

// pass group raw data array and return an obj {SMT2 :[{Week:1,Total:100,Pass:99,Yield:99%}...],FCT:[{Week:1,Total:100,Pass:99,Yield:99%}...]}
const calculateSMT2AndFctYieldByGroup = (arr) => {
  const smt2FinalArray = calculateData(arr, "SMT2");
  const fctFinalArray = calculateData(arr, "FCT");

  return {
    SMT2: smt2FinalArray.sort(sortByWeek),
    FCT: fctFinalArray.sort(sortByWeek),
  };
};

function sortByWeek(a, b) {
  if (a.Week > b.Week) {
    return 1;
  } else {
    return -1;
  }
}

// generate FE, BE, and FTY columns for yieldRate each model and stattion
// function generateFTY(obj) {
//   const keys = Object.keys(obj).filter(
//     (item) =>
//       item !== "startDate" &&
//       item !== "endDate" &&
//       item !== "MB" &&
//       item !== "BPN" &&
//       item !== "Other"
//   );

//   keys.forEach((key) => {
//     let model = obj[key];
//     const fePass = Math.max(model.SMT1.Pass || 0, model.SMT2.Pass || 0);
//     const feFail = (model.SMT1.Fail || 0) + (model.SMT2.Fail || 0);
//     const feYield =
//       parseFloat(((fePass / (fePass + feFail)) * 100).toFixed(1)) || 0;
//     const bePass = Math.max(
//       model.ASM.Pass || 0,
//       model.CPLD.Pass || 0,
//       model.VOL.pass || 0,
//       model.FCT.pass || 0
//     );
//     const beFail =
//       (model.ASM.Fail || 0) +
//       (model.CPLD.Fail || 0) +
//       (model.VOL.Fail || 0) +
//       (model.FCT.Fail || 0) +
//       (model.DAOI.Fail || 0);

//     const beYield =
//       parseFloat(((bePass / (bePass + beFail)) * 100).toFixed(1)) || 0;
//     const fty =
//       parseFloat(((feYield * beYield) / 100).toFixed(1)) ||
//       Math.max(feYield, beYield);
//     obj[key] = {
//       ...obj[key],
//       FE: {
//         Pass: fePass,
//         Fail: feFail,
//         Yield: feYield,
//       },
//       BE: {
//         Pass: bePass,
//         Fail: beFail,
//         Yield: beYield,
//       },
//       FTY: fty,
//     };
//   });

//   console.log("generateFTY", obj);
//   return obj;
// }

const getType = (failStation) => {
  switch (failStation) {
    case "AOI INSPECT21":
      return "AOI2";

    case "AOI INSPECT41":
    case "AOI INSPECT4":
      return "AOI4";

    case "X-RAY":
    case "X-RAY1":
    case "X-RAY2":
    case "X-RAY3":
      return "X-Ray";

    case "ICT":
    case "ICT03101":
    case "ICT03102":
    case "ICT03103":
    case "ICT03106":
    case "ICT03107":
    case "ICT03112":
    case "ICT08":
    case "ICT09":
    case "ICT1":
      return "ICT";

    default:
      return "";
  }
};
const replaceDashToUnderline = (string) => {
  if (string) {
    return string.replaceAll("-", "_");
  } else {
    return "";
  }
};
//const type = getType(obj["FAIL_STATION"]);

// parsing errorlist json to specfic format for each station failure symptom
export function parsingErrorList(errorList) {
  let n = { batchs: [] };

  errorList.forEach((obj) => {
    const item = replaceDashToUnderline(obj["LOCATION"]);
    const batchNo = obj["FAIL_SN"].split("-")[0] || "";

    if (obj["MODEL_NAME"] === "IPU-M MB MK2" && !n.batchs.includes(batchNo)) {
      n.batchs.push(batchNo);
    }

    obj["Type"] = getType(obj["FAIL_STATION"]);
    if (n[obj["MODEL_NAME"]] === undefined || n[obj["MODEL_NAME"]] === null) {
      n[obj["MODEL_NAME"]] = {};
      n[obj["MODEL_NAME"]]["AOI2"] = { ErorrDescriptions: [] };
      n[obj["MODEL_NAME"]]["AOI4"] = { ErorrDescriptions: [] };
      n[obj["MODEL_NAME"]]["X-Ray"] = { ErorrDescriptions: [] };
      n[obj["MODEL_NAME"]]["ICT"] = { ErorrDescriptions: [] };

      if (
        obj.Type === "AOI2" ||
        obj.Type === "AOI4" ||
        obj.Type === "X-Ray" ||
        obj.Type === "ICT"
      ) {
        n[obj["MODEL_NAME"]][obj.Type].ErorrDescriptions = [
          {
            description: obj["ROOT_CAUSE"],
            batchNo,
            reasons: [
              {
                reason: obj["ROOT_CAUSE"],
                item,
                batchNo,
                date: obj["REPAIR_TIME"],
              },
            ],
            date: obj["REPAIR_TIME"],
          },
        ];
      }
    } else {
      if (
        obj.Type === "AOI2" ||
        obj.Type === "AOI4" ||
        obj.Type === "X-Ray" ||
        obj.Type === "ICT"
      ) {
        n[obj["MODEL_NAME"]][obj.Type].ErorrDescriptions.push({
          description: obj["ROOT_CAUSE"],
          batchNo,
          reasons: [
            {
              reason: obj["ROOT_CAUSE"],
              item,
              batchNo,
              date: obj["REPAIR_TIME"],
            },
          ],
          date: obj["REPAIR_TIME"],
        });
      }
    }
  });

  return n;
}
