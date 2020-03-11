'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var buurmanUtils = require('buurman-utils');
var fsExtra = require('fs-extra');
var path = require('path');
var readdir = _interopDefault(require('recursive-readdir'));

const run = async (context, {
  source,
  variables,
  destination
}) => {
  destination = path.isAbsolute(destination) ? destination : path.join(process.cwd(), destination);
  const processPath = buurmanUtils.pathTemplate(variables);
  const tpl = buurmanUtils.fileTemplate(variables);

  if (!context.path) {
    throw new Error(`Can't run template action, no path provided in action context.`);
  }

  const templateRoot = path.join(context.path, source);
  const files = await readdir(templateRoot);

  for (const path$1 of files) {
    const dest = path.join(destination, path.relative(templateRoot, path$1));
    const filePath = processPath(dest);
    await fsExtra.mkdirp(path.dirname(filePath));
    await fsExtra.writeFile(filePath, tpl((await fsExtra.readFile(path$1, "utf-8"))));
  }
};

exports.run = run;
//# sourceMappingURL=index.js.map
