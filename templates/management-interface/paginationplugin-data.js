import { log } from './ac-utils'

// 专提供给插件用的数据存储
const PAGE = {
    /**
        wsi数据结构
        [{
            imageId,
            imageName,
            percentage // maybe undefined
        }, ...]
    */
    maxBlocks: 0,
    wsi: [],
    wsiPage: 0,
    /**
        regions数据结构
        [{
            sectionId,
            sectionName,
            user    // 添加这个参数是为了方便拼接html
        }, ...]
    */
    maxRegions: 0,
    regions: [],
    regionPage: 0

    // totalShowRegions: 0,  // ???
}

class PageData {
    static setWSI(wsi) {
        PAGE.wsi = wsi
    }
    static getWSI() {
        return PAGE.wsi
    }
    static setMaxBlocks(blocks) {
        PAGE.maxBlocks = Number(blocks)
    }
    static getMaxBlocks() {
        return PAGE.maxBlocks
    }
    static setWsiPage(page) {
        PAGE.wsiPage = Number(page)
    }
    static getWsiPage() {
        return PAGE.wsiPage
    }

    static setRegion(regions) {
        PAGE.regions = regions
    }
    static getRegion() {
        return PAGE.regions
    }
    static setMaxRegions(num) {
        PAGE.maxRegions = Number(num)
    }
    static getMaxRegions() {
        return PAGE.maxRegions
    }
    static setRegionPage(page) {
        PAGE.regionPage = Number(page)
    }
    static getRegionPage() {
        return PAGE.regionPage
    }

}
export { PageData }
