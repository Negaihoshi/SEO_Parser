const cheerio = require("cheerio");
const fs = require("fs");
const ruleParser = require("./rule");

class SEOParser {
  constructor(option = {}) {
    this.inputType = "";
    this.path = "";
    this.customRules = option;
    this.withoutDefault = false;
    if (option.rules) {
      this.customRules = option.rules;
    }

    if (option.default === false) {
      this.withoutDefault = true;
    }
  }

  fromFile(path) {
    this.inputType = "File";
    this.path = path;

    return this;
  }

  fromReadStream(path) {
    this.inputType = "ReadSteam";
    this.path = path;

    return this;
  }

  async getStream(path) {
    let readStream = fs.createReadStream(path);

    let data = "";
    for await (const chunk of readStream) {
      data += chunk;
    }

    return data;
  }

  async outputToFile(path = "seo-parse-result.json") {
    let result = await this.validate();
    fs.writeFile(path, JSON.stringify(result, null, 2), "utf8", err => {
      if (err) return console.log(err);
      // console.log("The file was saved at: " + path);
    });
    return this;
  }

  async outputToStream(path = "seo-parse-result.json") {
    let result = await this.validate();

    let writeStream = fs.createWriteStream(path);
    writeStream.write(JSON.stringify(result, null, 2), "utf-8", err => {
      if (err) return console.log(err);
    });

    writeStream.end();

    // writeStream.on("finish", () => {
    //   console.log("The file was saved at: " + path);
    // });

    return this;
  }

  async outputToConsole() {
    let result = await this.validate();
    console.log(result);

    return this;
  }

  async outputToResult() {
    let result = await this.validate();

    return result;
  }

  async validate() {
    let data = "";
    switch (this.inputType) {
      case "File":
        data = await fs.readFileSync(this.path);
        break;
      case "ReadSteam":
        data = await this.getStream(this.path);
        break;
    }
    return await new ruleParser.Rule(data).parseRule(
      this.customRules,
      this.withoutDefault
    );
  }
}

module.exports.SEOParser = SEOParser;
