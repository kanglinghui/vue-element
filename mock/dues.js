const tree_list = {
    dataList: [{
        label: '校党委',
        children: [{
            label: '理学院党委',
            children: [
                { label: '计算数学支部' },
                { label: '应用数学支部' },
                { label: '运筹学与控制论支部' },
                { label: '基础数学支部' },
                { label: '应用数学支部' },
                { label: '近代物理支部' },
                { label: '光信息物理支部' },
                { label: '凝聚态物理支部' },
                { label: '物理实验中心支部' },
                { label: '无机化学支部' },
                { label: '有机化学支部' },
                { label: '电化学与新能源支部' },
                { label: '计算机化学支部' },
                { label: '化学实验中心支部' },
                { label: '力学系支部' },
                { label: '力学所支部' },
                { label: '行政支部' },
                { label: '数学学生党支部' },
                { label: '力学学生党支部' },
                { label: '化学学生党支部' },
                { label: '物理学学生党支部' },
                { label: '数学系硕士研究生第一党支部' },
                { label: '材料基因组工程研究院教工支部' }
            ]
        },{
            label: '计算机学院党委',
            children: [
                { label: '智能科学与技术系第一党支部' }
            ]
        }]
    }]
}
const organizationList = [
    {
        '计算数学支部':[
            {job_num:10002711,name:'白延琴',tissue:'计算数学支部'},
            {job_num:10002712,name:'张延琴',tissue:'计算数学支部'},
            {job_num:10002713,name:'白延风',tissue:'计算数学支部'},
            {job_num:10002714,name:'白延',tissue:'计算数学支部'},
            {job_num:10002715,name:'白琴',tissue:'计算数学支部'},
            {job_num:10002716,name:'延琴',tissue:'计算数学支部'},
            {job_num:10002717,name:'白白琴',tissue:'计算数学支部'},
            {job_num:10002718,name:'白哈琴',tissue:'计算数学支部'},
            {job_num:10002719,name:'白后琴',tissue:'计算数学支部'},
            {job_num:10002721,name:'红琴',tissue:'计算数学支部'},
        ]
    },
    {
        '应用数学支部':[
            {job_num:10002711,name:'白延琴',tissue:'应用数学支部'},
            {job_num:10002712,name:'张延琴',tissue:'应用数学支部'},
            {job_num:10002713,name:'白延风',tissue:'应用数学支部'},
            {job_num:10002714,name:'白延',tissue:'应用数学支部'},
            {job_num:10002715,name:'白琴',tissue:'应用数学支部'},
            {job_num:10002716,name:'延琴',tissue:'应用数学支部'},
            {job_num:10002717,name:'白白琴',tissue:'应用数学支部'},
            {job_num:10002718,name:'白哈琴',tissue:'应用数学支部'},
            {job_num:10002719,name:'白后琴',tissue:'应用数学支部'},
            {job_num:10002721,name:'红琴',tissue:'应用数学支部'},
        ]
    },{
        '基础数学支部':[
            {job_num:10002711,name:'白延琴1',tissue:'基础数学支部'},
            {job_num:10002712,name:'张延琴2',tissue:'基础数学支部'},
            {job_num:10002713,name:'白延风3',tissue:'基础数学支部'},
            {job_num:10002714,name:'白延4',tissue:'基础数学支部'},
            {job_num:10002715,name:'白琴5',tissue:'基础数学支部'},
            {job_num:10002716,name:'延琴6',tissue:'基础数学支部'},
            {job_num:10002717,name:'白白琴7',tissue:'基础数学支部'},
            {job_num:10002718,name:'白哈琴8',tissue:'基础数学支部'},
            {job_num:10002719,name:'白后琴9',tissue:'基础数学支部'},
            {job_num:10002721,name:'红琴10',tissue:'基础数学支部'},
            {job_num:10002716,name:'延琴11',tissue:'基础数学支部'},
            {job_num:10002717,name:'白白琴12',tissue:'基础数学支部'},
            {job_num:10002718,name:'白哈琴13',tissue:'基础数学支部'},
            {job_num:10002719,name:'白后琴14',tissue:'基础数学支部'},
            {job_num:10002721,name:'红琴15',tissue:'基础数学支部'},
        ]
    }
]
function recursiveTree(label,newadd,arr){
    for(let i=0;i<arr.length;i++){
        console.log(11,label)
        console.log(2123,arr[i].label)
        if(arr[i].label == label){
            console.log(123)
            let obj = {};
            obj.label = newadd;
            if(arr[i].children){
                arr[i].children.push(obj)
            }else{
                const arrChildren = [];
                arrChildren.push(obj)
                arr[i].children = arrChildren;
            }
        }else{
            console.log(2)
            if(arr[i].children){
                recursiveTree(label,newadd,arr[i].children);
            }
        }
    }
}

export default [
    {
        url: "/vue-element-admin/dues/tree",
        type: "post",
        response: config => {
            return {
                code: 20000,
                data: tree_list
            }
        }
    },
    {
        url: "/vue-element-admin/dues/addtree",//添加组织
        type: "post",
        response: config=> {
            let params = config.body;
            let array = tree_list.dataList;
            recursiveTree(params.tissue,params.tissue_name,array);
            // console.log(3322222,ar)
            return {
                code:20000,
                data:tree_list.dataList
            }
        }
    },
    {
        url:'/vue-element-admin/dues/adminInfo',
        type: "get",
        response: config => {
            let content = JSON.parse(config.query.data);
            let data = content.organization;
            let idx = content.size?content.size:10;
            let page = content.page?content.page:1;
            let arr = [];
            let index = page - 1;
            let num = organizationList.filter((n)=>{
                return n[data];
            })
            arr = num[0][data].slice(index * idx,page * idx);
            return {
                code:20000,
                data:arr,
                total:num[0][data].length
            }
        }
    }
]