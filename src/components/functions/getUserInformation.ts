import { handleUserInformation } from "../interfaces/handleUserInformationInterface";
import { refreshAccessToken } from "./refreshAccessToken";

export const getUserInformation = async (params: handleUserInformation) => {
    // refresh the access tokens
    await refreshAccessToken(localStorage.refresh_token);

    // url for fetch request
    const url = 'https://spotifyve-backend.herokuapp.com/gettopx?access_token='
    + localStorage.access_token + '&request_type='
    + params.request_type + '&time_range='
    + params.time_range + '&limit='
    + params.limit + '&offset='
    + params.offset;

    // send request for user top 50
    const data = await fetch(url)
        .then(res => { return res.json() })
            .then(res => { return res })
            .catch(err => console.log(err))
        .catch(err => console.log(err));

    return data;
}