<template>
    <div class="tree" ref="table">
        <div class="input">
            <el-input v-model="input" placeholder="输入关键字进行搜索" size="mini"></el-input>
        </div>
        <el-tree ref="tree" :data="dataList" node-key="key" @node-click="handleNodeClick" :filter-node-method="filterNode"></el-tree>
    </div>
</template>
<script>
import { Tree } from '@/api/dues';
export default {
    props:{
        del:{
            type:Boolean,
            default:false
        },
        update:{
            type:Array,
            default:[]
        }
    },
    data(){
        return{
            timer:null,
            input:'',
            dataList: [],
        }    
    },
    watch: {
      input(val) {
        this.$refs.tree.filter(val);
        console.log(111,val)
      },
      del:{
          handler(){//监听用户删除操作
              console.log(33,this.del);
              if(this.del){
                  alert(1)
              }
          }
      },
      update:{
          handler(){
              if(this.update.length>0){
                  console.log(console.log(11111111111111))
                  this.dataList = this.update;
              }
          }
      }
    },
    // defaultProps: {
    //     children: 'children',
    //     label: 'label'
    // },
    created() {
        this._INIT();
    },
    mounted(){
        this.timer = setTimeout(()=>{
            this.$refs.table.style.height = window.innerHeight - 80 - 32 + 'px';
        },200);
        window.onresize = () => {//监听浏览器窗口大小变化
            return (() => {
                this.$refs.table.style.height = window.innerHeight - 80 - 32 + 'px';
            })();
        };
    },
    destroyed(){
        clearTimeout(this.timer)
    },
    methods: {
        _INIT(){
            Tree({a:1}).then((json)=>{
                if(json.code === 20000){
                    this.dataList = json.data.dataList;
                }
            }).catch((err)=>{
                console.log(12,err)
            })
        },
        handleNodeClick(data) {
            this.$emit('msg',data)
        },
        filterNode(value, data){
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        }
    }    
}
</script>
<style lang="scss" scoped>
    .tree{
        overflow-y: overlay;
        width:100%;
        &::-webkit-scrollbar {display:none}
        &:hover{
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
        .input{
            padding:6px 12px 6px 0;
        }
    }
</style>