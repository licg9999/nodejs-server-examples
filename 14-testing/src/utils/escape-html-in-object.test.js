const escapeHtml = require('escape-html');
const escapeHtmlInObject = require('./escape-html-in-object');

describe('utils/escape-html-in-object', () => {
  it('should escape a string', () => {
    const input = `"'$<>`;
    expect(escapeHtmlInObject(input)).toEqual(escapeHtml(`"'$<>`));
  });

  it('should escape strings in object', () => {
    const input = {
      a: `"'$<>`,
      b: `<>$"'`,
      c: {
        d: `'"$><`,
      },
    };
    expect(escapeHtmlInObject(input)).toEqual({
      a: escapeHtml(`"'$<>`),
      b: escapeHtml(`<>$"'`),
      c: {
        d: escapeHtml(`'"$><`),
      },
    });
  });

  it('should escape strings in array', () => {
    const input = [`"'$<>`, `<>&"'`, [`'"$><`]];
    expect(escapeHtmlInObject(input)).toEqual([
      escapeHtml(`"'$<>`),
      escapeHtml(`<>&"'`),
      [escapeHtml(`'"$><`)],
    ]);
  });

  it('should escape strings in object and array', () => {
    const input1 = {
      a: `"'$<>`,
      b: `<>$"'`,
      c: [`'"$><`, { d: `><&'"` }],
    };
    expect(escapeHtmlInObject(input1)).toEqual({
      a: escapeHtml(`"'$<>`),
      b: escapeHtml(`<>$"'`),
      c: [escapeHtml(`'"$><`), { d: escapeHtml(`><&'"`) }],
    });

    const input2 = [`"'$<>`, `<>&"'`, { a: `'"$><`, b: [`><&'"`] }];
    expect(escapeHtmlInObject(input2)).toEqual([
      escapeHtml(`"'$<>`),
      escapeHtml(`<>&"'`),
      { a: escapeHtml(`'"$><`), b: [escapeHtml(`><&'"`)] },
    ]);
  });

  it('should keep none-string fields in object or array', () => {
    const input1 = {
      a: `"'$<>`,
      b: 1,
      c: null,
      d: true,
      e: undefined,
    };
    expect(escapeHtmlInObject(input1)).toEqual({
      a: escapeHtml(`"'$<>`),
      b: 1,
      c: null,
      d: true,
      e: undefined,
    });

    const input2 = [`"'$<>`, 1, null, true, undefined];
    expect(escapeHtmlInObject(input2)).toEqual([
      escapeHtml(`"'$<>`),
      1,
      null,
      true,
      undefined,
    ]);
  });

  it('should convert sequelize model instance as plain object', () => {
    const input = {
      toJSON: () => ({ a: `"'$<>`, b: `<>$"'` }),
    };

    expect(escapeHtmlInObject(input)).toEqual({
      a: escapeHtml(`"'$<>`),
      b: escapeHtml(`<>$"'`),
    });
  });
});
