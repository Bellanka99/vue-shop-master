<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <el-row>
        <el-col :span="4" class>
          <el-button type="primary" @click="showAddCateDialogVisible">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 数据表 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        show-index
        index-text="编号"
        border
        :expand-type="false"
        :selection-type="false"
        :show-row-hover="false"
        class="treeTable"
      >
        <!-- 是否有效 -->
        <template slot="isvalid" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" type="primary" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="primary" size="mini">二级</el-tag>
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operate" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row.cat_id)"
          >编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateById(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10 ,20, 30, 50, 100]"
        :page-size="queryInfo.pagesize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options用来指定数据源 -->
          <!-- props 指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            ref="elcascader"
            @visible-change="elCascaderOnlick"
            @expand-change="elCascaderOnlick"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类的对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="50%">
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10//每页多少条要与pagesize对应上
      },
      catelist: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template', //定义为模板列
          template: 'isvalid' //模板名称
        },
        {
          label: '排序',
          type: 'template', //定义为模板列
          template: 'sort' //模板名称
        },
        {
          label: '操作',
          type: 'template', //定义为模板列
          template: 'operate', //模板名称
          width: '200px'
        }
      ],
      addCateDialogVisible: false,
      // 添加分类对象
      addCateForm: {
        // 将要添加分类名称
        cat_name: '',
        // 分类父级id
        cat_pid: 0,
        // 分类等级：`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [], //分类父级数据列表
      // 指定级联选择器的配置对象
      cascaderProps: {
        // 配置触发选项 hover/click
        expandTrigger: 'hover',
        checkStrictly: true, //设置父子节点取消选中关联，从而达到选择任意一级选项的目的。
        // lazy: true,//赖加载
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [], //选中父级分类ID数组
      // 编辑对话框 控制
      editCateDialogVisible: false,
      // 编辑分类表单验证
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 编辑表单 绑定对象
      editCateForm: ''
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取商品分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      //   console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }

      this.catelist = res.data.result
      this.total = res.data.total
    },
    //监听pagesize事件,每页显示条目个数
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    //监听当前页数事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    //显示添加分类对话框
    showAddCateDialogVisible() {
      //获取父级分类
      this.getParentCateList()
      //显示对话框
      this.addCateDialogVisible = true
    },
    //获取父级分类列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.parentCateList = res.data
      // console.log(this.parentCateList)
    },
    //选择项发生改变出发这个函数
    parentCateChange() {
      // console.log(this.selectedKeys)
      //this.selectedKeys数组中的长度大于0 说明有父级分类，则反之
      if (this.selectedKeys.length > 0) {
        //父级分类id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        //为当前分类等级父级
        this.addCateForm.cat_level = this.selectedKeys.length

        return
      } else {
        //父级分类id=0
        this.addCate.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    //添加分类请求
    addCate() {
      console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }

        this.$message.success('添加分类成功')
        //刷新数据表
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    //监听对话框关闭事件,重置表单
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    elCascaderOnlick() {
      let that = this
      //第二种js方法：点击文字时自动选中radio标签
      setInterval(function() {
        document.querySelectorAll('.el-cascader-node__label').forEach(el => {
          el.onclick = function() {
            if (this.previousElementSibling) this.previousElementSibling.click()
            that.$refs.elcascader.dropDownVisible = false
          }
        })
        //自动收起下拉框问题
        document
          .querySelectorAll('.el-cascader-panel .el-radio')
          .forEach(el => {
            el.onclick = function() {
              that.$refs.elcascader.dropDownVisible = false //监听值发生变化就关闭它
            }
          })
      }, 2000)
    },
    //点击编辑事件
    async showEditDialog(cat_id) {
      const { data: res } = await this.$http.get(`categories/${cat_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // this.$message.success(res.meta.msg)

      this.editCateForm = res.data
      this.editCateDialogVisible = true
    },
    //编辑提交分类事件
    eidtCate() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        console.log(this.editCateForm)
        //提交要修改的分类数据
        const { data: res } = await this.$http.put(
          'categories/' + this.editCateForm.cat_id,
          {cat_name: this.editCateForm.cat_name } 
        )

        if (res.meta.status !== 200) {
          return this.$message.error('更新失败！')
        }
        this.$message.success('更新成功')
        //刷新数据
        this.getCateList()
        //关闭对话框
        this.editCateDialogVisible = false
      })
    }, 
    //删除分类事件
    async removeCateById(cat_id){
       const confirmResult = await this.$confirm(
        '此操作将永久删除该项, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      //如果确认删除返回confirm,取消返回cancel
      if (confirmResult != 'confirm') {
        return this.$message.info('已取消删除')
      }

      //发起删除数据请求
      const { data: res } = await this.$http.delete('categories/' + cat_id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败')
      }

      this.$message.success('删除分类成功')
      //刷新数据表
      this.getCateList()
    }
  }
}
</script>


<style lang="less" scoped>
.treeTable {
  margin-top: 18px;
}
.el-cascader {
  width: 100%;
}

/*第一种css方法：使用css将小圆圈变透明然后覆盖在整个文字上方，点击文字的时候其实是在点击小圈圈。*/
/*以下样式将单选框隐藏，并绝对定位与文字内容一样大小，这样点击时可以点击整行文字*/
.el-cascader-panel .el-radio {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
  top: 10px;
  right: 10px;
  line-height: 34px;
}
// .el-cascader-panel .el-radio__inner{
//  position:absolute;
//  z-index:10;
//  padding:0 10px;
//  width:132px;
//  height:34px;
//  line-height:34px;
// }
.el-cascader-panel .el-radio__input {
  visibility: hidden;
}
.el-cascader-panel .el-input-node__postfix {
  top: 10px;
}
</style>