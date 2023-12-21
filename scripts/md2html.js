require('dotenv').config();

const path = require('node:path');
const fs = require('node:fs/promises');
const showdown = require('showdown');

const CWD = process.cwd();
const docsFolder = path.join(CWD, 'backend', 'public', 'docs');
const readmeHtml = path.join(docsFolder, 'README.html');

const APP_PORT = process.env.APP_PORT || '4000';
const repo = 'jherax/hapi-mongo-swagger';
startTask();

function startTask() {
  registerExtension();

  /**
   * @see https://www.npmjs.com/package/showdown
   */
  fs.mkdir(docsFolder, {recursive: true})
    .then(() => fs.readFile(path.resolve(CWD, 'README.md')))
    .then(fileContent => {
      const converter = new showdown.Converter({extensions: ['prettify']});
      const html = converter.makeHtml(fileContent.toString('utf8'));
      return fs.writeFile(readmeHtml, addResources(html));
    })
    .then(() => {
      // eslint-disable-next-line no-console
      console.info(`File written: ${readmeHtml}`);
    })
    .catch(error => {
      throw error;
    });
}

function registerExtension() {
  showdown.extension('prettify', function () {
    return [
      {
        type: 'output',
        filter: source =>
          source
            .replace(/localhost:4000/gi, `localhost:${APP_PORT}`)
            .replace(
              /"(backend)\//gi,
              `"https://github.com/${repo}/tree/master/$1/`,
            )
            .replace(
              /(<pre[^>]*>)?[\n\s]?<code([^>]*)>/gi,
              function (match, pre, codeClass) {
                return pre
                  ? '<pre class="prettyprint linenums"><code' + codeClass + '>'
                  : ' <code class="prettyprint">';
              },
            ),
      },
    ];
  });
}

/**
 * Selected theme:
 * @see https://github.com/picocss/pico
 * @see https://github.com/dracula/highlightjs
 */
function addResources(html) {
  return `
<!doctype html>
<html lang="en">
  <head>
    <title>README</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.classless.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/dracula/highlightjs/dracula.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <style> pre>code.hljs {padding: var(--spacing); color: rgb(162, 175, 185);} blockquote p {margin-bottom: 0;}</style>
    <script>hljs.highlightAll();</script>
  </head>
  <body>
    <main>
    ${html}
    </main>
  </body>
</html>`;
}
