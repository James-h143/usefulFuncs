const {
  mkdir,
  writeFile,
  readdir,
  lstat,
  unlink,
  readFile,
  rmdir,
} = require("fs").promises;

async function save(tempString, quotedText, tempDir) {
  await writeFile(`${tempDir}/${tempString}`, quotedText);
}

async function delDir(dirname) {
  for (let file of await readdir(dirname)) {
    if ((await lstat(dirname + "/" + file)).isDirectory()) {
      await delDir(dirname);
    } else {
      await unlink(dirname + "/" + file);
    }
  }
  await rmdir(dirname);
}

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
        recursiveFiles.forEach((subfolderFile) => {
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
    let quotedText;
    let firstQuoteLocation;
    let secondQuoteLocation;
    let tempString;
    let tempDir = __dirname + "/" + this.generateRandomString(8);

    await mkdir(tempDir);
    while (fileContents.includes('"')) {
      firstQuoteLocation = fileContents.indexOf('"');
      secondQuoteLocation = fileContents.indexOf('"', firstQuoteLocation + 1);
      quotedText = fileContents.substring(
        firstQuoteLocation,
        secondQuoteLocation + 1
      );
      tempString = this.generateRandomString(8);
      fileContents = fileContents.replace(quotedText, tempString);

      await save(tempString, quotedText, tempDir);
    }
    let rows = fileContents.replace(/\r/g, "").split("\n");
    for (let i = 0; i < rows.length; i++) {
      try {
        rows[i] = rows[i].split(",");
        let replaced = await readdir(tempDir);
        for (let [idx, cell] of rows[i].entries()) {
          let replacedIndex = replaced.indexOf(cell);
          if (replacedIndex > -1) {
            rows[i][idx] = await readFile(`${tempDir}/${cell}`, "utf8");
            unlink(`${tempDir}/${cell}`);
            replaced = replaced.splice(replaced.indexOf(cell), 1);
          }
        }
      } catch (e) {
        console.log(e);
        delDir(`${tempDir}`);
        throw e;
      }
    }
    delDir(`${tempDir}`);
    return rows;
  }
}
module.exports = new usefulFuncs();
