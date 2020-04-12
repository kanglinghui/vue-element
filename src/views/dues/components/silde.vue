<template>
    <div class="slide" ref="slide">
        <div class="slide_header">
            <div class="fold" v-if="folds" @click="fold">
                <i class="el-icon-d-arrow-left"></i>
                <span>折叠面板</span>
            </div>
            <div class="head" v-else>
                <span>已选组织：{{title?title:'暂未选择组织'}}</span>
                <div class="header_operation">
                    <i class="el-icon-plus" @click="add"></i>
                    <i class="el-icon-edit-outline" @click="change"></i>
                    <i class="el-icon-delete" @click="del"></i>
                </div>
            </div>
        </div>
        <Tree @msg="msg($event)" :del="dele" :update="update_tree"/>
        <div class="dia">
            <el-dialog
                :title="idx?'修改组织':'添加组织'"
                :visible.sync="dialogVisible"
                width="50%">
                <div class="form">
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="上级组织">
                            <el-input v-model="form.tissue" placeholder="请输入上级组织"></el-input>
                        </el-form-item>
                        <el-form-item label="组织编号">
                            <el-input v-model="form.tissue_number" placeholder="请输入组织编号"></el-input>
                        </el-form-item>
                        <el-form-item label="组织名称">
                            <el-input v-model="form.tissue_name" placeholder="请输入组织名称"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import Tree from './tree';
import { addTree } from '@/api/dues';
export default {
    name: "Silde",
    components:{
        Tree
    },
    props:[
        'folds'
    ],
    data(){
        return {
            update_tree:false,
            show:true,
            idx:0,
            dialogVisible:false,
            dele:false,
            title:'',
            form:{
                tissue:'',
                tissue_number:'',
                tissue_name:''
            }
        }
    },
    methods:{
        add(){
            this.idx = 0;
            this.dialogVisible = true;
        },
        change(){
            this.idx = 1;
            this.dialogVisible = true;
        },
        del(){
            if(!this.form.tissue){
                this.$notify.info({
                    title: '提示信息',
                    message: '您还未选择组织'
                });
                return;
            }
            this.$confirm(`是否删除${this.form.tissue}?`, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.dele = true;
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
        add_admin(){
            console.log(111);
        },
        submit(){
            console.log(this.idx)
            if(!this.idx){
                addTree(this.form).then((json)=>{
                    console.log(json)
                    this.update_tree = json.data;
                    this.dialogVisible = false;
                }).catch((err)=>{
                    console.log(err)
                })
            }
        },
        fold(){
            this.$store.dispatch("app/changeFolding", false);
        },
        msg(data){
            this.form.tissue = data.label;
            this.title = data.label;
            this.$emit('silde',data)
        }
    }
}
</script>
<style lang="scss" scoped>
    .slide{
        width:300px;
        height:100%;
        padding:0 10px 10px 10px;
        background-color: #fff;
        position: absolute;
        border-left:.5px solid #ccc;
        border-right:.5px solid #ccc;
        left:0;
        top:0;
        .slide_header{
            .head{
                cursor:default;
                display: flex;
                justify-content: space-between;
                border-bottom:.5px solid #ccc;
                span{
                    margin-left:5px;
                    font-size:12px;
                    font-weight: 600;
                    line-height:30px;
                    display: inline-block;
                    width:180px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .header_operation{
                    i{
                        margin-right:8px;
                        cursor:pointer;
                        line-height: 30px;
                    }
                }
            }
            .fold{
                font-size:14px;
                font-weight: 600;
                line-height: 30px;
                text-align: center;
                cursor: pointer;
                border-bottom:.5px solid #ccc;
                transition: .5s;
                &:hover{
                    background-color: rgb(211,75,57);
                    color:#fff;
                }
            }
        }
    }
</style>