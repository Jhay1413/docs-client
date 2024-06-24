import axios from "axios";

export async function get(url: string, params?:Object,) {
  return await axios.get(url,params).then((res) => res);
}
export async function post(url: string, params?:Object) {
  return await axios.post(url, params).then((res) => res);
}
export async function del(url:string,params?:Object){
  return await axios.delete(url,params).then((res)=>res)
}
export async function put(url:string,params?:Object){
  return await axios.put(url,params).then((res)=>res.data)
}