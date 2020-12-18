import axios from 'axios';

const getAllBoards = async () =>
  (await axios.get('/_back/api/boards')).data.data;

export { getAllBoards };
