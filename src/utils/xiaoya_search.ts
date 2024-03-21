import axios from "axios"
import { SearchNode } from "~/types"
import { xiaoya_prefix } from "~/utils/config"

const getWebContent = async (box: string, type: string): Promise<string> => {
  const proxyUrl = "/xiaoya/search" // 代理服务器地址，与 vue.config.js 中配置的路径一致
  const params = {
    // 这里是你要传递的参数
    box: box,
    type: type,
  }
  const response = await axios.get(proxyUrl, { params })
  return response.data
}

export const xiaoyaSearch = async (
  box: string,
  type: string,
  scope: number,
): Promise<SearchNode[]> => {
  const searchResults: SearchNode[] = []
  const webContent = await getWebContent(box, type)
  // 使用DOM操作或正则表达式等提取<ul>标签中的内容
  const parser = new DOMParser()
  const doc = parser.parseFromString(webContent, "text/html")
  let divOutsideForm = doc.querySelector("div:not(form)")
  let ulElement = divOutsideForm?.querySelector("ul")
  if (ulElement) {
    const listItems = ulElement.querySelectorAll("a")
    listItems.forEach((li) => {
      let content = li.textContent
      if (content) {
        content = xiaoya_prefix + content
        let name: string = ""
        let parent: string = ""
        // 截取子字符串，获取路径，文件名
        let lastIndex: number = content.lastIndexOf("/")
        if (lastIndex !== -1) {
          parent = content.substring(0, lastIndex)
          name = content.substring(lastIndex + 1, content.length)
        }
        // 支持范围搜索
        let isDir = !name.includes(".")
        if (scope == 0 || (scope == 1 && isDir) || (scope == 2 && !isDir)) {
          searchResults.push({
            is_dir: isDir,
            name: name,
            parent: parent,
            path: content,
            size: 0,
            type: getFileType(isDir, name),
          })
        }
      }
    })
  }
  return searchResults
}

export const getFileType = (isDir: boolean, name: string): number => {
  if (isDir) {
    return 1
  }
  const videoType = ["mp4", "mkv", "avi", "mov", "rmvb", "webm", "flv"]
  const musicType = ["mp3", "flac", "ogg", "m4a", "wav", "opus", "wma"]
  const txtType = [
    "txt",
    "htm",
    "html",
    "xml",
    "java",
    "properties",
    "sql",
    "js",
    "md",
    "json",
    "conf",
    "ini",
    "vue",
    "php",
    "py",
    "bat",
    "gitignore",
    "yml",
    "go",
    "sh",
    "c",
    "cpp",
    "h",
    "hpp",
    "tsx",
    "vtt",
    "srt",
    "ass",
    "rs",
    "lrc",
  ]
  const imageType = [
    "jpg",
    "tiff",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "svg",
    "ico",
    "swf",
    "webp",
  ]
  let split = name.split(".")
  let suffix = split[split.length - 1]
  switch (suffix) {
  }
  if (videoType.includes(suffix)) {
    return 2
  } else if (musicType.includes(suffix)) {
    return 3
  } else if (txtType.includes(suffix)) {
    return 4
  } else if (imageType.includes(suffix)) {
    return 5
  }
  return 0
}
