import test from "ava";
import Parser from "../lib/parser";
import RuleParser from "../lib/rule";
import fs from "fs";

test("detect pass example", async t => {
  let test = await new Parser.SEOParser()
    .fromReadStream("./example/example-pass.html")
    // .outputToStream();
    .outputToResult();

  t.true(test.pass.img);
  t.true(test.pass.a);
  t.true(test.pass.title);
  t.true(test.pass.meta);
  t.true(test.pass.strong);
  t.true(test.pass.h1);
});

test("custom rules without default", async t => {
  let test = await new Parser.SEOParser({
    rules: [
      {
        tag: {
          include: "h2"
        },
        condition: {
          "=": 0
        }
      }
    ],
    default: false
  })
    .fromReadStream("./example/example-pass.html")
    // .outputToStream();
    .outputToResult();

  t.true(test.pass.h2);
});

test("custom rules with default", async t => {
  let test = await new Parser.SEOParser({
    rules: [
      {
        tag: {
          include: "h2"
        },
        condition: {
          "=": 0
        }
      }
    ]
  })
    .fromReadStream("./example/example-pass.html")
    // .outputToStream();
    .outputToResult();

  t.true(test.pass.img);
  t.true(test.pass.a);
  t.true(test.pass.title);
  t.true(test.pass.meta);
  t.true(test.pass.strong);
  t.true(test.pass.h1);
  t.true(test.pass.h2);
});

test("detect fail example", async t => {
  let test = await new Parser.SEOParser()
    .fromReadStream("./example/example-fail.html")
    .outputToResult();
  // .outputToStream();

  t.false(test.pass.img);
  t.false(test.pass.a);
  t.false(test.pass.title);
  t.false(test.pass.meta);
  t.false(test.pass.strong);
  t.false(test.pass.h1);
});

test.skip("write to stream", async t => {
  new Parser.SEOParser()
    .fromReadStream("./example/example-pass.html")
    .outputToStream("./report/seo-parse-result.json");

  let data = await fs.readFileSync("./report/seo-parse-result.json", "utf8");
  data = await JSON.parse(data);

  t.true(data.pass.img);
  t.true(data.pass.a);
  t.true(data.pass.title);
  t.true(data.pass.meta);
  t.true(data.pass.strong);
  t.true(data.pass.h1);
});
