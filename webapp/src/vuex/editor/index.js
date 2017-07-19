import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'

const state = {
  editorElement: {}, // 正在编辑的元素
  editorPage: {
    elements: []
  }, // 正在编辑的页面
  themeList: [], // 用户所有主题列表
  editorTheme: {
    title: '蓝月亮',
    description: '蓝月亮',
    canvasHeight: 504,
    musicLink: null,
    musicName: null
  }, // 正在编辑的主题
  picList: [], // 图片列表
  musicList: [], // 音乐列表
  musicPlaying: true // 音乐播放
}

export default{
  state,
  getters,
  actions,
  mutations
}
