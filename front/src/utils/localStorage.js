const getTheme = () => {
  if (!localStorage.theme) setDefaultTheme();

  return localStorage.getItem('theme');
};

const setCss = (css) => {
  localStorage.setItem('css', css);

  return localStorage.getItem('css');
};

const getCss = () => localStorage.getItem('css');

const setDefaultTheme = () => {
  localStorage.setItem('theme', 'default');
  localStorage.setItem('css', null);
};

const addHiddenThread = (thread_id) => {
  let hiddenThreads = getHiddenThreads();
  hiddenThreads.push(thread_id);

  localStorage.setItem('hiddenThreads', hiddenThreads);
};

const removeHiddenThread = (thread_id) => {
  let hiddenThreads = getHiddenThreads();

  localStorage.setItem(
    'hiddenThreads',
    hiddenThreads.filter((threadId) => threadId !== thread_id)
  );
};

const isThreadHidden = (thread_id) => getHiddenThreads().includes(thread_id);

const getHiddenThreads = () => {
  if (!localStorage.hiddenThreads) localStorage.setItem('hiddenThreads', '');

  const hiddenThreads = localStorage.getItem('hiddenThreads');

  return hiddenThreads !== '' ? hiddenThreads.split(',').map((threadId) => parseInt(threadId)) : [];
};

const addHiddenPost = (post_id) => {
  let hiddenPosts = getHiddenPosts();
  hiddenPosts.push(post_id);

  localStorage.setItem('hiddenPosts', hiddenPosts);
};

const removeHiddenPost = (post_id) => {
  let hiddenPosts = getHiddenPosts();

  localStorage.setItem(
    'hiddenPosts',
    hiddenPosts.filter((postId) => postId !== post_id)
  );
};

const isPostHidden = (post_id) => getHiddenPosts().includes(post_id);

const getHiddenPosts = () => {
  if (!localStorage.hiddenPosts) localStorage.setItem('hiddenPosts', '');

  const hiddenPosts = localStorage.getItem('hiddenPosts');

  return hiddenPosts !== '' ? hiddenPosts.split(',').map((postId) => parseInt(postId)) : [];
};

module.exports = {
  getTheme,
  setCss,
  getCss,
  addHiddenThread,
  removeHiddenThread,
  isThreadHidden,
  addHiddenPost,
  removeHiddenPost,
  isPostHidden,
  getHiddenThreads,
  getHiddenPosts,
};
