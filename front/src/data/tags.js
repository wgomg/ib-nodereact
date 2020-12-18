import axios from 'axios';

const getAllTags = () => axios.get('/_back/api/tags');

export { getAllTags };
