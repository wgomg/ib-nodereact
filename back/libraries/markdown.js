'use strict';

const tags = (post, tags) => {
  const splitMarker = genSplitMarker();
  let taggedPost = post.replace('\n', splitMarker + '<br />' + splitMarker);

  tags.forEach((tag) => {
    const tagChar = tag.tag.split('')[0];
    const tagCharLength = tag.tag.length;
    const tagPosition = tag.position;

    let regexString = '';

    if (tagPosition === 'start' || tagPosition === 'both')
      regexString = '\\' + tagChar + '{' + tagCharLength + '}(.+?)';

    if (tagPosition === 'both' || tagPosition === 'end')
      regexString += '\\' + tagChar + '{' + tagCharLength + '}';
    else if (tagPosition === 'start') regexString += '$';

    const regex = new RegExp(regexString, 'g');

    taggedPost = taggedPost.replace(regex, (match, string) => {
      return (
        tag.prefix_replacer +
        splitMarker +
        string +
        splitMarker +
        tag.postfix_replacer
      );
    });
  });

  const tagsPrefixes = tags.map((tag) => tag.prefix_replacer);
  const tagsPostfixes = tags.map((tag) => tag.postfix_replacer);

  taggedPost = taggedPost
    .split(splitMarker)
    .map((e) =>
      tagsPostfixes.includes(e) ||
      tagsPrefixes.includes(e) ||
      e.includes('<br />')
        ? { html: true, text: e }
        : { html: false, text: e }
    );

  let result = [];
  let tempElement = { ...taggedPost[0] };
  if (taggedPost.length === 1) result.push(tempElement);
  else
    for (let index = 1; index < taggedPost.length; index++) {
      if (tempElement.html === taggedPost[index].html)
        tempElement.text += taggedPost[index].text;
      else {
        result.push(tempElement);
        tempElement = { ...taggedPost[index] };
      }
    }

  return result;
};

// const setLinks = (replacedText) =>
//   replacedText.replace(
//     /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
//     (match, string, offset) =>
//       `<a target='_blank' href='https://${match}'>${match}</a>`
//   );

const genSplitMarker = () => `$${Math.random().toString(20).substr(2, 10)}$`;

module.exports = { tags };
