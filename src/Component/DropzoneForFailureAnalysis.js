import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { readxlsx } from "../Utils/UtilitiesForFileHandle";
import { parseForYieldRate } from "../Utils/CmShopFloorParsing/RawDataParsing";

export default function Dropzone({ callback, fileType, setFlag }) {
  const [filename, setFilename] = useState("");

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onabort = () => console.log("file reading was abort");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = (e) => {
          console.log("received file ...");
          const data = e.target.result;

          const retJson = readxlsx(data);
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
          const key = Object.keys(retJson);

          switch (fileType) {
            case "YieldRate":
              // if (
              //   key[0].split(" ")[0] !== "YieldRate" ||
              //   retJson[key] === null
              // ) {
              //   alert(
              //     "The file you dropped is wrong, it should be yeild rate excel file"
              //   );
              //   setFlag(false);
              // } else {
              const updatedJson = { YieldRate: retJson[key] };

              // here to the vendor data and update the type content by each different vendor
              // updateJson.YieldRate.forEach(obj =>
              // switch (obj.vendor){
              //  case 'USI':
              //  case 'OSE':
              //}
              //
              // )

              const n = parseForYieldRate(updatedJson);
              console.log(n);

              callback(n);
              setFlag(true);
              // }
              break;

            case "RepairList":
              // if (
              //   key[0].split(" ")[0] !== "RepairList" ||
              //   retJson[key] === null
              // ) {
              //   alert(
              //     "The file you dropped is wrong, it should be repair list excel file"
              //   );
              //   setFlag(false);
              // } else {
              const updatedJsonRepair = { RepairList: retJson[key] };
              console.log(updatedJsonRepair);
              callback(updatedJsonRepair);
              setFlag(true);
              // }
              break;

            default:
              break;
          }
        };
        // reader.readAsArrayBuffer(file)
        reader.readAsBinaryString(file);
      });

      setFilename(acceptedFiles[0].name);
    },
    [callback, fileType, setFlag]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  return (
    <div>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag and drop file here, or click to select files</p>
      </div>
      <div>
        <h4>{filename}</h4>
      </div>
    </div>
  );
}
