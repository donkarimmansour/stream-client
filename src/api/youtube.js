import { ApiEndpoints } from "../utils/apiEndPoints"
import API from "./api"

const config = {
    headers : {
       "Content-Type" : "application/json" 
    }  
}

const YtAuthorize = async (data) => {
    return  await  API.post(`${ApiEndpoints.YoutubeEndpoints.route}${ApiEndpoints.YoutubeEndpoints.authorize}`, data , config )
}

// const UpdateYtDestination = async (data) => {
//     return  await  API.post(`${ApiEndpoints.YoutubeEndpoints.route}${ApiEndpoints.YoutubeEndpoints.update}`, data , config )
// }


const CreateYtBroadcast = async (data) => {
    return  await  API.post(`${ApiEndpoints.YoutubeEndpoints.route}${ApiEndpoints.YoutubeEndpoints.broadcast}` , data , config )
}

const YtEnd = async (data) => {
    return  await  API.post(`${ApiEndpoints.YoutubeEndpoints.route}${ApiEndpoints.YoutubeEndpoints.end}` , data , config )
}

const YtViewCount = async (data) => {
    return  await  API.post(`${ApiEndpoints.YoutubeEndpoints.route}${ApiEndpoints.YoutubeEndpoints.viewCount}` , data , config )
}

const YtLive = async (data) => {
    return  await  API.post(`${ApiEndpoints.YoutubeEndpoints.route}${ApiEndpoints.YoutubeEndpoints.live}` , data , config )
}


const RemoveYt = async (id) => {
    return  await  API.post(`${ApiEndpoints.YoutubeEndpoints.route}${ApiEndpoints.YoutubeEndpoints.remove}`, {id} , config )
}

const YtRefresh = async (data) => {
    return  await  API.post(`${ApiEndpoints.YoutubeEndpoints.route}${ApiEndpoints.YoutubeEndpoints.refresh}` , data , config )
}





export { YtLive , YtAuthorize , CreateYtBroadcast ,  YtViewCount , YtEnd , YtRefresh , RemoveYt }