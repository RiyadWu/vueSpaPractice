import { log } from './ac-utils'

// 本地数据缓存
const DATAPOOL = {
    /**
    *   wsi的数据结构
    *   {
            username: [{
                imageId,
                imageName,
                percentage
            }, ...]
    *   }
    */
    wsi: {},
    /**
    *   region的数据结构
    *   {
            username: [{
                sectionId,
                sectionName,
                user    // 添加这个参数是为了方便拼接html
            }, ...]
    *   }
    *   针对某张图片的region请求，单独处理数据
    */
    region: {},
}

class DataPool {
    static setWSI(wsi) {
        DATAPOOL.wsi = wsi
    }
    static getWSI() {
        return DATAPOOL.wsi
    }
    static getWsiNames(username) {
        // 输出小写名称
        const imgNames = []
        DATAPOOL.wsi[username].forEach((imgObjs) => {
            imgNames.push(imgObjs.imageName.toLowerCase())
        })
        return imgNames
    }
    static setRegion(regions) {
        DATAPOOL.regions = regions
    }
    static getRegion() {
        return DATAPOOL.regions
    }
}
export { DataPool }
