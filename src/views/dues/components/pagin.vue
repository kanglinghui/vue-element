<template>
    <div class="plgintions">
        <div class="top">
            <div>
                <span>{{title}}</span>
            </div>
            <div>
                <span>每页展示： 100 / 200 / 300</span>
            </div>
        </div>
        <slot></slot>
        <div class="bottom">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :pager-count="5"
                :page-size="show?page_size:size"
                layout="prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
            <!-- <div class="right">
                <el-input v-model="num" placeholder="请输入每页展示条数" style="width:100px;" size="mini"></el-input>
                <el-button type="danger" size="mini" @click="btn">确定</el-button>
            </div> -->
    </div>
</template>
<script>
export default {
    name:'pagin',
    props:{
        size:{
            type:Number,
            default:10,
        },
        total:{
            type:Number,
            default:1000
        },
        user:{
            type:String
        }
    },
    data(){
        return {
            num:null,
            page_size:0,
            val:1,
            title:'角色',
            show:false,
            currentPage:1
        }
    },
    methods:{
        handleSizeChange(val){
            console.log(12,val);
        },
        handleCurrentChange(val){
            this.val = val;
            let obj = {};
            obj.val = val;
            obj.size = this.show ? this.page_size : this.size;
            obj.user = this.user;
            this.$emit('changePage',obj);
        },
        btn(){
            if(!this.num){
                return;
            }
            if(!parseInt(this.num)){//如果是字符就是NaN NaN == false
                this.$message({
                    message: '输入格式有误,请输入数值',
                    type: 'warning'
                });
            }
            if(this.num > this.total){
                this.$message({
                    message: '输入每页展示条数过大',
                    type: 'warning'
                });
            }
            this.page_size = parseInt(this.num);
            this.show = true;
            let obj = {};
            obj.val = this.val;
            obj.size = this.page_size;
            obj.user = this.user;
            this.$emit('changePage',obj);
        }
    }
}
</script>
<style lang="scss" scoped>
    .plgintions{
        padding:2px 0;
        .top{
            height:30px;
            display: flex;
            justify-content: space-between;
        }
    }
</style>