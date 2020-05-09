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

  return replacedText;
};

module.exports = { apply };
