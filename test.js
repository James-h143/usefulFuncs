const usefulFuncs = require("./usefulFuncs");

async function main() {
  const parsed = await usefulFuncs.parseCSV(
    "./2017 UKPGE electoral data 4.csv"
  );
  parsed.forEach((candidate, idx) => {
    if (candidate.length !== 8) {
      throw new Error("incorrect length on line: " + (parseInt(idx) + 1));
    }
  });
  console.log(parsed);
}
main();
