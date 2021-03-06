import Vue from "vue";
import {
  Search,
  Swipe,
  SwipeItem,
  Toast,
  Icon,
  Loading,
  Grid,
  GridItem,
  Image,
  Sticky,
} from "vant";
import navFoot from "../../components/footer.vue";
import api from "../../request/api";
import ConstKey from "../../until/const_key"
Vue.use(Search).use(Swipe).use(SwipeItem).use(Toast).use(Icon).use(Loading).use(Grid).use(GridItem).use(Image).use(Sticky)
import Component from 'vue-class-component'
import { Prop } from "vue-property-decorator"
import  img1 from '../../assets/images/index/logo.png'


@Component({
components: {
    navFoot
  }
})



export default class Index extends Vue {
  
  //初始化数据
      active:String='0'
      logoUrl:string = img1
      searchValue:string= ""
      showHeight:number= 440
      ismoreR:boolean= false
      bannerList:Array<any> = [] //轮播图
      cloneRecommenList:Array<any>= [] //轮播数组复制
      shopList:Array<any>= []
      recommenList:Array<any>= []
      subGoodsList:Array<any>= []
      showTop:boolean= false
      isClose:boolean= false
      colist:Array<any>= []
      plist:Array<any>= []
      IndexData:Array<any>= []
      activityList:Object= {}
      textarr:Array<any>= []
      // showLoading: window.localStorage.getItem('showLoad')

    
  

  get showLoading():string | null {
     return window.localStorage.getItem("showLoad");
  }
  //获取首页数据
  mounted() {
    let that = (this as any);
    that.getBanner();
    that.getMarketingName()
    // (that as any).getsubGoodsList();

    //页面滚动高度
    window.addEventListener("scroll", that.fixedHead);
    if (that.checkIsH5Plus()) {
      //app内部隐藏
      that.isClose = true;
    } else {
      that.isClose = false;
    }
    that.$fetch(api.HomeCate).then((res:any) => {
      console.log(res.context.slice(0,8))
      this.shopList = res.context.slice(0,8)
    })

    that.getData()

    
   
  }

  beforeRouteLeave(to:any,from:any,next:any){
        
     
          if(to.path == '/classification'||to.path == '/cart'||to.path == '/usermain'||to.path == '/activity'){
                //缓存
              from.meta.keepAlive = true;
          }else{
                //不缓存
              from.meta.keepAlive = false ;
          }
          next()
   }
  //method
      getData():any {
      let that = (this as any)
      that.$post(
        api.HomeData
      ).then((res:any) => {

        that.IndexData = res.context
        console.log(that.IndexData)
        that.IndexData.map((item:any) => {
          if (item.type === 0) {
            that.bannerList.push(...item.components.details)
            
          } else {
            item.components.indexId = item.indexId
            that.textarr.push(item.components)
          }
        })
        
        
        that.textarr.map((item:any,index:any)=>{
          item.details.map((itm:any,ind:any)=>{
            if (itm.goods == null) {
              item.details.splice(ind,1)
              console.log(">>>>>>>>",item)
            }
          })
         
        })
        console.log("+++++++++++++++",that.textarr)
        that.subGoodsList = that.textarr
        // .slice(1,that.textarr.length+1)
        // that.activityList=that.textarr[0]
        // console.log('<<<<<<<<<', that.textarr);
      })
    }
    toggleCate(item:any){
      let that  = (this as any)
      console.log(item)
      let str:Array<string> = []
      item.goodsCateDTO.map((item:any)=>{
        item.goodsCateDTO.map((itm:any)=>{
          str.push(itm.cateId)
        })
      })
      
      console.log(str)
      that.$router.push({
        name:'threeClass',
        params:{
          list:str,
          cateName:item.cateNameJp
        }
      })
      let tartype:string = '1'
      localStorage.setItem('allCateid',str.toString())
      localStorage.setItem('threeTitle',item.cateNameJp)
      localStorage.setItem('taptype',tartype)
    }

    // 点击搜索
    goSearch():any{
      let that = (this as any)
      console.log("---------去搜索");
      that.$router.push("/search");
    }
    // 更多推荐
    moreRecommen():void{
      console.log("----------更多推荐");
      let that = (this as any)
      if (that.recommenList.length > 4) {
        that.recommenList = that.recommenList.slice(0, 4);
      } else {
        that.recommenList = that.cloneRecommenList;
      }
    }

    //专题商品查看更多
    moreMove(item:any){
      // window.location.href = item.sublink;
      console.log(item)
      let that = (this as any)
      
      that.$router.push({
        name:'viewMore',
        params:{
          type:item.type,
          indexId:item.indexId,
          titleJp:item.titleJp,
         
        }
      })
      

    }

        //回到顶部
    goTop(){
      //动画版回到顶部
      setTimeout(() => {
        (function smoothscroll() {
          var currentScroll =
            document.documentElement.scrollTop || document.body.scrollTop;
          if (currentScroll > 0) {
            window.requestAnimationFrame(smoothscroll);
            window.scrollTo(0, currentScroll - currentScroll / 5);
          }
        })();
      }, 100);
    }
    //页面滚动高度
    fixedHead(){
      let that = (this as any)
      let scroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scroll > 150) {
        that.showTop = true;
      } else {
        that.showTop = false;
      }
    }
    //关闭下载提示
    closeLoad() {
      let that = (this as any);
      that.isClose = true;
    }
    //下载app
    goLoad(){}
    //banner广告位
    getBanner(){}
    goLinkUrl(item:any) {
      console.log(item)
     let that = (this as any)
     let goodsInfoId = item.goods.goodsId;
      window.localStorage.setItem("goodsInfoId", goodsInfoId);
      that.$router.push({
        name: "goods_detail",
        params: {
          goodsInfoId: goodsInfoId
        }
      });


    }
    getMarketingName(){
      let that = (this as any)
      that.$fetch(
        api.getMarketingName
      ).then((res:any) => {

        // that.activityList=that.textarr[0]
        console.log('<<<<<<<<<', res);
        console.log('<<<<<<<<<', that.bannerList);
        let obj:any = {}
        res.context.map((item:any)=>{
          if (item.operationType == 0) {
            obj.img = item.activityImg
            obj.marketingType = item.marketingType
            obj.marketingId = item.marketingId
            obj.marketingName = item.marketingName
            obj.operationType = item.operationType
            that.bannerList.push(obj)
          }
          
        })
      })
    }
    tapBanner(item:any){
      console.log(item)
      let that = (this as any)
      // that.$post(
      //   api.getMarketingGoods,
      //   {
      //     "marketingType":item.marketingType,
      //     "pageSize":24,
      //     "pageNumber":1,
      //     "marketingId":item.marketingId
      //   }
      // ).then((res:any) => {

      //   // that.activityList=that.textarr[0]
      //   console.log('<<<<<<<<<>>>>>>>>>>', res);
      //   if (res.code == 200) {
      //     that.$router.push({
      //       name:'oldman',
      //       params:{
      //         imgUrl:item.img,
      //         subtitle:item.marketingName,
      //         goodslist:res.context.data
      //       }
      //     })
      //   }
        
      // })
      if (item.operationType == 0 ) {
        that.$router.push({
          name:'oldman',
          params:{
            marketingType:item.marketingType,
            marketingId:item.marketingId,
            imgUrl:item.img,
            subtitle:item.marketingName,
          }
        })
      }
      
    }




}
