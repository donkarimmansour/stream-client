import { ApiEndpoints } from "../utils/apiEndPoints"
import API from "./api"

const config = {
    headers : {
       "Content-Type" : "application/json" 
    }  
}

const GetDestination = async (id) => {
    return  await  API.get(`${ApiEndpoints.DestinationEndpoints.route}${ApiEndpoints.DestinationEndpoints.get}/${id}` , config )
}

export {
    GetDestination
}