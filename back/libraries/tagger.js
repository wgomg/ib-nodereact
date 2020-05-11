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

  cachedTags.forEach((tag) => {
    const tagChar = tag.tag.split('')[0];
    const tagCharLength = tag.tag.length;
    const regexString =
      '\\' + tagChar + '{' + tagCharLength + '}(.+?)' + '\\' + tagChar + '{' + tagCharLength + '}';
    const regex = new RegExp(regexString, 'g');

    replacedText = replacedText.replace(
      regex,
      (match, string, offset) => tag.op_replacer + string + tag.cl_replacer
    );
  });

  let links = new Map();

  let quotedPosts = text.match(/(>{2}(\d+))/g);
  if (quotedPosts)
    for (const qp of quotedPosts) {
      const post_id = qp.replace('>>', '');
      const Post = require('../models/Post');
      Post.procId = procId;
      const post = await Post.get(post_id);

      links.set(qp, `<a href='/${post.board[0].uri}/t${post.thread_id}#p${post_id}'>${qp}</a>`);
    }

  let linkedBoard = text.match(/(>{3}((\/\w+\/)))/g);
  if (linkedBoard)
    for (const lb of linkedBoard) {
      const board_uri = lb.replace('>>>', '');

      links.set(lb, `<a href='${board_uri}'>${lb}</a>`);
    }

  if (links.size > 0)
    for (const [linked, link] of links) replacedText = replacedText.replace(linked, link);

  return replacedText;
};

module.exports = { apply };
