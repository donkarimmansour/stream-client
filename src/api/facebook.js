import { ApiEndpoints } from "../utils/apiEndPoints"
import API from "./api"

const config = {
    headers : {
       "Content-Type" : "application/json" 
    }  
}

const AuthorizeFB = async (data) => {
    return  await  API.post(`${ApiEndpoints.FacebookEndpoints.route}${ApiEndpoints.FacebookEndpoints.authorize}`, data , config )
}

const RemoveFB = async (id) => {
    return  await  API.post(`${ApiEndpoints.FacebookEndpoints.route}${ApiEndpoints.FacebookEndpoints.remove}`, {id} , config )
}

const CreateFbBroadcast = async (data) => {
    return  await  API.post(`${ApiEndpoints.FacebookEndpoints.route}${ApiEndpoints.FacebookEndpoints.broadcast}` , data , config )
}

const FbPermalink = async (data) => {
    return  await  API.post(`${ApiEndpoints.FacebookEndpoints.route}${ApiEndpoints.FacebookEndpoints.permalink}` , data , config )
}

const FbEnd = async (data) => {
    return  await  API.post(`${ApiEndpoints.FacebookEndpoints.route}${ApiEndpoints.FacebookEndpoints.end}` , data , config )
}

const FbViewCount = async (data) => {
    return  await  API.post(`${ApiEndpoints.FacebookEndpoints.route}${ApiEndpoints.FacebookEndpoints.viewCount}` , data , config )
}

export { AuthorizeFB , RemoveFB , CreateFbBroadcast , FbPermalink , FbEnd , FbViewCount }