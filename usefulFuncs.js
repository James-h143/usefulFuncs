const { readdir, lstat, readFile } = require("fs").promises;

class usefulFuncs {
  //
  async getDirsRecursively(sPath) {
    const files = [];
    const items = await readdir(sPath, "utf8");
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const oItem = await lstat(sPath + "/" + item);
      if (oItem.isDirectory()) {
        const recursiveFiles = await this.getDirsRecursively(
          sPath + "/" + item
        );
        recursiveFiles.forEach(subfolderFile => {
          files.push(subfolderFile);
        });
      }
      if (oItem.isFile()) {
        files.push(sPath + "/" + item);
      }
    }
    return files;
  }

  //generates random string from either the default or a supplied charset
  generateRandomString(
    num,
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  ) {
    let text = "";
    for (let i = 0; i < num; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  //
  async parseCSV(filePath) {
    let fileContents = await readFile(filePath, "utf-8");
    let replaced = [];
    let quotedText;
    let firstQuoteLocation;
    let secondQuoteLocation;
    let tempString;
    while (fileContents.indexOf('"') > -1) {
      firstQuoteLocation = fileContents.indexOf('"');
      secondQuoteLocation = fileContents.indexOf('"', firstQuoteLocation + 1);
      quotedText = fileContents.substring(
        firstQuoteLocation,
        secondQuoteLocation + 1
      );
      tempString = this.generateRandomString(20);
      fileContents = fileContents.replace(quotedText, tempString);
      replaced.push({
        tempString,
        quotedText
      });
    }
    let rows = fileContents.replace(/\r/g, "").split("\n");
    for (let i = 0; i < rows.length; i++) {
      rows[i] = rows[i].split(",");
      rows[i].forEach((cell, idx) => {
        let x;
        for (x = 0; x < replaced.length; x++) {
          if (cell === replaced[x].tempString) {
            rows[i][idx] = replaced[x].quotedText;
            break;
          }
        }
      });
    }
    return rows;
  }
}
module.exports = new usefulFuncs();
