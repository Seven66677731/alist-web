// api and base_path both don't endsWith /

export let base_path = ""
export const setBasePath = (path: string) => {
  base_path = path
  if (!base_path.startsWith("/")) {
    base_path = "/" + base_path
  }
  if (base_path.endsWith("/")) {
    base_path = base_path.slice(0, -1)
  }
}
if (window.ALIST.base_path) {
  setBasePath(window.ALIST.base_path)
}

export let api = import.meta.env.VITE_API_URL as string
if (window.ALIST.api) {
  api = window.ALIST.api
}
if (api === "/") {
  api = location.origin + base_path
}
if (api.endsWith("/")) {
  api = api.slice(0, -1)
}

export let xiaoya_search = import.meta.env.VITE_XIAOYA_SEARCH_URL as string
if (window.ALIST.api) {
  xiaoya_search = window.ALIST.api
}
if (xiaoya_search === "/") {
  xiaoya_search = location.origin + base_path
}
if (xiaoya_search.endsWith("/")) {
  xiaoya_search = xiaoya_search.slice(0, -1)
}

export let xiaoya_prefix = import.meta.env.VITE_XIAOYA_PREFIX as string
if (!xiaoya_prefix.endsWith("/")) {
  xiaoya_prefix = xiaoya_prefix + "/"
}

export const monaco_cdn =
  window.ALIST.monaco_cdn ||
  "https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/monaco-editor/0.33.0-dev.20220228/min/vs"
