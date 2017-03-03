# slack-listner

A simple application to observe all private channels update time.

It's based on [electron_test](https://github.com/kegamin/electron_test.git)

## Feature

* observe last message for each private channel
* sort channels by last update time
* click to open a channel offical slack client (confirmed it only on macOS)

## Configuration

Need to configure your team token in `app/assets/conf.json`

```json
{
  "tokens": {
    "team-1-name": "your-token-for-tame-1",
    "team-2-name": "your-token-for-tame-2"
  },
  "ignore": ["class", "coffee-break"]
}
```

You may get your token via [Tokens for Testing and Development - Slack API](https://api.slack.com/docs/oauth-test-tokens).

## How to

### Setup

```bash
cd repository_dir
clone https://github.com/takkyun/slack-listener.git slack-listener
cd slack-listener
npm install
```

### Run for debug

```bash
npm start
```

### Build an app

```bash
npm run build
```

* It only builds a binary for macOS right now.

## Copyright

[slack-listener](https://github.com/takkyun/slack-listener.gitC)
is developed by Takuya Otani / SimpleBoxes.

Copyright (c) 2017 Takuya Otani / [SerendipityNZ](http://serendipitynz.com/) Ltd. 

## License

slack-listener is released under the MIT-license.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
