import { log } from './ac-utils'

// 所有的数据请求
// 记得全部修改成异步的
class Ajax {
    static loadCustomers(callback) {
    // 获得当前组的用户
    // 仅限管理员
        $.ajax({
            type: 'GET',
            url: '/api/groupmember',
            async: false,
            dataType: 'json',
            success: function(datas) {
                callback(datas)
            },
            error: function(error) {
                console.log("error:", error)
            }
        })
    }
    // 获得所有 图片Id & Name
    // 普通用户
    static loadWSI(callback) {
        $.ajax({
          type: 'GET',
          url: '/api/images',
          async: false,
          dataType: 'json',
          success: function(datas) {
              callback(datas)
          },
          error: function(error) {
              console.log("error:", error)
          }
        })
    }
    // 获得 所有用户 图片的 标记的完成度
    // 仅限管理员
    static loadWSIRatio(callback) {
        $.ajax({
            type: 'GET',
            url: '/api/images/section_region_ratio',
            async: false,
            dataType: 'json',
            success: function(datas) {
                callback(datas)
            },
            error: function(error) {
                console.log("error:", error)
            }
        })
    }
    // 获得 已导出的 视野id & 视野名称
    // 不同用户返回数据结构不同！！！
    static loadRegion(callback) {
        $.ajax({
            type: 'GET',
            url: '/api/sections',
            // 这个要去测试是否是 主线程阻塞!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            async: false,
            dataType: 'json',
            success: function(datas) {
                callback(datas)
            },
            error: function(error) {
                console.log("error:", error)
            }
        })
    }
    // 获得 某张图对应 已导出的 视野id & 视野名称
    // 不同用户返回的数据结构不同！！！
    static loadRegionByWSI(wsiId, callback) {
        $.ajax({
            type: 'GET',
            url: `/api/sections/${wsiId}`,
            // async: false,
            dataType: 'json',
            success: function(datas) {
                callback(datas)
            },
            error: function(error) {
                console.log("error:", error)
            }
        })
    }
    // 删除上传的图片
    // 仅管理员
    static delWSI(wsiId, callback) {
        $.ajax({
            type: 'DELETE',
            url: `/api/image/${wsiId}`,
            // async: false,
            success: function(datas) {
                callback(datas)
            },
            error: function(error) {
                console.log("error:", error)
            }
        })
    }
}

export { Ajax }
