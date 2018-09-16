# 电商项目开发流程

> 使用 Nuxt.js 构建项目，将对 SEO 友好支援

# 2018.07.06 项目结构搭建
    1.采用vue+Nuxt 搭建项目框架
    2.配置放置nuxt.config.js
    3.对ajax接口进行封装
    4.引入Vant-ui 有赞(电商)
#2018.07.06 配置
    1.手机端查看：电脑ip+:本项目端口
    例如：http://192.168.199.148:3100 (同一无线网下查看) http://192.168.88.44:3100
    2.只适应rem配置
    采用淘宝flexbile,在assets封装px转rem的方法。
    使用方式： 
        1.在需要使用的页面引入@import "~@/assets/style/px-to-rem";
        2.单位 使用rem单位自适应 设计稿为实际尺寸的2倍
        高度:
        tr(889px) = 889px / 75px = 11.853rem 
        (ipone6/7/8下 根body font-size =37.5px); 实际高度  11.853rem * 37.5px = 444.73px;
        (ipone6/7/8 plus下 根body font-size =41.44px) 实际高度 11.853 * 41.44px = 491.2px;
        宽度：
        width: 5rem (ipone6/7/8下 根body font-size =37.5px); 实际宽度  5rem * 37.5px = 187.5px;
        width: 5rem (ipone6/7/8 plus下 根body font-size =41.44px); 实际宽度  5rem *41.44px = 206.65px;
        3.对常用布局和字体大小进行封装 直接使用类命
