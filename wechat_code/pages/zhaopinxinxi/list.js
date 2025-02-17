const {
deleteData,
page,
list,
newsData,
option,
} = require("../../api/index.js")
const utils = require("../../utils/index.js")
Page({
/**
* 页面的初始数据
*/
data: {

    

    questList: [],
    pageNum: 1,
    pageSize: 10,
    total: 0,
    flag: true, // 防抖开关 防止用户不停的下拉


popopShow:false,

showToTopButton: true,
onPageScrollTop: 0, // 存储滚动距离的变量

goodsListData: [],
activeIndex: 0,
allData: [],
deleteShow: false,
className:"",
name:"",
addAuth:"",
delAuth: "",
editAuth:"" ,
                                        silderList:[],
                                                    userid:"",
baseURL: wx.getStorageSync('baseURL') + "/"
},

/**
* 生命周期函数--监听页面加载
*/
async onLoad(options) {

if(options?.userid) {
this.setData({
    userid:options.userid
})
}
const currentPageUrl = this.getCurrentPageUrl();
if(getApp().globalData.name!=null){
this.setData({
    name: getApp().globalData.name
})
getApp().globalData.name=null
this.searhandler()
}else{
this.getData()
}




if (currentPageUrl == "/pages/zhaopinxinxi/list") {
    wx.setStorageSync("tableName",`zhaopinxinxi`)
    this.setData({
        className:"goodInfomation"
    })
    wx.setStorage
}else {
    this.setData({
        className:"other"
    })

}
},
onShow() {
 if (getApp().globalData.name == null) {
 this.setData({
     name: null
 })

  this.getData()

 }

 const currentPageUrl = this.getCurrentPageUrl();
 if(getApp().globalData.name){
 this.setData({
     name: getApp().globalData.name
 })
 getApp().globalData.name=null
 this.searhandler()
 }else{
 this.getData()
 }


},
/**
* 生命周期函数--监听页面初次渲染完成
*/
onPageShow() {
// 页面显示时执行的操作
},






screenReset(){
},





async   search(){

let searchForm = {
page: this.data.pageNum,
limit: this.data.pageSize
}
if(this.data.gongsimingcheng){
    searchForm['gongsimingcheng'] = '%' + this.data.gongsimingcheng + '%'
}
if(this.data.gongzuogangwei){
    searchForm['gongzuogangwei'] = '%' + this.data.gongzuogangwei + '%'
}
if(this.data.gongzuochengshi){
    searchForm['gongzuochengshi'] = '%' + this.data.gongzuochengshi + '%'
}


let res = {};
if(this.data.userid) {
res = await page(`zhaopinxinxi`, searchForm);
} else {
res = await list(`zhaopinxinxi`, searchForm);
}


let goodsListData
// 如果是第一页数据置空
 if ( this.data.pageNum == 1) {
     goodsListData = []
 };
    goodsListData=res.data.list.map(item=>{
item.fengmian = item.fengmian.split(",")[0];
        return item
    })


this.setData({
goodsListData,
popopShow:false
})

},

// 搜索








/**
* 生命周期函数--监听页面显示
*/
getCurrentPageUrl() {
const pages = getCurrentPages();
const currentPage = pages[pages.length - 1];
const currentPageUrl = `/${currentPage.route}`;
return currentPageUrl;
},
    async  handleTabClick(e) {
        let params={
        }
                const index = e.currentTarget.dataset.index;
const zhaopinfenlei= e.currentTarget.dataset.zhaopinfenlei;
    params["zhaopinfenlei"]='%'+zhaopinfenlei+'%'
if (zhaopinfenlei == "全部") {
const all = this.data.allData.filter(item => item.zhaopinfenlei!= "全部")
this.setData({
goodsListData: all
})
} else {
    let res={};
    if(this.data.userid){
        res=await page(`zhaopinxinxi`,params);
    }else{
        res =await list(`zhaopinxinxi`,params);
    }
let goodsListData=res.data.list.map(item => {
item.fengmian = item.fengmian.split(",")[0];
        return item
}
)
    this.setData({
        activeIndex:index,
        goodsListData:goodsListData
    })
}
                        
this.setData({
activeIndex: index,
});
},
    async searhandler(){
        let token = wx.getStorageSync('token')
        if (!token) {
            return
        }
let targetName="gongsimingcheng"
        const allData=this.data.allData

        let goodsListData

        if(this.data.name==''){
            goodsListData=allData
        }else{
            goodsListData = allData.filter(item => item[targetName].includes(this.data.name));

        }
        this.setData({
            goodsListData
        })



    },
screenBoxShow() {
this.setData({
    popopShow: true
})
},
addTap() {
getApp().globalData.detailId=null
wx.navigateTo({
url: `/pages/zhaopinxinxi/update-and-add`
})
},
searchListHandler(e) {
this.setData({
goodsListData: e.detail.data
})
},
onPageScroll(e) {
if (e.scrollTop >= 225) {
this.setData({
    showToTopButton: true
});
}

},
backToTop() {
wx.pageScrollTo({
scrollTop: 0, // 返回顶部的位置
duration: 1000, // 滚动动画的时长，单位为 ms
});
// 返回顶部时隐藏按钮

},

deleteBtn(e) {
wx.showModal({
title: '提示',
content: '确认删除？',
complete: async (res) => {
    if (res.cancel) {}
    if (res.confirm) {
        const id = e.currentTarget.dataset.id;
        const res = await deleteData("zhaopinxinxi",[id])
        console.log(res);
        if (res.code == 0) {
            this.getData()
        }
    }
}
})
},

editBtn(e) {
const id = e.currentTarget.dataset.id;
getApp().globalData.detailId=id
wx.navigateTo({
url: `/pages/zhaopinxinxi/update-and-add?id=${id}`
})
},
async detailBtn(e) {
const item = e.currentTarget.dataset.item;
getApp().globalData.detailId = item?.id
getApp().globalData.detailList =item
wx.navigateTo({
url: `/pages/zhaopinxinxi/detail`
})

},
async getData() {

const userId=       getApp().globalData.userInfo.id
this.setData({
addAuth: utils.isAuth("zhaopinxinxi", "新增") || utils.isAuthFront("zhaopinxinxi", "新增"),
delAuth: utils.isAuth("zhaopinxinxi", "删除") || utils.isAuthFront("zhaopinxinxi", "删除"),
editAuth: utils.isAuth("zhaopinxinxi", "修改") || utils.isAuthFront("zhaopinxinxi", "修改"),
})


const obj={
    page: this.data.pageNum,
    limit: this.data.pageSize,

}







let resList
var that = this
obj['page']=this.data.pageNum;
obj['limit']=this.data.pageSize
    if(this.data.userid){
        resList = await page("zhaopinxinxi",obj)
    }else{
         resList= await list("zhaopinxinxi",obj)
    }

    if(resList.code==0){
        let mylist = this.data.questList
        //先处理成你想要的数据 下面再去赋值

let    goodsListData =  resList.data.list?.filter(item =>
item?.sfsh?item.sfsh === "是":item)
.map(item => {
item.fengmian? item.fengmian = item.fengmian.split(",")[0].replace('upload','flie'):""
return item;
});
        if (that.data.pageNum == 1) {
            mylist = []
        }

        // 新旧数据合并到一起
        mylist = Object.assign(mylist, goodsListData)
        if (mylist.length < resList.total ){
            that.setData({
                pageNum: that.data.pageNum + 1,
                flag:true
            })
        } else {
            that.setData({
                flag:false
            })
        }
        that.setData({
            goodsListData: mylist,
            questList: mylist,
            total: resList.total,
            allData: mylist
        })
        
    }






// 商品名称
if (getApp().globalData.name != null) {
this.setData({
goodsListData: getApp().globalData.goodsList,
})
getApp().globalData.name = null
console.log('页面重新加载');
}

const arr = [{
        zhaopinfenlei: "全部"
}]


const zhaopinfenleiobj={
page:1,
limit:100
}
let    zhaopinfenleiRes
//侧边栏
if(userId){
zhaopinfenleiRes     = await page('zhaopinfenlei',zhaopinfenleiobj)
}else{
zhaopinfenleiRes     = await list('zhaopinfenlei',zhaopinfenleiobj)

}
arr.push(...zhaopinfenleiRes.data.list)
this.setData({
silderList:arr
})
},

// 滚动到底触发的方法

/**
* 生命周期函数--监听页面隐藏
*/
onHide() {

},

/**
* 生命周期函数--监听页面卸载
*/
onUnload() {

},

/**
* 页面相关事件处理函数--监听用户下拉动作
*/
onPullDownRefresh() {

},



onReachBottom() {
if (this.data.flag) {
this.setData({
    flag: false
})
this.getData(); // 疯狂的请求的方法
}
console.log('触发');
},




/**
* 页面上拉触底事件的处理函数
*/
/**
* 用户点击右上角分享
*/
onShareAppMessage() {

}
})