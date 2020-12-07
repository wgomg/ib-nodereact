'use strict';

const ibLinks = (post, urlFormat, board, thread) => {
  const splitMarker = genSplitMarker();
  post.text = post.text.replace(/\n/g, splitMarker + '<br />' + splitMarker);

  const regexPostLink = new RegExp('\\>{2}(\\d+)', 'g');
  const regexBoardLink = new RegExp('\\>{3}([a-z]+)', 'g');

  let procesedText = post.text
    .replace(
      regexPostLink,
      (match, string) =>
        `<a href='${urlFormat[0].value
          .replace('[board_uri]', board.uri)
          .replace('[thread_id]', thread.thread_id)
          .replace('[post_id]', post.post_id)}'>` +
        splitMarker +
        '&#62;&#62;' +
        string +
        splitMarker +
        '</a>'
    )
    .replace(
      regexBoardLink,
      (match, string) =>
        `<a href='${
          urlFormat[0].value.replace('[board_uri]', board.uri).split('/')[0]
        }'>` +
        splitMarker +
        '&#62;&#62;&#62;/' +
        string +
        '/' +
        splitMarker +
        '</a>'
    )
    .split(splitMarker)
    .map((pt) => ({
      html:
        /^<a .+?>$/g.test(pt) || /^<\/a>$/g.test(pt) || /^<br \/>$/g.test(pt),
      text: pt
    }));

  return procesedText;
};

const tags = (post, tags) => {
  const splitMarker = genSplitMarker();

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

  console.log(regexTags);

  const tagsPrefixes = tags.map((tag) => tag.prefix_replacer);
  const tagsPostfixes = tags.map((tag) => tag.postfix_replacer);

  let taggedPost = post.map(({ text, html }) => {
    if (html) return [{ html, text }];

    let taggedText = text;

    regexTags.forEach(({ regex, tag }) => {
      taggedText = taggedText.replace(regex, (match, string) =>
        tag
          ? splitMarker +
            tag.prefix_replacer +
            splitMarker +
            string +
            splitMarker +
            tag.postfix_replacer +
            splitMarker
          : splitMarker +
            `<a href='${match}'>` +
            splitMarker +
            match +
            splitMarker +
            '</a>' +
            splitMarker
      );
    });

    return taggedText
      .replace(/(&#62;)/g, '>')
      .split(splitMarker)
      .map((e) =>
        tagsPrefixes.includes(e) ||
        tagsPostfixes.includes(e) ||
        /^<a .+?>$/g.test(e) ||
        /^<\/a>$/g.test(e)
          ? { html: true, text: e }
          : { html: false, text: e }
      );
  });

  let taggedPostFlattened = taggedPost.flat();

  taggedPost = [];
  let tmp = { ...taggedPostFlattened[0] };

  let index = 0;
  while (index <= taggedPostFlattened.length) {
    index++;
    if (!tmp.text || tmp.text === '') {
      tmp = { ...taggedPostFlattened[index] };
      continue;
    } else if (tmp.html && taggedPostFlattened[index]?.html)
      tmp.text += taggedPostFlattened[index].text;
    else {
      taggedPost.push(tmp);
      tmp = { ...taggedPostFlattened[index] };
    }
  }

  return taggedPost;
};

const genSplitMarker = () => `$${Math.random().toString(20).substr(2, 10)}$`;

module.exports = { ibLinks, tags };
