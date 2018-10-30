const cheerio = require("cheerio");
const fs = require("fs");
const _ = require("lodash");

class Rule {
  constructor(steamData) {
    this.data = steamData;

    this.pass = {};
    this.fail = {};
    this.summary = "";
  }

  parseRule(customRules, withoutDefault) {
    let rules = {};
    if (!withoutDefault) {
      rules = require("./../rules/default-rule");
    }

    if (!_.isEmpty(customRules) && _.isArray(customRules)) {
      if (!_.isEmpty(rules)) {
        rules = _.concat(rules, customRules);
      } else {
        rules = customRules;
      }
    }

    this.$ = cheerio.load(this.data);

    rules.forEach(rule => {
      let tag = "";
      let queryTag = "";
      if (rule.tag.include) {
        tag = rule.tag.include;
        this.fail[tag] = { message: [] };
        this.pass[tag] = false;

        if (rule.parent_node) {
          queryTag = `${rule.parent_node} > ${tag}`;
        } else {
          queryTag = tag;
        }

        if (rule.condition) {
          let diffOperator = Object.keys(rule.condition)[0];
          switch (diffOperator) {
            case ">":
              if (
                this.$(queryTag).get().length > rule.condition[diffOperator]
              ) {
                this.fail[tag].message.push(
                  `Require ${rule.condition[diffOperator]} but get ${
                    this.$(queryTag).get().length
                  }`
                );
              } else {
                this.pass[tag] = true;
              }
              break;
            case "<":
              if (
                this.$(queryTag).get().length < rule.condition[diffOperator]
              ) {
                this.pass[tag] = true;
              } else {
                this.fail[tag].message.push(
                  `Require ${rule.condition[diffOperator]} but get ${
                    this.$(queryTag).get().length
                  }`
                );
              }
              break;
            case "=":
              if (
                this.$(queryTag).get().length != rule.condition[diffOperator]
              ) {
                this.fail[tag].message.push(
                  `Require ${rule.condition[diffOperator]} but get ${
                    this.$(queryTag).get().length
                  }`
                );
              } else {
                this.pass[tag] = true;
              }
              break;
            default:
          }
        }
        if (rule.attribute) {
          let diffOperator = Object.keys(rule.attribute)[0];
          let elementAttribute = Object.keys(rule.attribute[diffOperator])[0];

          switch (diffOperator) {
            case "with":
              queryTag = queryTag + `[${elementAttribute}]`;
              let flag = false;

              this.$(queryTag).each((index, value) => {
                if (
                  value.attribs[elementAttribute] ===
                  rule.attribute[diffOperator][elementAttribute]
                ) {
                  flag = true;
                }
              });

              if (!flag) {
                this.fail[tag].message.push(
                  `Require ${tag} attribute ${
                    rule.attribute[diffOperator][elementAttribute]
                  }`
                );
              }
              break;
            case "without":
              this.$(queryTag).each((index, element) => {
                if (
                  element.attribs[elementAttribute] ===
                  rule.attribute[diffOperator][elementAttribute]
                ) {
                  this.fail[tag].message.push(
                    `Shouldn't detect ${tag} ${elementAttribute} ${
                      element.attribs[elementAttribute]
                    }`
                  );
                }
              });
              break;
            default:
          }
        }
      }

      if (rule.tag.exclude) {
      }
    });

    for (const key in this.fail) {
      if (this.fail[key].message.length === 0) this.pass[key] = true;
    }

    let count = 0;
    for (const key in this.pass) {
      if (this.pass[key] === false) count++;
    }
    let ruleCount = Object.keys(this.pass).length;
    let percentage = 100 - (count / ruleCount).toFixed(2) * 100;
    this.summary = `Pass Percentage ${percentage}% (${count} fail in ${ruleCount} rule)`;

    return {
      summary: this.summary,
      pass: this.pass,
      fail: this.fail
    };
  }

  /**
   *  @deprecated
   */
  detectImgAlt() {
    this.$("img").each((index, element) => {
      let alt = element.attribs.alt;
      if (alt === undefined) this.fail.img.push(this.$.html(element));
      if (this.fail.img.length === 0) this.pass.img = true;
    });

    return this;
  }

  /**
   *  @deprecated
   */
  detectaLinkRel() {
    this.$("a").each((index, element) => {
      let rel = element.attribs.rel;
      if (rel === undefined) this.fail.alink.push(this.$.html(element));
      if (this.fail.alink.length === 0) this.pass.alink = true;
    });

    return this;
  }

  /**
   *  @deprecated
   */
  detectStrong(defaultLength = 15) {
    let strongLength = this.$("strong").get().length;

    if (strongLength > defaultLength) {
      this.fail.strong = strongLength;
    } else {
      if (this.fail.strong === 0) this.pass.strong = true;
    }

    return this;
  }

  /**
   *  @deprecated
   */
  detectH1() {
    let h1Length = this.$("h1").get().length;

    if (h1Length > 1) {
      this.fail.h1 = h1Length;
    } else {
      if (this.fail.h1 === 0) this.pass.h1 = true;
    }

    return this;
  }

  /**
   *  @deprecated
   */
  detectHead() {
    let headMeta = ["descriptions", "keywords"];
    let data = [];

    if (this.$("head > title").get().length === 0) this.fail.head.push("title");

    this.$("head > meta[name]").each((index, element) => {
      data.push(element.attribs.name);
    });

    headMeta.forEach(value => {
      if (data.indexOf(value) === -1) this.fail.head.push(value);
    });

    if (this.fail.head.length === 0) this.pass.head = true;

    return this;
  }
}

module.exports.Rule = Rule;
