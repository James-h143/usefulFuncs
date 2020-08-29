const usefulFuncs = require("./usefulFuncs");
const fs = require("fs").promises;
async function main() {
  let rawByCandidate = usefulFuncs.parseCSV(
    "./HoC-GE2019-results-by-constituency-csv.csv"
  );
  let rawByConstituency = usefulFuncs.parseCSV(
    "HoC-GE2019-results-by-candidate-csv.csv"
  );
  rawData = [await rawByCandidate, await rawByConstituency];
  let parsedData = [];
  for (let data of rawData) {
    let rows = [];
    for (let [idx, row] of data.entries()) {
      if (idx !== 0) {
        let parsingData = {};
        for (let [cellIdx, cell] of row.entries()) {
          parsingData[data[0][cellIdx]] = cell;
        }
        rows.push(parsingData);
      }
    }
    parsedData.push(rows);
  }

  // parsed.forEach((candidate, idx) => {
  //   if (candidate.length !== 8) {
  //     throw new Error("incorrect length on line: " + (parseInt(idx) + 1));
  //   }
  // });
  console.log(rawByCandidate);
  console.log(rawByConstituency);
}
main();
