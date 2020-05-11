'use strict';

const cache = require('./cache');

const Tag = require('../models/Tag');

const apply = async (text, procId) => {
  let cachedTags = cache.get('tags');

  if (!cachedTags) {
    Tag.procId = procId;
    const tags = await Tag.getAll();

    if (tags.length === 0) return text;

    cache.set('tags', tags);
    cachedTags = tags;
  }

  let replacedText = text;

  const splitMarker = gensSplitMarker();

  cachedTags.forEach((tag) => {
    const tagChar = tag.tag.split('')[0];
    const tagCharLength = tag.tag.length;
    const regexString =
      '\\' + tagChar + '{' + tagCharLength + '}(.+?)' + '\\' + tagChar + '{' + tagCharLength + '}';
    const regex = new RegExp(regexString, 'g');

    replacedText = replacedText.replace(
      regex,
      (match, string, offset) => splitMarker + tag.op_replacer + string + tag.cl_replacer + splitMarker
    );
  });

  let links = new Map();

  let quotedPosts = text.match(/(>{2}(\d+))/g);
  let quotedIds = [];
  if (quotedPosts)
    for (const qp of quotedPosts) {
      const post_id = qp.replace('>>', '');
      quotedIds.push(post_id);
      const Post = require('../models/Post');
      Post.procId = procId;
      const post = await Post.get(post_id);

      links.set(
        qp,
        `${splitMarker}<a href='/${post.board[0].uri}/t${post.thread_id}#p${post_id}'>${qp}</a>${splitMarker}`
      );
    }

  let linkedBoard = text.match(/(>{3}((\/\w+\/)))/g);
  if (linkedBoard)
    for (const lb of linkedBoard) {
      const board_uri = lb.replace('>>>', '');

      links.set(lb, `${splitMarker}<a href='${board_uri}'>${lb}</a>${splitMarker}`);
    }

  if (links.size > 0)
    for (const [linked, link] of links) replacedText = replacedText.replace(linked, link);

  return { text: replacedText.split(splitMarker), quoted: quotedIds };
};

const gensSplitMarker = () => `$${Math.random().toString(20).substr(2, 10)}$`;

module.exports = { apply };
