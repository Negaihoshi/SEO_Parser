# simple seo parser [![Build Status](https://travis-ci.org/Negaihoshi/SEO_Parser.svg?branch=master)](https://travis-ci.org/Negaihoshi/SEO_Parser)

### Require

```
node v10+
```

Because package is build in nactive async/await

### Installation

`npm install simple-seo-parser`

## Document

Require package

```js
const Parser = require("simple-seo-parser");
```

```
You need choose one input function and one output fucntion.
  Input:
    fromFile
    fromReadStream
  Output:
    outputToFile
    outputToStream
    outputToConsole
    outputToResult
```

Read from file, Write from file

```js
new Parser.SEOParser().fromFile("./example/example-pass.html").outputToFile();
```

Read from stream, Write from stream

```js
new Parser.SEOParser()
  .fromReadStream("./example/example-pass.html")
  .outputToStream("./seo-parse-result.json");
```

Read from stream, show from console

```js
new Parser.SEOParser()
  .fromReadStream("./example/example-pass.html")
  .outputToConsole();
```

Read from stream, return result

```js
new Parser.SEOParser()
  .fromReadStream("./example/example-pass.html")
  .outputToResult();
```

Add custom rule

```js
new Parser.SEOParser({
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
  .outputToResult();
```

Disable default rule

```js
new Parser.SEOParser({
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
  .outputToResult();
```
