<template>
    <div class="user_admin">
        <transition name="slide-fades">
            <Silde :folds="fold" @silde="silde($event)" v-show="fold_"/>
        </transition>
        <transition name="slide-fades">
            <div class="folding" v-show="!fold_" @click="silde_show">
                <i class="el-icon-d-arrow-right"></i>
            </div>
        </transition>
        <transition name="slide-fade">
        <div :class="fold_?'fold_main':'main'" v-show="show">
            <h3 class="title">党员信息管理</h3>
            <div class="header_operation">
                <div class="flex">
                    <el-input v-model="params.job_num" placeholder="请输入工号" size="mini" style="max-width:150px;"></el-input>
                    <el-input v-model="params.name" placeholder="请输入姓名" size="mini" style="margin-left:12px;max-width:150px;"></el-input>
                </div>  
                <div class="flex">
                    <el-button type="danger" size="mini" style="margin-left:12px;" @click="search">搜索</el-button>
                    <el-button type="danger" size="mini" @click="addParty">添加党员</el-button>
                    <el-dropdown trigger="click" style="margin-left:12px;">
                        <el-button type="danger" size="mini">
                            导入/导出<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="Lead(0)">新增导入党员</el-dropdown-item>
                            <el-dropdown-item @click.native="Lead(1)">修改导入党员</el-dropdown-item>
                            <el-dropdown-item @click.native="Lead(2)">删除导入</el-dropdown-item>
                            <el-dropdown-item divided @click.native="educe">导出党员列表</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <Pagin :total="total" :size="10" user="user" @changePage="change_page($event)">
                <div class="table" ref="table">
                    <el-table
                        :data="tableData"
                        :height="height"
                        border
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
                        align="center"
                        label="操作">
                        <template slot-scope="scope">
                            <div style="text-align:center;">
                                <i class="el-icon-edit-outline" style="color:#ff4949;font-size:18px;cursor:pointer;" @click="changeClick(scope.row)"></i>
                                <b class="line"></b>
                                <i class="el-icon-delete" style="color:#ff4949;font-size:18px;cursor:pointer;" @click="handleClick(scope.$index, tableData)"></i>
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
                :visible.sync="dialogVisible"
                width="50%"
                :before-close="handleClose">
                <div class="upload" style="padding:0 30px;">
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-change="file_start"
                        :http-request="uploadFile"
                        :auto-upload="false"
                        :show-file-list="false">
                        <el-button size="small" type="primary" @click="delFile" :loading="loading">选择文件</el-button>
                        <div slot="tip" class="el-upload__tip" style="display:inline-block;margin-left:12px;">{{file_name}}</div>
                    </el-upload>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="close">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog
                :visible.sync="dia_show"
                title="添加党员"
                width="50%"
                id="dialog"
                :before-close="handleClose">
                <div class="dia_input">
                    <el-input v-model="dia_params.job_num" placeholder="请输入工号" size="small"></el-input>
                    <el-input v-model="dia_params.name" placeholder="请输入姓名" size="small" style="margin:0 10px;"></el-input>
                    <div class="organization">
                        <el-input id="locationName" v-model="organization" placeholder="请输入组织" size="small" style="width:250px;"></el-input>
                        <div class="organization_tree" v-show="treeStatus">
                            <el-tree ref="tree" :data="dataList" node-key="key" @node-click="handleNodeClick" :filter-node-method="filterNode"></el-tree>
                        </div>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dia_show = false">取 消</el-button>
                    <el-button type="primary" @click="dia_show = false">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import Silde from './components/silde';
import Pagin from './components/pagin';
import {mapState, mapActions} from 'vuex';
import { AdminInfo,Tree } from '@/api/dues';
export default {
    components:{
        Silde,Pagin
    },
    data(){
        return {
            state:'',
            fold:true,
            show:false,
            margin:true,
            height:0,
            dialogVisible:false,
            dia_show:false,
            file_name:'暂未选择文件',
            fileList:[],
            formData:'',
            loading:false,
            total:0,
            label:'',
            dataList:[],
            treeStatus:false,
            params:{
                job_num:null,
                name:''
            },
            focusStatus:false,
            organization:'',
            dia_params:{
                job_num:null,
                name:'',
            },
            tableData:[
                {job_num:10002711,name:'白延琴',tissue:'计算数学支部'},
                {job_num:10002711,name:'白延琴',tissue:'计算数学支部'},
                {job_num:10002711,name:'白延琴',tissue:'计算数学支部'},
                {job_num:10002711,name:'白延琴',tissue:'计算数学支部'},
                {job_num:10002711,name:'白延琴',tissue:'计算数学支部'},
                {job_num:10002711,name:'白延琴',tissue:'计算数学支部'},
                {job_num:10002711,name:'白延琴',tissue:'计算数学支部'},
                {job_num:10002711,name:'白延琴',tissue:'计算数学支部'},
                {job_num:10002711,name:'白延琴',tissue:'计算数学支部'},
                {job_num:10002711,name:'白延琴',tissue:'计算数学支部'}
            ],
        }
    },
    computed: {
        fold_(){
            let datas = this.$store.state.app.folding;
            return datas;
        }
    },
    watch:{
        organization(val) {
            this.$refs.tree.filter(val);
        },
    },
    directives: {
    focus: {
            inserted: function (el, {value}) {
                if (value) {
                    el.focus();
                }
            }
        }
    },
    mounted(){
        this.ready();
        Tree({a:1}).then((json)=>{
                if(json.code === 20000){
                    this.dataList = json.data.dataList;
                }
            }).catch((err)=>{
                console.log(12,err)
            })
        this.$refs.table.style.height = window.innerHeight - 80 - 82 - 76 + 'px';
        setTimeout(()=>{
            this.height = window.innerHeight - 80 - 82 - 76;
        })
        window.onresize = () => {//监听浏览器窗口大小变化
            return (() => {
                this.$refs.table.style.height = window.innerHeight - 80 - 82 - 70 + 'px';
                this.height = window.innerHeight - 80 - 82 - 76;
            })();
        };
    },
    methods:{
        ready(){
            let elDialog=document.getElementById("dialog")
            elDialog.addEventListener('click',(e)=>{
                let sp3 =document.getElementById("locationName")
                if(sp3.contains(e.target)){
                    this.treeStatus=true
                }else{
                    this.treeStatus=false
                }
            })
        },
        silde_show(){
            this.margin = true;
            this.$store.dispatch("app/changeFolding", true);
        },
        silde(data){
            if(data.children){
                this.show = false;
                return;
            };
            console.log('label',data.babel);
            this.label = data.label;
            AdminInfo({organization:data.label,page:1,size:10}).then((json)=>{
                console.log(json)
                this.show = true;
                this.total = json.total;
                this.tableData = json.data;
            }).catch(err=>console.log(err))
        },
        changeClick(row){
            console.log(row)
        },
        handleClick(idx,list){
            let name = list[idx].name; 
            this.$confirm(`是否删除${name}?`, {
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
        addParty(){//添加党员
            this.dia_show = true;
        },
        search(){//搜索
            let { job_num,name } = this.params;
            console.log(parseInt(job_num))
            if(!job_num && !name){
                this.$message({
                    message: '请至少输入一项进行搜索',
                    type: 'warning'
                });
                return;
            }
            if(!parseInt(job_num)){
                this.$message({
                    message: '工号只能填写数字',
                    type: 'warning'
                });
                return;
            }
            console.log(111)
        },
        Lead(val){
            this.dialogVisible = true;
            switch (val) {
                case 0:
                    console.log(1111);
                    break;
                case 1:
                    console.log(2222);
                    break;
                case 2:
                    console.log(3333);
                    break;    
                default:
                    break;
            }
        },
        educe(){
            console.log('导出')
        },
        file_start(file,fileList){
            console.log(fileList[fileList.length-1])
            this.fileList = [];
            this.fileList.push(fileList[fileList.length-1]);
            this.file_name = fileList[fileList.length-1].name;
            this.submitUpload();
        },
        delFile(){
            this.fileList = [];
        },
        uploadFile(file) {
            console.log(file)
            this.formData.append("file", file.file);
        },
        submitUpload(){
            let formData = new FormData();
            console.log('2222',this.fileList[0])
            formData.append("file", this.fileList[0].raw);
            this.loading = true;
            setTimeout(()=>{
                this.loading = false;
            },2000)
            console.log('上传',formData)
        },
        handleClose(done){
            if(this.loading){
                this.$message({
                    message: '正在上传文件中...',
                    type: 'warning'
                });
                return;
            }
            done();
        },
        close(){
            if(this.loading){
                this.$message({
                    message: '正在上传文件中...',
                    type: 'warning'
                });
                return;
            }
            this.dialogVisible = false;
        },
        change_page(data){
            if(!this.label){
                return;
            }
            if(data.user == 'user'){
                AdminInfo({organization:this.label,page:data.val,size:data.size?data.size:10}).then((json)=>{
                    this.show = true;
                    this.total = json.total;
                    this.tableData = json.data;
                }).catch(err=>console.log(err))
            }
        },
        handleNodeClick(data) {
            console.log(data)
            if(data.children){
                return;
            }
            this.organization = data.label;
            this.treeStatus = false;
        },
        filterNode(value, data){
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        }
    }
}
</script>
<style lang="scss" scoped>
    .slide-fade-enter-active {
        transition: all .8s ease;
    }
    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
        transform: translateX(-10px);
        opacity: 0;
    }

    .slide-fades-enter-active {
        transition: all .8s ease;
    }
    .slide-fades-leave-active {
        transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fades-enter, .slide-fades-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
        transform: translateX(-350px);
        opacity: 0;
    }


    .user_admin{
        min-width: 800px;
        height:100%;
        .folding{
            width:30px;
            text-align:center;
            cursor:pointer;
            position:absolute;
            left:0;
            i{
                transition:.5s;
                padding:5px;
                font-weight:600;
                &:hover{
                    background-color:rgb(211,75,57);
                    color:#fff;
                }
            }
        }
        .main{
            margin-left:30px;
            min-width: 800px;
            padding:0 10px;
            transition:.8s;
            border-left:.5px solid #ccc;
        }
        .fold_main{
            margin-left:305px;
            min-width: 500px;
            padding:0 10px;
            transition:.8s;
        }
        .header_operation{
            display: flex;
            justify-content: space-between;
            padding:6px 0;
            .flex{
                display:flex;
                flex-direction:row;
            }
        }
        .title{
            font-size:14px;
            line-height:30px;
            margin:0;
            border-bottom:.5px solid #ccc;
        }
        .line{
            border:.5px solid #ff4949;
            margin:0 8px;
        }
        .dia_input{
            display:flex;
            justify-content:space-between;
            .organization{
                position:relative;
                .organization_tree{
                    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    position:relative;
                    left:0;
                    top:15px;
                    background-color: #fff;
                    min-width:250px;
                    max-width: 250px;
                    height:260px;
                    overflow-y: auto;
                }
            }
        }
        // .table{
        //     .pagin{
        //         margin-top:10px;
        //     }
        // }
    }
    /deep/ .el-table__body-wrapper::-webkit-scrollbar {display:none;overflow-y: overlay;}
    /deep/ .el-table__body-wrapper{
            // background-color: rga(0,0,0,.3);
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