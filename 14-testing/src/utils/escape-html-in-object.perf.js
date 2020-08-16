const { Suite } = require('benchmark');
const benchmarks = require('beautify-benchmark');
const escapeHtmlInObject = require('./escape-html-in-object');

const suite = new Suite();

suite.add('sparse special chars', () => {
  escapeHtmlInObject('    &               ');
});

suite.add('sparse special chars in object', () => {
  escapeHtmlInObject({ _: '    &               ' });
});

suite.add('sparse special chars in array', () => {
  escapeHtmlInObject(['    &               ']);
});

suite.add('dense special chars', () => {
  escapeHtmlInObject(`"'&<>"'&<>""''&&<<>>`);
});

suite.add('dense special chars in object', () => {
  escapeHtmlInObject({ _: `"'&<>"'&<>""''&&<<>>` });
});

suite.add('dense special chars in object', () => {
  escapeHtmlInObject([`"'&<>"'&<>""''&&<<>>`]);
});

suite.on('cycle', (e) => benchmarks.add(e.target));
suite.on('complete', () => benchmarks.log());
suite.run({ async: false });
