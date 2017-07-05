import { log } from './ac-utils'

// 对于sessionStorage.user的操作集合
// 有一个隐患，如果sessionStorage被更改，会导致后续页面显示问题
//            如果USER被更改，会导致判断异常，但是api可以保证数据安全
class UserCls {
    // 需要一个全局变量，结构如下
    // 管理员才有customers
    // const USER = {
    //   name: '{{ username }}',
    //   id: '{{ user_id }}',
    //   role: '{{ user_role }}',
    //   target: '{{ username }}',
    //   customers: '数组'
    // }

    // 这里相当于是传递 参数 给后续的页面了
    static saveUser() {
        sessionStorage.user = JSON.stringify(USER)
    }
    static getId() {
        return USER.id
    }
    static getName() {
        return USER.name
    }
    static getRole() {
        return USER.role
    }
    static getRole() {
        return USER.role
    }
    static getTarget() {
        return USER.target
    }
    static setTarget(target) {
        USER.target = target
        UserCls.saveUser()
    }
    static resetTarget() {
        USER.target = USER.name
        UserCls.saveUser()
    }
    static getCustomers() {
        return USER.customers
    }
    static saveCustomers(cus) {
        USER.customers = cus
        UserCls.saveUser()
    }
}

export { UserCls }
