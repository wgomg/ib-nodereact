'use strict';

const cache = require('./cache');

const striptags = require('striptags');

const apply = async (text, procId) => {
  const splitMarker = genSplitMarker();

  let replacedText = await applyTags(text, splitMarker, procId);

  const { textWq, quotedIds } = await setQuotes(replacedText, splitMarker, procId);

  replacedText = textWq;

  replacedText = replacedText
    .split('\r\n')
    .map((line) =>
      line.charAt(0) === '>' ? splitMarker + setGreenText(line, splitMarker) + splitMarker : line
    )
    .join('\n');

  return { text: replacedText.split(splitMarker), quoted: quotedIds };
};

const strip = (text) =>
  text
    .split('\r\n')
    .map((line) => striptags(line)) // TODO implementar texto rojo con '<'
    .join('\r\n');

/***********************************************************************************/

const genSplitMarker = () => `$${Math.random().toString(20).substr(2, 10)}$`;

const applyTags = async (text, splitMarker, procId) => {
  let cachedTags = await getTags(procId);
  let replacedText = text;

  cachedTags.forEach((tag) => {
    const tagChar = tag.tag.split('')[0];
    const tagCharLength = tag.tag.length;
    const regexString =
      '\\' + tagChar + '{' + tagCharLength + '}(.+?)' + '\\' + tagChar + '{' + tagCharLength + '}';
    const regex = new RegExp(regexString, 'g');

    replacedText = replacedText.replace(
      regex,
      (match, string, offset) =>
        splitMarker +
        tag.op_replacer +
        (string.charAt(0) === '>' ? setGreenText(string) : string) +
        tag.cl_replacer +
        splitMarker
    );
  });

  return replacedText;
};

const getTags = async (procId) => {
  let cachedTags = cache.get('tags');

  if (!cachedTags) {
    const Tag = require('../models/Tag');
    Tag.procId = procId;
    const tags = await Tag.getAll();

    if (tags.length === 0) return text;

    cache.set('tags', tags);
    cachedTags = tags;
  }

  return cachedTags;
};

const setQuotes = async (replacedText, splitMarker, procId) => {
  let quotes = new Map();

  let quotedPosts = replacedText.match(/(>{2}(\d+))/g);
  let quotedIds = [];

  if (quotedPosts)
    for (const qp of quotedPosts) {
      const post_id = qp.replace('>>', '');
      quotedIds.push(post_id);

      const Post = require('../models/Post');
      Post.procId = procId;

      const post = await Post.get(post_id);

      quotes.set(
        qp,
        `${splitMarker}<a href='/${post.board[0].uri}/t${post.thread_id}#p${post_id}'>${qp}</a>${splitMarker}`
      );
    }

  let linkedBoard = replacedText.match(/(>{3}((\/\w+\/)))/g);
  if (linkedBoard)
    for (const lb of linkedBoard) {
      const board_uri = lb.replace('>>>', '');

      quotes.set(lb, `${splitMarker}<a href='${board_uri}'>${lb}</a>${splitMarker}`);
    }

  if (quotes.size > 0)
    for (const [quoted, quote] of quotes) replacedText = replacedText.replace(quoted, quote);

  return { textWq: replacedText, quotedIds };
};

const setGreenText = (text, splitMarker) =>
  `<span class='greentext'>${text
    .replace('>', '&#62;')
    .replace(splitMarker || '', '')
    .replace(splitMarker || '', '')}</span>`;

module.exports = { apply, strip };
