import { log } from './ac-utils'

class Fit {
    static getTotalBlocks() {
        const line = getMaxBlocks()
        const row = getMaxRows()
        return line * row
    }
    static getTotalRegions() {
        const line = getMaxBlocks()
        const row = getMaxRegionRows()
        return line * row
    }
}
function getMaxBlocks() {
  const windowWidth = window.innerWidth
  // var blockWidth = $(".main-section-outer .section").css("width")
  const bodyWidth = $("body").css("width")
  const padding = Number(bodyWidth.slice(0, bodyWidth.length - 2)) * 0.06
  let blockWidth = $(".main-section-outer").css("width")
  blockWidth = Number(blockWidth.slice(0, blockWidth.length - 2)) - padding
  let itemWidth
  let max
  if(windowWidth <= 1440) {
    itemWidth = 200 + 30
  } else if (windowWidth <= 1920) {
    itemWidth = 240 + 60
  } else {
    itemWidth = 280 + 80
  }
  max = Math.floor(blockWidth / itemWidth)
  return max
}
function getMaxRows() {
  const windowWidth = window.innerWidth
  const blockHeight = window.innerHeight - 163
  let itemHeight
  let max
  if(windowWidth <= 1366) {
    itemHeight = 200 + 10
  } else if(windowWidth <= 1440) {
    itemHeight = 200 + 40
  } else if (windowWidth <= 1920) {
    itemHeight = 243 + 60
  } else {
    itemHeight = 273 + 60
  }
  max = Math.floor(blockHeight / itemHeight)
  return max
}
function getMaxRegionRows() {
  const windowWidth = window.innerWidth
  const blockHeight = window.innerHeight - 163
  let itemHeight
  let max
  if(windowWidth <= 1440) {
    itemHeight = 151 + 60
  } else if (windowWidth <= 1920) {
    itemHeight = 181 + 60
  } else {
    itemHeight = 211 + 80
  }
  max = Math.floor(blockHeight / itemHeight)
  return max
}

export { Fit }
