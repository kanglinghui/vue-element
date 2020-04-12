import request from "@/utils/request";

export function Tree(data) {
    return request({
      url: "/vue-element-admin/dues/tree",
      method: "post",
      data
    });
}
export function AdminInfo(data){
    return request({
        url: "/vue-element-admin/dues/adminInfo",
        method: "get",
        params: {data} 
    });
}
export function ScreenInfo(data) {
    return request({
      url: "/vue-element-admin/dues/ScreenInfo",
      method: "post"
    });
}
export function addTree(data){
  return request({
    url:"/vue-element-admin/dues/addtree",
    method:"post",
    data
  })
}