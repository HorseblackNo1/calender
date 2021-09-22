
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        userIdentity:{
            type:String,
            value:null
        },
        chooseDayNumber:{
            type:Number,
            value:13,
        },
        calenderModel:{
            type:String,
            value:'range',
        },
        calenderStampList:{
             type:Array,
            value:[]
        }


    },

    /**
     * 组件的初始数据
     */
    data: {
      
        swiperCurrent:0,
        swiperArr:[],
          /*
          curr 当前月 dayArr[] 
          range 一个日期区间 从今天起的 当前月份，或者下一个月份 swiper dayArr[[day,day,...],[day,day,...] ]
        */
        // calenderModel: 'range',
        // chooseDayNumber: 25,
        oneDayms: 86400000,
        weekArr: ['日', '一', '二', '三', '四', '五', '六'],
        calenderTitle: '',
        currDay: '',
        indicatorDots: false,
        vertical: false,
        autoplay: false,
        interval: 2000,
        duration: 500,
    },
    attached: function () {
        // console.log("在组件实例进入页面节点树时执行。")
        this.getToday()
    },
    ready: function () {
        // console.log("组件生命周期函数，在组件布局完成后执行。")
    },

    /**
     * 组件的方法列表
     */
    methods: {

        handleDate(getDay, type) {
            let weekArr = this.data.weekArr;
            let temp = ''
            if (type == "timeStamp") {
                temp = new Date(getDay)
            } else {
                temp = getDay ? new Date(getDay.year, getDay.month) : new Date();
            }

            let year = temp.getFullYear();
            let showMonth = temp.getMonth() + 1;
            let month = temp.getMonth();
            let day = temp.getDate();
            let weekDay = weekArr[temp.getDay()];
            let todayTimeStamp = new Date(year, month, day).getTime();
            let todayTimeStampNow = temp.getTime();

            return {
                year, showMonth, month, day, todayTimeStampNow, weekDay, todayTimeStamp
            }

        },

        getToday(getDay,type) {
            let { year, showMonth, month, day, todayTimeStampNow, weekDay, todayTimeStamp } = this.handleDate(getDay)
            let calenderTitle = year + '年' + (month+1) + '月'
            let currDay = today = {
                year,
                month,
                showMonth,
                day,
                weekDay,
                todayTimeStampNow,
                todayTimeStamp,
            }

            if (!getDay) {
                this.setData({
                    today
                })
            }

            this.setData({
                calenderTitle,
                currDay
            })
            this.initCalederDay(currDay,type)
        },

        //点击上一个月
        previousMonth() {
            let swiperArr =this.data.swiperArr
            let calenderTitle = this.data.calenderTitle, previousDay = this.data.currDay
            previousDay.month -= 1
            //  console.log("previousDay",previousDay)
             let addobj = swiperArr.find(item=>item.year== previousDay.year&& item.month ==previousDay.month)
            // console.log("addobj=>:",addobj)

             if(!addobj){
                // console.log("111111111111")
                this.getToday(previousDay,'previous')
            }else{
                //  console.log("2222222")
                 console.log(this.data.swiperCurrent)
                this.setData({
                    swiperCurrent:this.data.swiperCurrent-1
                })
                console.log(this.data.swiperCurrent)
            }


            
        },

        //点击下一个月
        nextMonth() {
            let swiperArr =this.data.swiperArr
            let calenderTitle = this.data.calenderTitle, nextDay = this.data.currDay
            // console.log("ssssssssssssss",nextDay)
            console.log("nextDay",nextDay)
            nextDay.month += 1
            console.log("nextDay",nextDay)
            let addobj = swiperArr.find(item=>item.year== nextDay.year&& item.month ==nextDay.month)
            // console.log("addobj=>:",addobj)
           
            if(!addobj){
                // console.log("111111111111")
                 this.getToday(nextDay,"next")
            }else{
                //  console.log("2222222")
                 console.log(this.data.swiperCurrent)
                this.setData({
                    swiperCurrent:this.data.swiperCurrent+1
                })
                console.log(this.data.swiperCurrent)
            }
        },

        //日历初始化
        initCalederDay(day,type) {
            let swiperArr =this.data.swiperArr
            let weekArr = this.data.weekArr;
            let today = this.data.today;
            let calenderModel = this.data.calenderModel;
            let chooseDayNumber = this.data.chooseDayNumber;
            let oneDayms = this.data.oneDayms;
            let currMonthDayCount = new Date(day.year, day.month + 1, 0).getDate()
            let dayArr = []
            let dayArrObj=null;
            let dayArrObj1=null;
           

            //当前月份 日期足够使用
            if (calenderModel == 'curr') {
               dayArrObj= this.getMonthArr(currMonthDayCount,day)
            }

            //从今天起 一个时间区间  可以横跨一个或多个月份
            if (calenderModel == 'range') {
                // console.log("使用的天数:",chooseDayNumber,"一天多少毫秒:",oneDayms,'今天的日期:',today)
                let endDay = this.getEndDay(today, chooseDayNumber, oneDayms)
                
                this.data.endDay = endDay;
                // console.log("开始日期对象", today, "结束日期对象", endDay, "当前月的天数：", currMonthDayCount)


                /* 
                    开始时间对象 day +  chooseDayNumber <=  currMonthDayCount 当前月满足
                    开始时间对象 day +  chooseDayNumber >  currMonthDayCount  下个月来补充
                */
                //  dayArr= this.getMonthArr(currMonthDayCount,day)
                if(today.day+chooseDayNumber<=currMonthDayCount){
                    console.log("111111111111")
                    dayArrObj= this.getMonthArr(currMonthDayCount,day)
                }
                if(today.day+chooseDayNumber>currMonthDayCount){
                     console.log("222222222222")
                    // console.log("需要下个月进行补充")
                    let nextMonthAddDayCount = today.day+chooseDayNumber-currMonthDayCount
                    //  console.log("需要下个月进行补充",nextMonthAddDayCount,currMonthDayCount,day)
                     //当前月天数
                     dayArrObj= this.getMonthArr(currMonthDayCount,day)

                     
                     //下个月对象
                     let nextMonthDay={
                         day:1,
                         month:day.month+1,
                         year:day.year,
                         weekDay:'',
                         todayTimeStampNow:'',
                         todayTimeStamp:'',
                         showMonth:'',
                     }
                    // 下个月天数
                    let nextMonthDayCount = new Date(nextMonthDay.year, nextMonthDay.month + 1, 0).getDate()
                    
                    
                     dayArrObj1= this.getMonthArr(nextMonthDayCount,nextMonthDay)

                     
                }

            }
            if(type=='previous'){
                swiperArr.unshift(dayArrObj)

            }else{
                swiperArr.push(dayArrObj)
                if(dayArrObj1){
                    swiperArr.push(dayArrObj1)
                }
            }
            
            // console.log("swiperArr=>>>",swiperArr)

            this.setData({
                swiperArr,
                swiperCurrent:type?type=='previous'?0:this.data.swiperCurrent+1 :0
            })
        },

        //返回结束天的obj
        getEndDay(startTimeObj, dayCount, unit) {
            // console.log(startTimeObj,dayCount,unit)
            let startTiemStamp = startTimeObj.todayTimeStamp
            let endTimeStamp = startTiemStamp + (dayCount * unit)
            //  console.log("结束日期时间戳：",endTimeStamp)
            let { year, showMonth, month, day, todayTimeStampNow, weekDay, todayTimeStamp } = this.handleDate(endTimeStamp, 'timeStamp')
            return endDay = {
                year,
                month,
                showMonth,
                day,
                weekDay,
                todayTimeStampNow,
                todayTimeStamp,
            }
        },


        //计算当前月份 日期数组 

        getMonthArr(currMonthDayCount,day) {
            let dayArr=[];
            let calenderStampList =this.data.calenderStampList;
            let calenderModel = this.data.calenderModel;
            let weekArr = this.data.weekArr;
            let today = this.data.today;
            let endDay = this.data.endDay?this.data.endDay:'';
            for (var i = 1; i <= currMonthDayCount; i++) {
                let temp = new Date(day.year, day.month, i)
                //  for(var j=0;i<calenderStampList.length;j++){
                    let tempOjb = {
                        year: temp.getFullYear(),
                        month: temp.getMonth() + 1,
                        day: temp.getTime() == today.todayTimeStamp ? '今天' : temp.getDate(),
                        timeStamp: temp.getTime(),
                        weekDay: temp.getDay(),
                        weekDayText: weekArr[temp.getDay()],
                        hasReservation:calenderStampList.find(item=>item== temp.getTime())?true:false
                    }
                // }
                if(calenderModel == 'curr'){
                   tempOjb.type=temp.getTime() == today.todayTimeStamp ? 'select' : temp.getTime() >today.todayTimeStamp ? 'normal' : 'disable'
                }
                 if(calenderModel == 'range'){
                   tempOjb.type=temp.getTime() == today.todayTimeStamp ? 'select' : temp.getTime() > today.todayTimeStamp && temp.getTime() <= endDay.todayTimeStamp  ? 'normal' : 'disable'
                }
                dayArr.push(tempOjb)
            }


            // //补齐上个月星期
            let firstDay = dayArr[0]
            let perMonthDayCount = new Date(day.year, day.month - 1, 0).getDate()
            // console.log("上个月的差了天数",firstDay.weekDay, weekArr[firstDay.weekDay])
            let previousCount = firstDay.weekDay
            for (var i = 0; i < previousCount; i++) {
                let tempOjb = {
                    year: '',
                    month: '',
                    day: '',
                    timeStamp: '',
                    weekDay: '',
                    weekDayText: '',
                    type: 'disable',
                }
                dayArr.unshift(tempOjb)
            }

            //下个月星期补齐
            let lastDay = dayArr[dayArr.length - 1]
            let nextCount = 6 - lastDay.weekDay
            for (var i = 0; i < nextCount; i++) {
                let tempOjb = {
                    year: '',
                    month: '',
                    day: '',
                    timeStamp: '',
                    weekDay: '',
                    weekDayText: '',
                    type: 'disable',
                }
                dayArr.push(tempOjb)
            }
            let obj={
                year:day.year, 
                month:day.month,
                list:dayArr
            }
            return obj
        },

        //选择日期
        selectCalenderDay(e) {
            let currentItem = e.currentTarget.dataset.item,
                swiperCurrent =this.data.swiperCurrent, 
                swiperArr = this.data.swiperArr, 
                calenderModel=this.data.calenderModel,
                dayArr = swiperArr[swiperCurrent].list;
            if(calenderModel=='curr'){
                let oldIdx = dayArr.findIndex(item => item.type == 'select')
                let newIdx = dayArr.findIndex(item => item.timeStamp == currentItem.timeStamp)
                // console.log("sssssssssss",e,swiperCurrent,oldIdx,newIdx)
                this.setData({
                    [`swiperArr[${swiperCurrent}].list[${oldIdx}].type`]:'normal',
                    [`swiperArr[${swiperCurrent}].list[${newIdx}].type`]:'select',
                    // [`dayArr[${oldIdx}].type`]: 'normal',
                    // [`dayArr[${newIdx}].type`]: 'select',
                })
            }
            if(calenderModel=='range'){
                console.log("swiperCurrent=>:",swiperCurrent)
                for(var i=0;i<swiperArr.length;i++){
                    let dayArr = swiperArr[i].list;
                   
                    for(var j=0;j<dayArr.length;j++){
                        if(dayArr[j].type=='select'){
                            dayArr[j].type='normal'
                        }
                    }
                }
                
                let dayArr = swiperArr[swiperCurrent].list;
                let newIdx = dayArr.findIndex(item => item.timeStamp == currentItem.timeStamp)
                swiperArr[swiperCurrent].list[newIdx].type='select'

                this.setData({
                    swiperArr
                })

                // console.log("currentItem=>:",currentItem)
                this.triggerEvent('selectDay',{currentItem})
            }
           

        },
        currentChange: function (e) {
            let  swiperArr =this.data.swiperArr
            let id = e.detail.current
            // console.log("swiperArr[id]=>:",swiperArr[id])
            let years = swiperArr[id].year
            let months = swiperArr[id].month
            // let { year, showMonth, month, day, todayTimeStampNow, weekDay, todayTimeStamp } = this.handleDate(swiperArr[id][12])
            let calenderTitle = years + '年' + (months+1)  + '月'
            
            let timeStamp=new Date(years,months,1).getTime()
            // console.log(years,months,timeStamp)
            let { year, showMonth, month, day, todayTimeStampNow, weekDay, todayTimeStamp } = this.handleDate(timeStamp,'timeStamp')
            
             let currDay = {
                year,
                month,
                showMonth,
                day,
                weekDay,
                todayTimeStampNow,
                todayTimeStamp,
            }
            this.setData({
                calenderTitle,
                currDay,
                swiperCurrent:id
            })

            // this.nextMonth()
        }


    }
})