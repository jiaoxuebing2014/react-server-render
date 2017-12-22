import axios from 'axios';
import {GLOBAL_API_DOMAIN} from './config';

axios.defaults.baseURL = GLOBAL_API_DOMAIN;

/*if (Util.getLocalStorageInfo('MALL_ACCESS_TOKEN')) {
    axios.defaults.headers.common['Authorization'] = Util.getLocalStorageInfo('MALL_ACCESS_TOKEN').token;
}*/

export default axios;
