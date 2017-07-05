import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import logo from './logo.ico';
// import './App.css';
// import './doctor-student.css'
// import BasicExample from './basicexample'
// import Upload from './upload'
// import $ from 'jquery'

import { log } from './ac-utils'
import { UserCls } from './users-info'
import { Ajax } from './ajax-request'
import { DataPool } from './data-pool'
import { PageData } from './paginationplugin-data'
import { Fit } from './fit-window-size'

// import '../lib/jquery.pagination.js'

// console.log("无法使用PAGE:", Page)

function loadAllusers() {
    Ajax.loadCustomers(UserCls.saveCustomers)
}
function removeUploadFun() {
    $("#file-picker").remove()
    $(".file-picker-outter").remove()
    $("#upload-button").remove()
    $(".upload-filename").remove()
}
function addUploadFun() {
    $(".file-picker-outter").removeClass("hhide")
    $("#upload-button").removeClass("hhide")
}
function removeMainFun() {
    $(".all-clips").removeClass("hhide")
    $(".view-title").remove()
}
function addMainFun() {
    $(".all-clips").removeClass("hhide")
    $(".view-title").removeClass("hhide")
    // log("addMainFun中已获得全部全部用户", UserCls.getCustomers())
    addCustomerWSIBtn()
}
function addCustomerWSIBtn() {
    const users = UserCls.getCustomers()
    let html= ""
    users.forEach((customer) => {
        const tempHtml = `<button class="${customer}" type="button">${customer}</button>`
        html += tempHtml
    })
    $(".view-function-list").append(html)
}

function bindDefaultEvents() {
    function checkChinese(val){
        let result = false
        const reg = new RegExp("[\\u4E00-\\u9FFF]+", "g")
        if(reg.test(val)){
            result = true
        }
        return result
    }
    // 所有箭头动画
    $(".tag-search").on("click", function() {
        $(this).find("icon").toggleClass("rotate-135")
    })
    $(".setting").on("click", function() {
        $(this).find("icon").toggleClass("rotate-135")
    })
    $(".user-block").on("click", function() {
        $(this).find("icon").toggleClass("rotate-135")
    })
    //  全屏遮罩关闭 -- 切片预览
    $(".report-close").click(function() {
        $(".report-popup").addClass("hhide")
        // $("html").removeClass("dontscroll")
    })

    // 上传文件的数据
    $(".upload").click(function() {
        var s = document.forms[0].file.value;
        if(s  === "") {
            // alertify.error('不能上传空文件！')
        }else {
            $("#upload-form").submit()
        }
    })
    // 选择文件的数据验证
    $("#file-picker").change(function(){
        // 文件名 以小写来验证
        const input = document.getElementById('file-picker')
        const suffix = ['svs', 'tif', 'vms', 'vmu', 'ndpi', 'scn', 'mrxs', 'tiff', 'bif']
        let uploadedFiles = []
        if(UserCls.getRole()==2) {
            uploadedFiles = DataPool.getWsiNames(UserCls.getName())
        }
        for (let i = 0; i < input.files.length; i++) {
            const fileName = input.files[i].name.toLowerCase()
            if(checkChinese(fileName)) {
                alertify.error('不支持中文命名!')
                document.getElementById("file-picker").value = ""
                $(".upload-filename").addClass("hhide").html("")
                return
            }
            const fileSuffix = input.files[i].name.substring(input.files[i].name.lastIndexOf('.')+1).toLowerCase()
            const suffixResult = suffix.some((x) => {return x === fileSuffix})
            const nameResult = uploadedFiles.every((file) => {
                return file !== fileName})
            if (!suffixResult) {
                // alertify.alert("出错啦！", "暂不支持该文件类型！")
                document.getElementById("file-picker").value = ""
                $(".upload-filename").addClass("hhide").html("")
                // alertify.error('不支持的文件类型！')
            } else if(!nameResult) {
                document.getElementById("file-picker").value = ""
                $(".upload-filename").addClass("hhide").html("")
                // alertify.error('不能上传重复的文件！')
            } else {
                // alertify.notify('文件选择成功！', 'success', 5, function(){ /* do nothing */ })
                $(".upload-filename").html(fileName).removeClass("hhide")
            }
        }
    })
    $(".file-picker-outter").click(function() {
        $("#file-picker").click()
    })
    // 左侧 mainfunction 功能列表
    // !!! 这里是控制数据过滤的部分，要保存当时的targetUser
    // ------------------- 未完成
    $(".view-function-list button").click(function() {
        var target = $(this)
        const users = UserCls.getCustomers()
        // 允许重复点击
        // if(target.hasClass("active")) {
        //   console.log("已经生效！")
        //   return
        // } else
        if(target.hasClass("all-wsi")) {
            UserCls.resetTarget()
            showWSI()
        } else if(target.hasClass("all-clips")) {
            UserCls.resetTarget()
            showRegion()
        } else {
            users.forEach((user) => {
                if(target.hasClass(user)) {
                    UserCls.setTarget(user)
                    // log("保存target是否正确:", user)
                    showWSI()
                }
            })
        }

        target.siblings("button").removeClass("active")
        target.addClass("active")
    })
}
function loadPrepData() {
    // loadWSI和section是必须要在主线程上加载的
    let idNameTable = {}
    Ajax.loadWSI((data) => {
        idNameTable = data
    })
    let wsiRatio = {}
    // if(UserCls.getRole() == 2) { // 只有管理员才能访问这个接口
    Ajax.loadWSIRatio((data) => {
        wsiRatio = data
    })
    // }
    const parsedWSI = uniformWSIData(idNameTable, wsiRatio)
    DataPool.setWSI(parsedWSI)

    // 然后要读取所有region信息，丢到后台去异步操作
    // 如果异步数据出错，那么就改到绑定上检测page内有没有数据
    // 不加上权限判断 ***********************
    sync(function() {
        let regions = {}
        Ajax.loadRegion((data) => {
            regions = data
        })
        // log("regions", regions)
        const parsedRegion = uniformRegionData(regions)
        DataPool.setRegion(parsedRegion)
    })
}

function formWSIHtml() {
    const datas = PageData.getWSI()
    // log("formWSIHtml取得的数据",datas)
    const length = datas.length
    const numPerPage = PageData.getMaxBlocks()
    // 注意，末位不取到，所以显示 10 个就是 0 - 10
    const targetPage = PageData.getWsiPage()
    let startNum = 0
    if(targetPage != 0) {
        startNum = (targetPage - 1) * numPerPage
    }
    let endNum = startNum + numPerPage
    if(endNum > length) {
        endNum = length
    }
    const start = startNum
    const end = endNum
    // 如果要显示不同 就在这里 处理几种情况
    let imgBlocks = ""
    if(UserCls.getRole()==2 && UserCls.getTarget()==UserCls.getName()) {
        // log('管理员点击 all wsi, 有删除有比率 --> 总视野数量')
        for(let i = start; i < end; i++) {
            const imageId = datas[i].imageId
            const imageName = datas[i].imageName
            const percentage = datas[i].percentage
            const numRegion = percentage.slice(percentage.indexOf("/") + 1, percentage.length)
            const imgblock =  `
          <div class="img-block">
          <div onclick="window.open('/image/${imageId}')" style="background-image: url(/image/${imageId}/8/0_0.jpeg)" class="img-bg" title=查看病理图详细></div>
          <div class="wsi-template">
          <p onclick="window.open('/image/${imageId}')" class="wsi-name" title=查看病理图详细>
          ${imageName}
          </p>
          <span data-id='${imageId}' class="wsi-del" title=删除病理图>删除</span>
          <p class="wsi-regions" title=视野个数>${numRegion}</p>
          <a href="javascript:void(0);" data-id='${imageId}' data-image='${imageName}' class='wsi-preview' title=截图截图>视野截图</a>
          </div>
          </div>`
            imgBlocks += imgblock
        }
    } else {
        // if(UserCls.getRole()==2 && UserCls.getTarget()!=UserCls.getName()) {
        // log('管理员点击其他用户的wsi，无删除，有比率')
        for(let i = start; i < end; i++) {
            const imageId = datas[i].imageId
            const imageName = datas[i].imageName
            const percentage = datas[i].percentage
            const imgblock =  `
          <div class="img-block">
          <div onclick="window.open('/image/${imageId}')" style="background-image: url(/image/${imageId}/8/0_0.jpeg)" class="img-bg" title=查看病理图详细></div>
          <div class="wsi-template">
          <p onclick="window.open('/image/${imageId}')" class="wsi-name" title=查看病理图详细>
          ${imageName}
          </p>
          <p class="wsi-percentage" title=已被标记比例>${percentage}</p>
          <a href="javascript:void(0);" data-id='${imageId}' data-image='${imageName}' class='wsi-preview' title=截图截图>视野截图</a>
          </div>
          </div>`
            imgBlocks += imgblock
        }
    }
    // else if(UserCls.getRole()!=2 && UserCls.getTarget()==UserCls.getName()) {
    //     // log('普通用户登录，无删除，无比率')
    //     for(let i = start; i < end; i++) {
    //       const imageId = datas[i].imageId
    //       const imageName = datas[i].imageName
    //       const imgblock =  `
    //       <div class="img-block">
    //       <div onclick="window.open('/image/${imageId}')" style="background-image: url(/image/${imageId}/8/0_0.jpeg)" class="img-bg" title=查看病理图详细></div>
    //       <div class="wsi-template">
    //       <p onclick="window.open('/image/${imageId}')" class="wsi-name" title=查看病理图详细>
    //       ${imageName}
    //       </p>
    //       <a href="javascript:void(0);" data-id='${imageId}' data-image='${imageName}' class='wsi-preview' title=截图截图>视野截图</a>
    //       </div>
    //       </div>`
    //       imgBlocks += imgblock
    //     }
    // }
    return imgBlocks
}
function bindWSIEvent() {
    // 这里需要修改
    const e = $(".wsi-preview")
    e.click(function() {
        const target = $(this)
        const WSI_ID = target.data("id")
        const WSI_name = target.data("image")
        //
        showRegionByWsi(WSI_ID, WSI_name)
        // 这里取消掉 左侧选择
        $(".view-function-list button").removeClass("active")
    })
    // 双击图像进入链接
    // const imgBg = $(".img-bg")
    // imgBg.dblclick(function() {
    //   const target = $(this).parent().find(".wsi-image")
    //   console.log("target", target.attr("href"))
    //   location.href = target.attr("href")
    // })
    // 点击删除后删除图像
    const del = $(".wsi-del")
    del.click(function() {
        // 弹出 确认框
        const imageId = $(this).data("id")
        // alertify.confirm('警告', '确定要删除病理图吗？', function(){
        //     Ajax.delWSI(imageId, function() {
        //         alertify.success('删除病理图成功！')
        //         this.deleteWsiAndReload(imageId)
        //     })
        // }, function() {})
    })
}
function addWSIHtml(html) {
    $(".main-section-outer").html(html)
    bindWSIEvent()
}
function formRegionHtml() {
    const datas = PageData.getRegion()
    // log("formRegionHtml",datas)
    const length = datas.length
    const numPerPage = PageData.getMaxRegions()
    // 注意，末位不取到，所以显示 10 个就是 0 - 10
    const targetPage = PageData.getRegionPage()
    let startNum = 0
    if(targetPage != 0) {
        startNum = (targetPage - 1) * numPerPage
    }
    let endNum = startNum + numPerPage
    if(endNum > length) {
        endNum = length
    }
    const start = startNum
    const end = endNum
    // 如果要显示不同 就在这里 处理几种情况
    let regionBlocks = ""
    for(let i = start; i < end; i++) {
        const sectionId = datas[i].sectionId
        const sectionName = datas[i].sectionName
        const sectionUser = datas[i].user
        const sName = sectionName.slice(0, 20)

        const regionblock =  `
            <div class="img-block clip-block">
                <div style="background-image: url(/section/${sectionId}.thms.png)" class="img-bg"></div>
                <span class="clip-user-name">${sectionUser}</span>
                <a class="clip-link" href="javascript:void(0);" data-user='${sectionUser}' data-id='${sectionId}'>截图预览</a>
                <div class="clip-info">
                    ${sName}
                </div>
            </div>`
        regionBlocks += regionblock
    }
    return regionBlocks
}
function bindRegionEvent() {
    // region 标记的预览弹出框
    $(".clip-link").click(function() {
        const e = $(this)
        const id = e.data("id")
        //   这是原本的手动 popup 层
        //   $(".report-popup .report-img").attr("src", url)
        //   $(".report-popup").removeClass("hhide")
        const regionIds = getRegionPreviewData()
        const initNum = regionIds.indexOf(id)
        // 判断插件是否已经开启
        const isClose = $("body .viewer-container").length == 0
        if(isClose) {
            openViewerPlugin(regionIds, initNum)
        }
        // 触发插件的事件
        $(".viewer-plugin-images img").eq(initNum).click()

        addCommentParts()
    })
}
function addRegionHtml(html) {
    $(".main-section-outer").html(html)
    bindRegionEvent()
}

/**
 *  这里是插件部分
 */
function clearAllPlugins() {
    $(".M-box").remove()
    // $(".clip-view-head").remove() // 也许跟后退键有关
}
function openPagePlugin(regionOrWSI) {
    const type = regionOrWSI.toLowerCase()
    let numAllShow
    let numPerPage
    if(type == "region") {
        numAllShow = PageData.getRegion().length
        numPerPage = PageData.getMaxRegions()
        $('.M-box').pagination({
            homePage: '<<',
            endPage: '>>',
            prevContent: '<',
            nextContent: '>',
            keepShowPN: true,
            // 总共 的项目数量
            totalData: numAllShow,
            // 每一页 显示多少个数据
            showData: numPerPage,
            coping: true,
            jump: true,
            callback: function(api){
                const targetPage = api.getCurrent()
                PageData.setRegionPage(targetPage)
                showStoredRegion()
            }
        })
    } else if(type == "wsi") {
        numAllShow = PageData.getWSI().length
        numPerPage = PageData.getMaxBlocks()
        $('.M-box').pagination({
            homePage: '<<',
            endPage: '>>',
            prevContent: '<',
            nextContent: '>',
            keepShowPN: true,
            // 总共 的项目数量
            totalData: numAllShow,
            // 每一页 显示多少个数据
            showData: numPerPage,
            coping: true,
            jump: true,
            callback: function(api){
                // 初始化不会被调用
                const targetPage = api.getCurrent()
                // log("PAGE:", targetPage)
                PageData.setWsiPage(targetPage)
                showStoredWSI()
            }
        })
        // 只能在这里高亮了
        const storedPage = PageData.getWsiPage()
        const currentPage = getActiveNum()
        if(storedPage!=0 && currentPage!=storedPage) {
            // 显示storedPage
            $(".M-box").find(`[data-page='${storedPage}']`).click()
        }
    }
}
function getActiveNum() {
    var num = $(".M-box").find(".active").html()
    return Number(num)
}
// 注意，paginationplugin 这里只能用M-box的名称
function addCommentParts() {

}
function addPaginationPlugin(type) {
    clearAllPlugins()
    $("body").append(`<div class="M-box"></div>`)
    openPagePlugin(type)
}
function getRegionPreviewData() {
    const datas = []
    $(".clip-block > .clip-link").each(function() {
        const id = $(this).data("id")
        datas.push(id)
    })
    return datas
}
function resetViewerDiv(regionIds) {
    let viewerHtml = ""
    regionIds.forEach((id) => {
        const tempHtml = `<img class="hhide" src="/section/${id}.thml.png" alt="Preview-Region">`
        viewerHtml += tempHtml
    })
    $(".viewer-plugin-images").html(viewerHtml)
}
function openViewerPlugin(regionIds, initNum) {
    resetViewerDiv(regionIds)
    $(".viewer-plugin-images").viewer({
        zoomRatio: 0.3,
    })
}

function deletePoolWsi(imageId) {
    const raw = DataPool.getWSI()
    log("DataPoolraw:", raw)
    const admin = UserCls.getName()
    const adminWsi = raw[admin]
    const delData = adminWsi.filter((wsiObj) => {
        return wsiObj.imageId !== imageId
    })
    raw[admin] = delData
    DataPool.setWSI(raw)
}
function deletePageWsi(imageId) {
    const raw = PageData.getWSI()
    log("PageDataraw:", raw)
    const delData = raw.filter((wsiObj) => {
        return wsiObj.imageId !== imageId
    })
    PageData.setWSI(delData)
}
function deleteWsiAndReload(imageId) {
    deletePoolWsi(imageId)
    deletePageWsi(imageId)
    showStoredWSI()
    addPaginationPlugin("WSI")
}
function showViewHeader(WSI_name) {
    const html = `
        <div class="clip-view-head">
            <button class="back vertical-center" type="button" name="button"><< 返回上级 <<</button>
            <span class="clip-view-title">${WSI_name}</span>
         </div>`
    $(".main-section-outer").prepend(html)
    // 这里不一定来得及查找元素
    $(".back").click(function() {
        showStoredWSI()
        addPaginationPlugin("WSI")
        // 还要恢复mainfunction区域的高亮
        const currentUser = UserCls.getName()
        const targetUser = UserCls.getTarget()
        if(currentUser==targetUser) {
            $(".all-wsi").addClass("active")
        } else {
            $(".view-function-list").find(`.${targetUser}`).addClass("active")
        }
    })
}
// @username 只保留该用户对应数据
function showWSI() {
    deliverWsiToPegination()
    PageData.setWsiPage(0)
    showStoredWSI()
    addPaginationPlugin("WSI")
}
function showRegion() {
    const regionData = DataPool.getRegion()
    deliverRegionToPegination(regionData)
    PageData.setRegionPage(0)
    showStoredRegion()
    addPaginationPlugin("Region")
}
// ###这个方法需要能回退到上次操作
function showRegionByWsi(WSI_ID, WSI_name) {
    Ajax.loadRegionByWSI(WSI_ID, function(datas) {
        const parsedDatas = uniformRegionData(datas)
        // 这组数据不保存，直接放入plugin里面
        // DataPool.setRegionByWsi(parsedDatas)
        // const regionData = DataPool.getRegionByWsi()
        deliverRegionToPegination(parsedDatas)
        PageData.setRegionPage(0)
        showStoredRegion()
        addPaginationPlugin("Region")
        // 这里要增加 回退按键绑定事件 和 原始图片名称
        showViewHeader(WSI_name)

    })
}
// 显示保存的记录
function showStoredWSI() {
    const html = formWSIHtml()
    addWSIHtml(html)
}
function showStoredRegion() {
    const html = formRegionHtml()
    addRegionHtml(html)
}
/**
 * ---- 这里是一些实用方法 ----
 */
// 解决同步问题方案，后台异步读取数据
function sync(fun) {
    setTimeout(function() {
        fun()
    }, 0)
}
// --------------------
function noneRegionFilter(wsiArr) {
    const arr = wsiArr.filter((imgObj) => {
        const firstChar = imgObj.percentage.slice(0, 1)
        if(firstChar == '0') {
            return false
        }
        return  true
    })
    return arr
}
function deliverWsiToPegination() {
    const role = UserCls.getRole()
    const target = UserCls.getTarget()
    const currentUser = UserCls.getName()
    let imgArr = DataPool.getWSI()[target]
    // 仅当管理员显示普通用户wsi时，需要过滤
    if(role==2 && currentUser!=target) {
        imgArr = noneRegionFilter(imgArr)
    }
    PageData.setWSI(imgArr)
}
function deliverRegionToPegination(regionDatas) {
    const target = UserCls.getTarget()
    const currentUser = UserCls.getName()
    const role = UserCls.getRole()
    let regionArr = []
    if(role==2 && target==currentUser) {
        // 管理员不过滤
        const regionData = regionDatas
        Object.keys(regionData).forEach((username) => {
            regionData[username].forEach((regionObj) => {
                regionArr.push(regionObj)
            })
        })
    } else {
        // 只要目标用户数据
        regionArr = regionDatas[target]
    }
    // log("deliverRegionToPegination：", regionArr)
    PageData.setRegion(regionArr)
}
function uniformWSIData(idNameTable, wsiRatio) {
    // { user:[] }
    const allImages = {}
    // 上面的 []
    let imgArr = []
    if(UserCls.getRole() == 2) {
        Object.keys(wsiRatio).forEach((username) => {
            Object.keys(wsiRatio[username]).forEach((imageId) => {
                const subImg = {}
                subImg.imageId = imageId
                subImg.imageName = idNameTable[imageId]
                subImg.percentage = wsiRatio[username][imageId]
                imgArr.push(subImg)
            })
            allImages[username] = imgArr
            imgArr = []
        })
        // log("管理员处理后wsi: ", allImages)
    } else {
        const username = UserCls.getName()
        Object.keys(wsiRatio).forEach((imageId) => {
            const subImg = {}
            subImg.imageId = imageId
            subImg.imageName = idNameTable[imageId]
            subImg.percentage = wsiRatio[imageId]
            imgArr.push(subImg)
        })
        allImages[username] = imgArr
        // log("普通用户处理后wsi: ", allImages)
    }
    return allImages
}
function uniformRegionData(regions) {
    // { user:[] }
    const allRegions = {}
    // 上面的 []
    let regionArr = []
    if(UserCls.getRole() == 2) {
        Object.keys(regions).forEach((username) => {
            Object.keys(regions[username]).forEach((secId) => {
                const subRegion = {}
                subRegion.sectionId = secId
                subRegion.sectionName = regions[username][secId]
                subRegion.user = username
                regionArr.push(subRegion)
            })
            allRegions[username] = regionArr
            regionArr = []
        })
        // log("管理员处理后Region: ", allRegions)
    } else {
        const username = UserCls.getName()
        Object.keys(regions).forEach((secId) => {
            const subRegion = {}
            subRegion.sectionId = secId
            subRegion.sectionName = regions[secId]
            subRegion.user = username
            regionArr.push(subRegion)
        })
        allRegions[username] = regionArr
        // log("普通用户处理后Region: ", allRegions)
    }
    return allRegions
}
function fitWindowSize() {
    PageData.setMaxBlocks(Fit.getTotalBlocks())
    PageData.setMaxRegions(Fit.getTotalRegions())
}
// 初始化页面的主要逻辑
function initUserInterface() {
    removeUploadFun()
    removeMainFun()
    loadPrepData()
    showWSI()
    //最后绑定默认事件
    bindDefaultEvents()
}
function initMasterInterface() {
    // 管理员特有：请求所有用户的信息
    loadAllusers()   // 想要显示什么用户就可以过滤这里的结果或者更改接口
    addUploadFun()
    addMainFun()
    loadPrepData()
    showWSI()
    // 最后绑定默认事件
    bindDefaultEvents()
}
function __main() {
    // 其他页面需要
    UserCls.saveUser()
    fitWindowSize()
    if(UserCls.getRole() == 2) {
        // log("管理员 登录")
        initMasterInterface()
    } else {
        // log("非管理员 登录")
        initUserInterface()
    }
}

class App extends Component {

    constructor() {
        super(...arguments)
    }

    componentDidMount() {
        __main()
    }



    logOut() {
        window.location.href='/logout'
    }



  render() {

    return (
        <div>
          <nav>
            <div className="user-block">
              <img src="\static\images\默认头像.svg" alt="" />
              <span style={{'fontWeight': 500,'WebkitFontSmoothing': "antialiased"}}> Noname??? </span>
              <icon className="vertical-center rotate-45"></icon>
            </div>

            <div className="toolbar">
              <form id="upload-form" action="/image/upload" method="POST" encType="multipart/form-data">
                  <div style={{width: '80px'}} className="logout" onClick={this.logOut} title="登出">
                    <img src="/static/images/doctor-nav-black/logout.png" alt="登出" />
                    <span style={{float:"right","marginRight":'8px',position: "relative",top: "45%",transform: "translateY(-50%)"}}>登出</span>
                  </div>
                  <div style={{width:"110px"}} className="upload btn btn-default purple darken-4 hhide" type="submit" id="upload-button" title="上传图片">
                    <img src="/static/images/doctor-nav-black/上传.png" alt="上传" />
                    <img className="hhide" src="/static/images/doctor-nav-white/上传_1.png" alt="上传" />
                    <span style={{float:"right","marginRight":"8px",position: "relative",top: "45%",transform: "translateY(-50%)"}}>上传图片</span>
                  </div>
                  <div style={{width:"110px"}} className="file-picker-outter hhide" title="选择图片">
                    <img src="/static/images/doctor-nav-black/标记显示.png" alt="文件选择" />
                    <span style={{float:"right","marginRight":"8px",position: "relative",top: "45%",transform: "translateY(-50%)"}}>选择图片</span>
                  </div>
                  <input id="file-picker" className="hhide" type="file" name="file" multiple />
                  <div className="upload-filename hhide"></div>
              </form>

            </div>
          </nav>

          <aside>
            <div className="view-function-list">
              <button className="all-wsi active" type="button">全部病理图</button>
              <button className="all-clips hhide" type="button">已导出视野截图</button>
              <span className="view-title hhide">学生</span>
            </div>

          </aside>

          <div className="main-section-outer"></div>

          <div className="report-popup hhide">
              <button className="left-btn" type="button"> 左 </button>
              <button className="right-btn" type="button"> > </button>
            <div className="report-mask"></div>
            <div className="report-con">
              <img className="report-img" src="" alt="" />
              <img className="report-close" src="/static/images/homepage/cross-light.png" alt="" />
            </div>
          </div>

          <div className="viewer-plugin-images"></div>

          {/* <BasicExample /> */}

        </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
// export default App;
