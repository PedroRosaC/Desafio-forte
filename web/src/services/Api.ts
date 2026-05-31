import axios from "axios";

export const Api = axios.create({
    baseURL: process.env.REACT_APP_API_URL ?? "", // Não há necessidade de por url aqui pois o proxy do package.json já redireciona as chamadas para a porta correta
});
// Não há necessidade de por url aqui pois o proxy do package.json já redireciona as chamadas para a porta correta
