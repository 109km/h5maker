<template>
  <header class="header">
    <button class="reset-btn"
            @click="goback"><i class="el-icon-arrow-left"></i>返回作品</button>
    <div class="right-panel">
      <el-button @click="opera"
                 class="preview"
                 type="info"
                 :loading="loading"
                 icon="document" style="margin-left: 10px;">导出Excel</el-button>
      <el-button @click="openChart"
                 class="preview"
                 :loading="loading"
                 icon="date">报表分析</el-button>
    </div>
  </header>
</template>

<script>
  /**
   * Created by Wesdint on 2017/7/14.
   */
import appConst from '../util/appConst'
  export default {
    data () {
      return {
        loading: false
      }
    },
    methods: {
      opera () {
        let formId = this.$route.query.formId
        window.location = appConst.BACKEND_DOMAIN + '/api/downloadExcel/' + formId
      },
      openChart () {
        this.$emit('openChart', true)
      },
      goback () {
        this.$router.replace('formList')
      }
    }
  }
</script>

<style lang="less" scoped>
  .header {
    height: 60px;
    background-color: #373f42;
    color: #fff;
  .reset-btn {
    height: 100%;
    padding: 0 20px;
    cursor: pointer;
  }
  .el-icon-arrow-left {
    margin-right: 20px;
  }
  .right-panel {
    float: right;
    height: 100%;
    width: 100px;
    display: flex;
    align-items: center;
    padding-right: 15px;
    flex-direction: row-reverse;
  }
  }
</style>