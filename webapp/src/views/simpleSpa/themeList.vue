<template>
  <div>
    <HeaderBar/>
    <div class="my-themes">
      <div class="container">
        <div class="btn-create" @click="create">
          创建作品
        </div>
        <div class="theme-list">
          <table>
            <colgroup>
              <col width="200" />
              <col width="400" />
              <col width="200" />
              <col width="150" />
            </colgroup>
            <tr>
              <th>标题</th>
              <th>描述</th>
              <th>链接</th>
              <th>操作</th>
            </tr>
            <template v-for="item in list">
              <tr>
                <td>
                  {{item.title}}
                </td>
                <td>
                  {{item.description}}
                </td>
                <td>
                  {{BACKEND_DOMAIN + '/pages/' + item._id + '.html'}}
                </td>
                <td>
                  <a href="javascript:;" @click="toEditor(item)">编辑</a>
                  <a href="javascript:;" @click="showPreView(item._id)">预览</a>
                  <a href="javascript:;" @click="deleteTheme(item)">删除</a>
                </td>
              </tr>
            </template>
            
          </table>
          
        </div>
      </div>
    </div>
    <PreView :itemId="itemId" @hideView="isShowPreView=false" v-if="isShowPreView"/>
  </div>
</template>

<script>
  import HeaderBar from '../../components/HeaderBar'
  import tools from '../../util/tools'
  import PreView from '../../components/PreView'
  import appConst from '../../util/appConst'
  export default {
    data () {
      return {
        isShowPreView: false,
        itemId: null,
        BACKEND_DOMAIN: appConst.BACKEND_DOMAIN
      }
    },
    computed: {
      list () {
        return this.$store.state.editor.themeList
      }
    },
    mounted () {
      this.$store.dispatch('getUserThemeList', 'simple')
    },
    methods: {
      toEditor (item) {
        this.$store.dispatch('setEditorTheme', item)
        this.$store.dispatch('setEditorPage', item.pages[0])
        this.$router.replace({ path: '/simpleSpaeditor', query: { itemId: item._id } })
      },
      deleteTheme (item) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('deleteTheme', item)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      create () {
        this.$store.dispatch('createTheme', 'simple')
        this.$store.dispatch('addPage')
        let $this = this
        this.$store.dispatch('saveTheme', tools.vue2json(this.$store.state.editor.editorTheme)).then(() => {
          this.$router.replace({ path: '/simpleSpaeditor', query: { itemId: $this.$store.state.editor.editorTheme._id } })
        })
      },
      showPreView (itemId) {
        this.isShowPreView = true
        this.itemId = itemId
      },
      open (itemId) {
        window.open(appConst.BACKEND_DOMAIN + '/pages/' + itemId + '.html')
      }
    },
    components: {
      HeaderBar, PreView
    }
  }
</script>

<style lang="less" scoped>
  .my-themes {
    width: 100%;
    height: 100%;
    .btn-create{
      width:120px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color:#fff;
      background-color: #4A90E2;
      border-radius: 5px;
      margin: 0 0 20px 20px;
      cursor: pointer;
    }
  }

  .my-themes .container {
    width: 1024px;
    margin: 0 auto;
    padding-top: 20px;
  }

  .my-themes .theme-list {
    overflow: hidden;
    padding:0 20px;
    table{
      width:100%;
      th{
        border:1px solid #d9d9d9;
        padding:10px 5px;
        background-color: #eee;
        text-align: center;
      }
      td{
        border:1px solid #d9d9d9;
        padding:10px 5px;
        font-size:12px;
      }
      a{
        color:#4A90E2;
        margin-right: 5px;
      }
      a:hover{
        text-decoration: underline;
      }
    }
    
  }

  .theme-item {
    width: 230px;
    height: 328px;
    float: left;
    margin-right: 20px;
    margin-bottom: 20px;
    background: #fff;
  }

  .theme-item .thumb img {
    width: 100%;
    height: 230px;
  }
  .thumb {
    position: relative;
    .cover {
      display: none;
      position: absolute;
      background: #000;
      opacity: 0.5;
      width: 100%;
      height: 100%;
      top:0;
      .toolbar {
        color: #fff;
        text-align: right;
        cursor: pointer;
        padding: 10px;
        font-size: 18px;
        i {
          margin: 5px;
        }
      }
      .preview {
        text-align: center;
        margin-top:70px;
        span {
          border: 1px solid #fff;
          padding: 5px 10px;
          font-size: 20px;
          color: #fff;
          cursor: pointer;
        }
      }
      .preview.openlink{
        margin-top:20px;
      }
    }
  }
  .thumb:hover {
    .cover {
      display: block;
    }
  }
  .theme-item .footer {
    height: 98px;
    padding: 10px;
    background-color: #fff;
    box-sizing: border-box;
    position: relative;
  }

  .theme-item .footer > .title {
    color: #4a4a4a;
    font-size: 14px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .theme-item .footer > .content {
    color: #83817b;
    margin-top: 12px;
    font-size: 14px;
    max-height: 40px;
    overflow: hidden;
    line-height: 1.5;
  }
  .footer .delete {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }

  .theme-item.create {
    text-align: center;
  }

  .theme-item.create .create-area p {
    font-size: 20px;
    cursor: pointer;
    margin: 100px auto 0 auto;
    color:#f50;
  }
</style>
