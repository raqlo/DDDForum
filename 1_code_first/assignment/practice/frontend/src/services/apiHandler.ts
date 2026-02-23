import axios from "axios";

const apiHandler = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 1000,
});

export {apiHandler}