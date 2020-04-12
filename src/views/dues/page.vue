<template>
    <div class="page">
        <Silde :fold="fold" @silde="admin($event)"/>
        <!-- <p>组织结构管理</p> -->
        <transition name="slide-fade">
        <div class="table" v-show="admin_text">
            <span>{{admin_text?admin_text + '管理员:':'暂未选择组织'}}</span>
            <br/>
            <el-button type="danger" @click="add_admin" size="small" style="margin-bottom:20px;">添加管理员</el-button>
                <Pagin :total="100" :size="8" user="page" @changePage="change_page($event)">
                    <div class="table_main" ref="table">
                        <el-table
                            :data="tableData"
                            border
                            :height="height"
                            style="width: 100%;">
                            <el-table-column
                                prop="job_num"
                                align="center"
                                width="150"
                                label="工号">
                            </el-table-column>
                            <el-table-column
                                prop="name"
                                align="center"
                                width="100"
                                label="姓名">
                            </el-table-column>
                            <el-table-column
                                prop="tissue"
                                align="center"
                                label="所在组织">
                            </el-table-column>
                            <el-table-column
                                prop="permissions"
                                align="center"
                                width="60"
                                label="权限">
                            </el-table-column>
                            <el-table-column
                            label="操作"
                            width="50">
                            <template slot-scope="scope">
                                <div style="text-align:center;">
                                    <i class="el-icon-delete" style="color:#ff4949;cursor:pointer;" @click="handleClick(scope.$index, tableData)"></i>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </Pagin>
        </div>
        </transition>
        <div class="dialog">
            <el-dialog
                title="添加管理员"
                :visible.sync="addAdmin"
                width="560px">
                <div class="input">
                    <el-input v-model="job_num" placeholder="输入工号" size="small" style="width:200px;"></el-input>
                    <el-input v-model="user_name" placeholder="输入姓名" size="small" style="width:200px;"></el-input>
                    <el-button type="danger" size="small" @click="smbmit">查询</el-button>
                </div>
                    <Pagin :total="100" :size="7" user="admin" @changePage="change_page($event)">
                        <div class="user_list">
                            <el-table
                                :data="tableDatas"
                                :height="353"
                                border
                                style="width: 100%;">
                                <el-table-column
                                    prop="job_num"
                                    align="center"
                                    label="工号">
                                </el-table-column>
                                <el-table-column
                                    prop="name"
                                    align="center"
                                    label="姓名">
                                </el-table-column>
                                <el-table-column
                                label="操作"
                                width="50">
                                <template slot-scope="scope">
                                    <div style="text-align:center;">
                                        <i class="el-icon-plus" style="color:#ff4949;cursor:pointer;font-weight:bold;" @click="addClick(scope.row)"></i>
                                    </div>
                                </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </Pagin>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addAdmin = false">取 消</el-button>
                    <el-button type="primary" @click="addAdmin = false">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import Silde from './components/silde';
import Pagin from './components/pagin';
export default {
    components:{
        Silde,Pagin
    },
    data(){
        return {
            fold:false,
            height:350,
            admin_text:'',
            job_num:'',
            user_name:'',
            addAdmin:false,
            currentPage3:1,
            timer:null,
            tableData:[
                {job_num:10002711,name:'白延琴',tissue:'计',permissions:'144'},
                {job_num:10002711,name:'白延琴',tissue:'计算数学支部',permissions:'144'},
                {job_num:10002711,name:'白延琴',tissue:'计算数学支部',permissions:'144'},
                {job_num:10002711,name:'白延琴',tissue:'计算数学支部',permissions:'144'},
                {job_num:10002711,name:'白延琴',tissue:'计算数学支部',permissions:'144'},
                {job_num:10002711,name:'白延琴',tissue:'计算数学支部',permissions:'144'},
                {job_num:10002711,name:'白延琴',tissue:'计算数学支部',permissions:'144'},
                {job_num:10002711,name:'白延琴',tissue:'计算数学支部',permissions:'144'},
                {job_num:10002711,name:'白延琴',tissue:'计算数学支部',permissions:'144'},
                {job_num:10002711,name:'白延琴',tissue:'计算数学支部',permissions:'144'},
                {job_num:10002711,name:'白延琴',tissue:'计算数学支部不不不不不不不',permissions:'144'}
            ],
            tableDatas:[
                {job_num:10002711,name:'白延琴'},
                {job_num:10002711,name:'白延琴'},
                {job_num:10002711,name:'白延琴'},
                {job_num:10002711,name:'白延琴'},
                {job_num:10002711,name:'白延琴'},
                {job_num:10002711,name:'白延琴'},
                {job_num:10002711,name:'白延琴'},
            ],
        }
    },
    mounted(){
        this.timer = setTimeout(()=>{
            this.$refs.table.style.height = window.innerHeight - 100 - 135 + 'px';
            this.height = window.innerHeight - 100 - 135;
        },200);
        window.onresize = () => {//监听浏览器窗口大小变化
            return (() => {
                this.height = window.innerHeight - 100 - 135;
                this.$refs.table.style.height = window.innerHeight - 100 - 135 + 'px';
            })();
        };
    },
    destroyed(){
        clearTimeout(this.timer);
    },
    methods:{
        add_admin(){
            console.log(22)
            this.addAdmin = true;
        },
        handleClick(idx,list){
            this.$confirm(`是否删除${list[idx].name}?`, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    list.splice(idx,1)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        smbmit(){
            console.log(111)
        },
        addClick(row){
            console.log(row)
        },
        admin(data){
            this.admin_text = data.label;
            console.log(data)
        },
        change_page(data){
            switch(data.user){
                case 'page':
                    console.log(data);
                    break;
                case 'admin':
                    console.log(data);
                    break;
                default:
                    return false;        
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .slide-fade-enter-active {
        transition: all .3s ease;
    }
    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
        transform: translateX(10px);
        opacity: 0;
    }
    .page{
        min-width:800px;
        .table{
            padding:0 10px;
            margin-left:305px;
            margin-right:0;
            min-width:500px;
            span{
                font-size:12px;
                font-weight: 600;
                line-height: 30px;
                margin-bottom:8px;
            }
            // .table_main{
            //     padding:20px 0 10px 0;
            // }
        }
        .dialog{
            .input{
                display: flex;
                justify-content: space-between;
                padding-bottom:10px;
            }
            .pagin{
                margin-top:8px;
            }
        }
    }
    /deep/ .el-table__body-wrapper::-webkit-scrollbar {display:none}
    /deep/ .el-table__body-wrapper{
            // background-color: rga(0,0,0,0);
        &::-webkit-scrollbar {display:block}
        &::-webkit-scrollbar-track{
            position: absolute;
            border-radius: 1em;
            width:.5px;
            background:rgba(0, 0, 0, 0);
        }
        &::-webkit-scrollbar-thumb{
            position: absolute;
            border-radius: 1em;
            width:.5px;
            background:rgba(0, 0, 0, .3);
        }
    }
</style>