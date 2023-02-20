import { ApiEndpoints } from "../utils/apiEndPoints"
import API from "./api"

const config = {
    headers : {
       "Content-Type" : "application/json" 
    }  
}

const Register = async (email) => {
    return  await  API.post(`${ApiEndpoints.UserEndpoints.route}${ApiEndpoints.UserEndpoints.register}`, {email} , config )
}

const Login = async (email) => {
    return  await  API.post(`${ApiEndpoints.UserEndpoints.route}${ApiEndpoints.UserEndpoints.login}`, {email} , config )
}

const compareCode = async (data) => {
    return  await  API.post(`${ApiEndpoints.UserEndpoints.route}${ApiEndpoints.UserEndpoints.compare}`, data , config )
}

const UpdateUser = async (data) => {
    return  await  API.post(`${ApiEndpoints.UserEndpoints.route}${ApiEndpoints.UserEndpoints.update}`, data , config )
}

const AccessUser = async (id) => {
    return  await  API.get(`${ApiEndpoints.UserEndpoints.route}${ApiEndpoints.UserEndpoints.access}/${id}` , config )
}

const UserWentLive = async (data) => {
    return  await  API.post(`${ApiEndpoints.UserEndpoints.route}${ApiEndpoints.UserEndpoints.UserWentLive}` , data , config )
}


export {
    Register , Login , compareCode , UpdateUser , AccessUser , UserWentLive
}