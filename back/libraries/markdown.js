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

const genSplitMarker = () => `$${Math.random().toString(20).substr(2, 10)}$`;

// const setQuotes = async (replacedText, splitMarker) => {
//   let quotes = new Map();

//   let quotedPosts = replacedText.match(/(>{2}(\d+))/g);
//   let quotedIds = [];

//   if (quotedPosts)
//     for (const qp of quotedPosts) {
//       const post_id = qp.replace('>>', '');
//       quotedIds.push(post_id);

//       quotes.set(
//         qp,
//         `${splitMarker}<a href='/${post.board[0].uri}/t${post.thread_id}#p${post_id}'>${qp}</a>${splitMarker}`
//       );
//     }

//   let linkedBoard = replacedText.match(/(>{3}((\/\w+\/)))/g);
//   if (linkedBoard)
//     for (const lb of linkedBoard) {
//       const board_uri = lb.replace('>>>', '');

//       quotes.set(
//         lb,
//         `${splitMarker}<a href='${board_uri}'>${lb}</a>${splitMarker}`
//       );
//     }

//   if (quotes.size > 0)
//     for (const [quoted, quote] of quotes)
//       replacedText = replacedText.replace(quoted, quote);

//   return { textWq: replacedText, quotedIds };
// };

// const setLinks = (replacedText) =>
//   replacedText.replace(
//     /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
//     (match, string, offset) =>
//       `<a target='_blank' href='https://${match}'>${match}</a>`
//   );

module.exports = { tags };
