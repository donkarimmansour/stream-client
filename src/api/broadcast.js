import { ApiEndpoints } from "../utils/apiEndPoints"
import API from "./api"

const config = {
    headers : {
       "Content-Type" : "application/json" 
    }  
}

const CreateBroadcast = async (data) => {
    return  await  API.post(`${ApiEndpoints.BroadcastEndpoints.route}${ApiEndpoints.BroadcastEndpoints.add}` , data , config )
}

const GetBroadcast = async (id) => {
    return  await  API.get(`${ApiEndpoints.BroadcastEndpoints.route}${ApiEndpoints.BroadcastEndpoints.get}/${id}` , config )
}

export { CreateBroadcast , GetBroadcast }