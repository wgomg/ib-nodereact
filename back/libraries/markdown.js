'use strict';

const sanitizeInPostHTML = (text) => {
  let sanitizedText = text;

  HTML_TAGS.forEach((HTML_TAG) => {
    const htmlTagRegExpString = `<${HTML_TAG}.*?>`;
    const htmlTagRegExp = new RegExp(htmlTagRegExpString, 'gi');

    sanitizedText = sanitizedText.replace(htmlTagRegExp, (match) =>
      match.replace('<', '&#60;').replace('>', '&#62;')
    );
  });

  return sanitizedText;
};

const ibLinks = (post, urlFormat, board, thread) => {
  const splitMarker = genMarker('split');
  const htmlMarker = genMarker('html');

  const regexPostLink = new RegExp('\\>{2}(\\d+)', 'g');
  const regexBoardLink = new RegExp('\\>{3}([a-z]+)', 'g');

  let processedText = post.text
    .replace(regexPostLink, (match, string) => '[rpl' + string + 'rpl]')
    .replace(regexBoardLink, (match, string) => '[rbl' + string + 'rbl]')
    .replace(
      /\[rpl(\d+)rpl\]/g,
      (match, string) =>
        splitMarker +
        `<a href='${urlFormat[0].value
          .replace('[board_uri]', board.uri)
          .replace('[thread_id]', thread.thread_id)
          .replace('[post_id]', string)}'>` +
        htmlMarker +
        splitMarker +
        '&#62;&#62;' +
        string +
        splitMarker +
        htmlMarker +
        '</a>' +
        splitMarker
    )
    .replace(
      /\[rbl([a-z]+)rbl\]/g,
      (match, string) =>
        splitMarker +
        `<a href='${
          urlFormat[0].value.replace('[board_uri]', board.uri).split('/')[0]
        }'>` +
        htmlMarker +
        splitMarker +
        '&#62;&#62;&#62;/' +
        string +
        '/' +
        splitMarker +
        htmlMarker +
        '</a>' +
        splitMarker
    )
    .split(splitMarker)
    .filter((pt) => pt !== htmlMarker && pt.length > 0)
    .map((pt) => ({
      html: pt.includes(htmlMarker),
      text: pt.replace(htmlMarker, '')
    }));

  return processedText;
};

const tags = (post, tags) => {
  const splitMarker = genMarker('split');
  const htmlMarker = genMarker('html');

  const regexTags = tags
    .sort((tag1, tag2) => tag2.full_line - tag1.full_line)
    .map((tag) => {
      const tagChar = tag.tag.split('')[0];
      const tagCharLength = tag.tag.length;
      const tagPosition = tag.position;

      let regexString = tag.full_line ? '^' : '';

      if (tagPosition === 'start' || tagPosition === 'both')
        regexString += '\\' + tagChar + '{' + tagCharLength + '}(.+?)';

      if (tagPosition === 'both' || tagPosition === 'end')
        regexString += '\\' + tagChar + '{' + tagCharLength + '}';
      else if (tagPosition === 'start') regexString += '$';

      return { regex: new RegExp(regexString, 'g'), tag };
    });

  const linksRegex = new RegExp(
    '[(http(s)?):\\/\\/(www\\.)?a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)',
    'gi'
  );

  regexTags.push({ regex: linksRegex, tag: null });

  let taggedPost = post.map(({ text, html }) => {
    if (html) return [{ html, text }];

    let taggedText = text;

    regexTags.forEach(({ regex, tag }) => {
      taggedText = taggedText.replace(regex, (match, string) =>
        tag
          ? splitMarker +
            tag.prefix_replacer +
            htmlMarker +
            splitMarker +
            string +
            splitMarker +
            htmlMarker +
            tag.postfix_replacer +
            splitMarker
          : splitMarker +
            `<a href='${match}'>` +
            htmlMarker +
            splitMarker +
            match +
            splitMarker +
            htmlMarker +
            '</a>' +
            splitMarker
      );
    });

    return taggedText
      .split(splitMarker)
      .filter((pt) => pt !== htmlMarker && pt.length > 0)
      .map((e) => ({
        html: e.includes(htmlMarker),
        text: e.replace(htmlMarker, '')
      }));
  });

  let taggedPostFlattened = taggedPost.flat();

  taggedPost = [];
  let tmp = { ...taggedPostFlattened[0] };

  let index = 1;
  while (index <= taggedPostFlattened.length) {
    if (tmp.html && taggedPostFlattened[index]?.html)
      tmp.text += taggedPostFlattened[index].text;
    else {
      taggedPost.push(tmp);
      tmp = { ...taggedPostFlattened[index] };
    }
    index++;
  }

  return taggedPost;
};

const restoreInPostHTML = (text) =>
  text.map(({ html, text }) => ({
    html,
    text: html ? text : text.replace(/(&#62;)/g, '>').replace(/(&#60;)/g, '<')
  }));

module.exports = { sanitizeInPostHTML, ibLinks, tags, restoreInPostHTML };

/*****************************************************************************************/

const genMarker = (str) =>
  `[${str}${Math.random().toString(20).substr(2, 10)}${str}]`;

const HTML_TAGS = [
  'area',
  'base',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'br',
  'source',
  'track',
  'wbr',
  'head',
  'style',
  'title',
  'body',
  'address',
  'article',
  'aside',
  'footer',
  'header',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hgroup',
  'main',
  'nav',
  'section',
  'blockquote',
  'dd',
  'div',
  'dl',
  'dt',
  'figcaption',
  'figure',
  'li',
  'ol',
  'p',
  'pre',
  'ul',
  'a',
  'abbr',
  'b',
  'bdi',
  'bdo',
  'cite',
  'code',
  'data',
  'dfn',
  'em',
  'i',
  'kbd',
  'mark',
  'q',
  'rb',
  'rt',
  'rtc',
  'ruby',
  's',
  'samp',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'time',
  'u',
  'var',
  'audio',
  'map',
  'video',
  'iframe',
  'object',
  'picture',
  'canvas',
  'noscript',
  'script',
  'del',
  'ins',
  'caption',
  'colgroup',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'button',
  'datalist',
  'tr',
  'fieldset',
  'form',
  'label',
  'legend',
  'meter',
  'optgroup',
  'option',
  'output',
  'progress',
  'select',
  'textarea',
  'details',
  'dialog',
  'menu',
  'summary',
  'slot',
  'template',
  'acronym',
  'applet'
];
