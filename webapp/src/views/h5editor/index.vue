<template>
  <div class="editor">
    <HeaderEdit :goback="dialogSave" @saveSuccess="showPreView=true" :perViewAction="save"/>
    <section class="section">
      <Overview class="overview" />
      <Page class="canvas" :elements="editorPage.elements" :editorElement="element" :selectedElement="selectedElement" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }" />
      <div class="control-panel">
        <div class="funcs">
          <el-tooltip  effect="dark" content="添加背景" placement="left">
            <button class="func" @click="togglePanel(0)" :class="{ active: panelState === 0 }" >
              <i class="iconfont" style="font-size: 18px;">&#xe622;</i>
            </button>
          </el-tooltip>
          <el-tooltip  effect="dark" content="新建文本" placement="left">
            <button class="func el-icon-edit" @click="togglePanel(1)" :class="{ active: panelState === 1 }"></button>
          </el-tooltip>
          <el-tooltip  effect="dark" content="新建素材" placement="left">
            <button class="func el-icon-picture" @click="togglePanel(2)" :class="{ active: panelState === 2 }"></button>
          <el-tooltip  effect="dark" content="添加音乐" placement="left">
          </el-tooltip>
            <button class="func" @click="togglePanel(3)" :class="{ active: panelState === 3 }" >
              <i class="iconfont">&#xe63e;</i>
            </button>
          </el-tooltip>
          <el-tooltip  effect="dark" content="播放动画" placement="left">
            <button class="func el-icon-caret-right" @click="playAnimate"></button>
          </el-tooltip>
          <el-tooltip  effect="dark" content="保存" placement="left">
            <button class="func el-icon-upload" @click="save"></button>
          </el-tooltip>
        </div>
        <div class="wrapper custom-scrollbar">
          <!-- 设置背景 0 -->
          <div class="panel panel-bg" v-show="panelState === 0">
            <BgPanel :themeId="themeId" :editorPage="editorPage" :elements="editorPage.elements"/>
          </div>
          <!-- 添加文字 1 -->
          <div class="panel panel-text" v-show="panelState === 1">
            <div class="btn" @click="addTextElement('title')" style="font-size: 32px; font-weight: bold;">插入标题</div>
            <div class="btn" @click="addTextElement('plain')">插入文本</div>
          </div>
          <!-- 添加元素 2 -->
          <div class="panel panel-element clearfix" v-show="panelState === 2">
            <ImgPanel :themeId="themeId" :selectedImg="addPicElement" type="elementImg"/>
          </div>
          <!-- 添加背景音乐 3 -->
          <div class="panel panel-music" v-show="panelState === 3">
            <MusicPanel ref="musicPanel"/>
          </div>
          <!-- 图层编辑面板 -->
          <EditPanel :element="element" :editorPage="editorPage" :panelState="panelState" v-show="panelState > 10"/>
        </div>
      </div>
    </section>
    <PreView :itemId="itemId" @hideView="showPreView=false" v-if="showPreView"/>
  </div>
</template>

<script>
  import tools from '../../util/tools'
  import Overview from './overview'
  import Page from '../../components/Page'
  import PicPicker from '../../components/PicturePicker'
  import PreView from '../../components/PreView'
  import HeaderEdit from '../../components/HeaderEdit'
  import EditPanel from '../../components/EditPanel'
  import SvgPanel from '../../components/SvgPanel'
  import ImgPanel from '../../components/ImgPanel'
  import MusicPanel from '../../components/MusicPanel'
  import BgPanel from '../../components/BgPanel'
  import appConst from '../../util/appConst'

  export default {
    data () {
      return {
        itemId: null,
        panelState: 0,
        canvasWidth: 320,
        canvasHeight: 504,
        dialogSaveBeforeBack: false,
        picBase64: '',
        http: appConst.BACKEND_DOMAIN,
        releaseUrl: '',
        showPreView: false,
        isLoadingPreview: false
      }
    },
    watch: {
      element () {
        let ele = this.$store.state.editor.editorElement
        let type = ele ? ele.type : 'null'
        switch (type) {
          case 'text':
            this.panelState = 11
            break
          case 'icon':
          case 'pic':
            this.panelState = 12
            break
          case 'bgColor':
          case 'bg':
            this.panelState = 0
            break
        }
      }
    },
    computed: {
      themeId () {
        return this.$store.state.editor.editorTheme._id
      },
      editorPage () {
        return this.$store.state.editor.editorPage
      },
      element () {
        let ele = this.$store.state.editor.editorElement
        return ele || {}
      },
      editorTheme () {
        return this.$store.state.editor.editorTheme
      }
    },
    methods: {
      dialogSave () {
        return Promise.resolve().then(() => this.save()).then(() => this.$router.replace('themeList'))
      },
      getPicList (_id) {
        this.$store.dispatch('getPicListByThemeId', _id)
      },
      addPicElement (ele) {
        // if (ele) {
        let obj = {}
        obj.type = 'pic'
        obj.top = 0
        obj.left = 0
        obj.width = ele.width
        obj.height = ele.height
        obj.imgSrc = ele.filePath
        obj.loop = ele.loop
        this.$store.dispatch('addElement', obj)
        // } else {
        //   this.$store.dispatch('addElement', this.element)
        // }
        this.element.type = 'pic'
      },

      addBG (file) {
        this.$store.dispatch('addBGElement', { type: 'bg', imgSrc: file.filePath })
      },
      cleanBG () {
        this.$store.dispatch('cleanBG')
      },
      cleanEle () {
        this.$store.dispatch('cleanEle', this.element)
      },
      addTextElement (type) {
        let param = {}
        param['type'] = 'text'
        param['text'] = '请输入文本'
        param['width'] = this.canvasWidth
        param['lineHeight'] = 1.5
        switch (type) {
          case 'plain':
            break
          case 'title':
            param['fontSize'] = 32
            param['fontWeight'] = 'bold'
            param['textAlign'] = 'center'
            break
          default:
        }
        this.$store.dispatch('addElement', param)
      },
      playAnimate () {
        this.$store.dispatch('playAnimate')
      },
      save () {
        this.$refs.musicPanel.saveMusic()
        return this.$store.dispatch('saveTheme', tools.vue2json(this.$store.state.editor.editorTheme)).then(() => {
          if (this.$store.state.editor.editorPage.isValidURL) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '请检查URL',
              type: 'error'
            })
          }
        })
      },
      deploy () {
        this.isLoadingPreview = true
        this.$store.dispatch('saveTheme', tools.vue2json(this.$store.state.editor.editorTheme)).then(() => {
          setTimeout(() => {
            this.showPreView = true
            this.isLoadingPreview = false
          }, 1000)
        })
      },
      selectedElement (element) {
        this.$store.dispatch('setEditorElement', element)
      },
      deleteListener (event) {
        if (event.keyCode === 8 && event.target.nodeName !== 'INPUT' && event.target.nodeName !== 'TEXTAREA') {
          this.deleteElement()
        }
      },
      deleteElement () {
        this.$store.dispatch('deleteSelectedElement')
      },
      togglePanel (code) {
        this.panelState = code
      }
    },
    components: {
      Overview, Page, PicPicker, appConst, PreView, HeaderEdit, EditPanel, SvgPanel, ImgPanel, MusicPanel, BgPanel
    },
    mounted () {
      this.itemId = this.$route.query.itemId
      if (this.itemId) {
        if (!this.pages) {
          this.$store.dispatch('getPageByThemeId', this.itemId)
        }
        this.getPicList(this.itemId)
      } else {
        this.$store.dispatch('createTheme')
        this.$store.dispatch('addPage')
        this.$store.dispatch('cleanPicList')
      }
      this.$store.dispatch('cleanBgList')
      document.addEventListener('keyup', this.deleteListener)
      window.onbeforeunload = () => false
    },
    destroyed () {
      document.removeEventListener('keyup', this.deleteListener)
      window.onbeforeunload = null
    }
  }

</script>

<style lang="less" scoped>
  .editor {
    background-color: #eaedef;
    position: relative;
    height: 100%;
    overflow: hidden;
    user-select: none;
  }

  .section {
    position: absolute;
    left: 0;
    right: 0;
    top: 60px;
    bottom: 0;
    overflow: hidden;
  }

  .overview {
    position: absolute;
    left: 0;
    width: 160px;
    height: 100%;
    z-index: 10;
  }

  .canvas {
    position: absolute !important;
    top: 50%;
    left: 50%;
    transform: translate(-75%, -50%);
    border: 2px solid #373f42;
    box-shadow: 0px 2px 30px 5px rgba(0,0,0,0.2);
    box-sizing: content-box;
  }

  .control-panel {
    position: absolute;
    width: 300px;
    height: 100%;
    right: 0;
    top: 0;
    border-left: 1px solid #d6d6d6;
    background-color: #ececec;
    z-index: 10;
    .funcs {
      position: absolute;
      left: -50px;
      top: 0;
      width: 50px;
      .func {
        color: #b2bcba;
        background: #fff;
        cursor: pointer;
        margin-top: 20px;
        display: block;
        width: 50px;
        height: 50px;
        border: 1px solid #d6d6d6;
        border-radius: 3px 0px 0px 3px;
        &:hover {
           color: #000;
         }
        &.active {
           border-right: 1px solid #ececec;
           background-color: #ececec;
           color: #000;
        }
      }
    }
    .wrapper {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
    }
    .panel {
      position: absolute;
      left: 0;
      top: 0;
      min-height: 100%;
      width: 100%;
      padding: 10px;
      z-index: 2;
      background-color: #ececec;
    }
    .panel-bg {
      clear:both;
    }
    .panel-text {
      .btn {
        height: 50px;
        line-height: 50px;
        text-align: center;
        border: 2px solid transparent;
        &:hover {
           cursor: pointer;
           border-color: #04b9c4;
        }
      }
    }
  }
</style>
