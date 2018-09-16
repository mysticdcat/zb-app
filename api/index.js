/**
 * 接口封装
 */
import axios from '~/untils/axios'
const qs = require('qs')
// var key = localStorage.getItem('key');
// key = key.replace('+', "%2B");
// key = key.replace('=', '%3D')
// axios.defaults.params = {key:key}

// 设置axios拦截器---->存储登录状态
// 拦截器的作用是给请求头再添加一些信息
axios.interceptors.request.use(function (config) {
	// 取出localStorage中存储的token值
	// let token = localStorage.getItem('mytoken')
	// let token = 'aZkrKVS63RDci%2B6hcq0RAJCxGt%2FEO3LF6eGqbMLjQjLFu8zGfq1mlK3FaX9KyKs1meTbmmoEGcxDz96PqcJQPpFqIZPR40BHKGobQgKNHAIbYieQKvhd%2Fw%3D%3D'
	// var token = params;
	function getSearchString(key) {

		// 获取URL中?之后的字符
		var str = location.search;
		str = str.substring(1, str.length);
		// 以&分隔字符串，获得类似name=xiaoli这样的元素
		var arr = str.split("&");
		var obj = new Object();
		// 将每一个数组元素以=分隔并赋给obj对象
		for (var i = 0; i < arr.length; i++) {
			var tmp_arr = arr[i].split("=");
			obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
		}
		return obj[key];
	}

	var key = getSearchString('key')
	if (key) {
		localStorage.setItem('key', key);
		key = localStorage.getItem('key');
	}
	if (!key) {
		key = localStorage.getItem('key');
	}

	// 获取language
	var language = getSearchString('language')

	if (language) {
		localStorage.setItem('language', language);
		language = localStorage.getItem('language');
	}
	if (!language) {
		language = localStorage.getItem('language');
	}


	// var key = localStorage.getItem('key');
	// key = key.replace('+', "%2B");
	// key = key.replace('=', '%3D')
	// 设置到请求头中
	config.headers['key'] = key
	config.headers['language'] = language
	return config
}, function (error) {
	return Promise.reject(error)
})

export default {

	////////////////////////////////////////////////////////////////////////////////////    邹
	getCar(params) {
		return axios.get('/shop/cart/findByUserId').then(data => {
			return data.data;
		})
	},
	//删除购物车商品
	delGoods(params) {
		return axios.post(`/shop/cart/deleteCartItem?uid=${params.uid}&itemid=${params.itemid}`).then(data => {
			return data.data;
		})
	},
	//修改购物车中商品的数量
	updataNum(params) {
		return axios.get(`/shop/v2/cart/updateCartItem?itemid=${params.itemid}&num=${params.num}&propertyId=${params.propertyId}`).then(data => {
			return data.data;
		})
	},
	//创建订单
	createShopOrder(params) {
		return axios.post('/shop/order/createOrder', JSON.stringify(params)).then(data => {
			return data.data;
		})
	},
	//根据订单ID来查询订单消息
	getOrder(params) {
		return axios.get(`/shop/order/selectByOrdrId?orderid=${params}`).then(data => {
			return data.data;
		})
	},

	//根据商家订单id 来获取该订单信息
	getOrderInfo(params) {
		return axios.get(`/shop/v2/order/selectByShopOrdrId?orderShopid=${params}`).then(data => {
			return data.data;
		})
	},

	//根据订单id和地址ID来更改订单信息
	updataOrderAddr(params) {
		return axios.get(`shop/order/updateOrderAddr?id=${params.id}&addrId=${params.addrId}`).then(data => {
			return data.data;
		})
	},

	//根据用户ID获取全部订单
	allOrderList(params) {
		return axios.get(`/shop/order/selectByUserId?pageNum=${params.pageNum}&pageSize=${params.pageSize}`).then(data => {
			return data.data;
		})
	},
	//根据用户ID获取该用户的所有订单总数
	getAllOrderNum(params) {
		return axios.get('/shop/order/selectUseridByNum').then(res => {
			return res.data;
		})
	},
	//根据订单状态获取订单详情
	getStatusOrder(params) {
		return axios.get(`/shop/order/findByStatus?pageNum=${params.pageNum}&pageSize=${params.pageSize}&status=${params.status}`).then(res => {
			return res.data;
		})
	},
	//根据订单状态获取该状态下的所有订单数目
	getStatusOrderNum(params) {
		return axios.get(`shop/order/findStatusNum?status=${params}`).then(res => {
			return res.data;
		})
	},

	//查询未付款订单信息

	getNoPay(params) {
		return axios.get(`shop/order/findByDanStatus?pageNum=${params.pageNum}&pageSize=${params.pageSize}`).then(res => {
			return res.data;
		})
	},

	//根据用户ID来查询用户的默认地址
	getOrDefaultAdress(params) {
		return axios.get('/shop/shoppingaddress/selectByMRUserId').then(data => {
			return data.data;
		})
	},
	//删除(取消订单)
	deleteOrder(params) {
		return axios.get(`/shop/order/updateOrder?id=${params}`).then(data => {
			return data.data;
		})
	},

	//根据订单ID进行电商支付跳转
	pay(params) {
		return axios.get(`/pay/pay/alipayMall?billId=${params}&returnUrl=${'http://api.ickapay.com:8602/pay/success/'}`).then(data => {
			return data.data;
		})
	},
	//根据订单ID进行直播支付跳转
	pay(params) {
		return axios.get(`/pay/pay/alipayMall?billId=${params}&returnUrl=${'http://api.ickapay.com:8602/pay/success/'}`).then(data => {
			return data.data;
		})
	},
	livePay(params) {
		return axios.get(`/pay/pay/alipayLive?billId=${params}&returnUrl=${'http://api.ickapay.com:8602/pay/success/'}`).then(data => {
			return data.data;
		})
	},

	//获取支付后的回调
	getSuccess(params) {
		return axios.get(`/pay/payCallback/alipayMall?billId=${params}`).then(data => {
			return data.data;
		})
	},
	//获取榜单数据
	getTopList(params) {
		return axios.post(`live/rank/rank?type=${params.type}&pageNum=${params.pageNum}&pageSize=${params.pageSize}&giftid=${params.giftid}&total=${params.total}`).then(data => {
			return data.data;
		})
	},
	//获取主播金币
	getChange(key) {
		return axios.get(`/live/live/findCash`).then(data => {
			return data.data;
		})
	},

	//第二版本
	//根据商家主键id获取商家信息
	getPaymentShops(params) {
		return axios.get(`/remark/v2/dpshop/findshopByid?id=${params.id}&lat=${params.lat}&lng=${params.lng}`).then(data => {
			return data.data;
		})
	},

	//根据商家id获取评论
	getPaymentShopsComment(params) {
		return axios.get(`remark/dpcomment/findByShopId?shopid=${params.id}&pageNum=${params.pageNum}&pageSize=${params.pagesize}`).then(data => {
			return data.data;
		})
	},

	//根据商家id来获取对应商家评论的初始化值
	initPaymentShopsCommentNum(params) {
		return axios.get(`remark/v2/dpcomment/selectByShopInit?shopid=${params}`).then(data => {
			return data.data;
		})
	},

	//根据商家id获取评论总数
	getPaymentShopsCommentNum(params) {
		return axios.get(`remark/v2/dpcomment/findByShopNum?shopid=${params}`).then(data => {
			return data.data;
		})
	},

	//上传图片
	uploadImg(form) {
		return axios.post('remark/v2/dpcomment/createpartfile', form, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		}).then(res => {
			return res.data;
		})
	},

	//查询兑换比例信息
	getExhcangeScale(params) {
		return axios.get(`/live/conf/exchangeRateList`).then(data => {
			return data.data;
		})
	},

	//上传图片
	uploadImg(form) {
		return axios.post('remark/v2/dpcomment/createpartfile', form, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		}).then(res => {
			return res.data;
		})
	},

	//上传评论
	uploadComment(CommentUntll) {
		return axios({
			method: 'post',
			url: `remark/v2/dpcomment/createComment`,
			data: CommentUntll,
		}).then(data => {
			return data.data;
		})
	},

	//随机获取3个商家
	getRoundShops(params) {
		return axios({
			url: `/remark/v2/dpshop/findshopByRandom?typeid=${params.typeid}&lat=${params.lat}2&lng=${params.lng}&addr=${params.addr}`
		}).then(data => {
			return data.data;
		})
	},

	//生成金币兑换订单
	getGoldEchangeOrder(params) {
		return axios.post(`/live/vip/vipOrder?payment=${params.payment}&name='兑换金币兑换金币'&paytype=3&muchid=1&totalcoin=${params.totalcoin}`).then(data => {
			return data.data;
		})
	},

	//金币兑换
	goldExchange(params) {
		return axios({
			url: `/pay/payLive/cannisChange?billNo=${params}`
		}).then(data => {
			return data.data;
		})
	},


	//加入购物车
	addGoodsCar(params) {
		return axios.get(`shop/v2/cart/addCartItem?itemid=${params.itemid}&num=${params.num}&propertyId=${params.propertyId}`).then(data => {
			return data.data;
		})
	},
	createShopOrder(params) {
		return axios.post('shop/v2/order/createOrder', JSON.stringify(params)).then(data => {
			return data.data;
		})
	},

	//获取所有分类商家的信息
	getShopInfo(params) {
		return axios.get(`/remark/v2/dpshop/findByTypeAll?lng=${params.lng}&lat=${params.lat}&pageNum=${params.pageNum}&pageSize=${params.pageSize}&addr=${params.addr}`).then(data => {
			return data.data;
		})
	},
	//获取分类id所有分类商家的信息
	getShopInfoTotypeid(params) {
		return axios.get(`/remark/v2/dpshop/findByTypeID?lng=${params.lng}&lat=${params.lat}&pageNum=${params.pageNum}&pageSize=${params.pageSize}&addr=${params.addr}&typeid=${params.typeid}`).then(data => {
			return data.data;
		})
	},

	//获取支付列表
	getPayList(params) {
		return axios.get(`pay/bill/payChannel?way=${params}`).then(data => {
			return data.data;
		})
	},
	//查询兑换比例信息
	getExhcangeScale(params) {
		return axios.get(`/live/conf/exchangeRateList`).then(data => {
			return data.data;
		})
	},
	//ipm1支付
	ipmpay(params) {
		return axios.get(`/pay/bill/nsmPay?way=${params.way}&coinType=${params.payList}&billNo=${params.billNo}`).then(data => {
			return data.data;
		})
	},





	/////////////////////////////////////////////////////////////陈////////////////////////////////////////////

	//首页导航标题(热门大促,主播优选,必买清单) 
	getTabbaTitle() {
		return axios.get(`/shop/recomproduct/selectByLanguage?pageNum=1&pageSize=3`).then(res => {
			return res.data;
		})
	},

	// 优惠买单接口

	//更改订单价格
	updataOrder(params) {
		return axios.get(`remark/dpshop/updateBill?billId=${params.billId}&price=${params.price}&discount=${params.discount}&userPrice=${params.userPrice}`).then(res => {
			return res.data;
		})
	},

	// 必买页面随机获取排行4条(版本1)
	getPopularRanking() {
		return axios.get(`shop/recomproduct/selectByTypeId?typeid=3&pageNum=1&pageSize=4`).then(res => {
			return res.data;
		});
	},

	/* 随机获取3个商品 */
	getThreeShop() {
		return axios.get(`shop/v2/recomproduct/selectByTypeId?typeid=3`).then(res => {
			return res.data;
		});
	},


	// 获取所有商家信息
	getAllPayShops(page, pagesize) {
		return axios.get(`/remark/dpshop/findshopByAll?pageNum=${page}&pageSize=${pagesize}`).then(data => {
			return data.data
		})
	},
	// 根据id获取商家详细信息
	getDetailShop(id) {
		return axios.get(`/remark/dpshop/findshopByid?id=${id}`).then((data) => {
			return data.data
		})
	},
	// 根据商家id来获取评论信息
	getShopComments(id, pagenum, pagesize) {
		return axios.get(`/remark/dpcomment/findByShopId?shopid=${id}&pageNum=${pagenum}&pageSize=${pagesize}`).then((data) => {
			return data.data
		})
	},
	// 根据商家id获取评论总数
	getShopCommentsNum(id) {
		return axios.get(`/remark/dpcomment/findByShopNum?shopid=${id}`).then((data) => {
			return data.data
		})
	},
	// 执行收藏功能
	collect(params) {
		return axios.post('/remark/dprecomshop/insertRecomShop', qs.stringify(params)).then((data) => {
			return data.data
		})
	},
	// 查询是否收藏
	searchSelect(shopid) {
		return axios.get(`/remark/dprecomshop/findByRocomShopStatus?shopId=${shopid}`).then((data) => {
			return data.data
		})
	},
	// 创建优惠买单的订单
	createOrder(params) {
		return axios.post('/remark/dpshop/createBill', qs.stringify(params)).then((data) => {
			return data.data
		})
	},
	// 账单信息查询
	searchOrderInfo(billId, k) {
		return axios.get(`/remark/dpshop/findByDpShop?orderId=${billId}&key=${k}`).then((data) => {
			return data.data
		})
	},
	//获取充值排行榜数据
	getRechargeData() {
		return axios.get('/live/vip/liveRechargeRank').then(data => {
			return data.data
		})
	},
	// 获取PK排行榜截至时间
	getStopTime() {
		return axios.get('/live/rank/getSystemTime').then(data => {
			return data.data
		})
	},
	// 获取邀请码 
	getPleaseCode(uid) {
		return axios.get(`/live/live/findUser_v2?useridx=${uid}`, {
			headers: {
				'netType': '1'
			}
		}).then(data => {
			return data.data
		})
	},

	/* 获取优惠购物banner图 */
	getPaymentBanner() {
		return axios.get(`/remark/v2/adspots/selectByAdspots?title=0`).then(res => {
			return res.data;
		});
	},

	// 获取首页推荐商家信息
	getPaymentRecommendShops(addr, lng, lat, pageNum, pageSize) {
		return axios.get(`/remark/dprecomshop/findByAll?addr=${addr}&lng=${lng}&lat=${lat}&pageNum=${pageNum}&pageSize=${pageSize}`).then(data => {
			return data.data
		})
	},

	// 关键字搜索商家
	getKeyWordShops(keyWords, page, pagesize) {
		return axios.get(`/remark/dpshop/findByShopName?name=${keyWords}&pageNum=${page}&pageSize=${pageSize}`).then(data => {
			return data.data
		})
	},


	/////////////////////////////////王
	//获取nav条数（热门大促 主播优选 必买清单）
	getNavNum() {
		return axios
			.get(`shop/recomproduct/selectByTypeAll?pageNum=1&pageSize=3`)
			.then(data => {
				return data.data;
			});
	},

	postaddress(params) {
		return axios.post(`shop/shoppingaddress/addShoppingAddress`, params);
	},
	getAddress(params) {
		return axios
			.get(`shop/shoppingaddress/selectByUserIdAll?uid=60000267`)
			.then(data => {
				return data.data;
			});
	},
	///GEThttp://173.248.226.49:8604/shop/shoppingaddress/updateShopping?id=1 根据地址id来查询收货地址
	getFindAddressId(params) {
		return axios
			.get(`shop/shoppingaddress/updateShopping?id=${params}`)
			.then(data => {
				return data.data;
			});
	},
	///POST /shoppingaddress/updateShoppingAddress 修改后的地址发送到该接口
	getEditAddress(params) {
		return axios
			.post(`shop/shoppingaddress/updateShoppingAddress`, params)
			.then(data => {
				return data.data;
			});
	},
	//http://173.248.226.49:8604/shop/shoppingaddress/deleteShopping?id=4 根据用户的Id来删除地址
	postAdressIdDelete(params) {
		return axios
			.post(`shop/shoppingaddress/deleteShopping?id=${params}`)
			.then(data => {
				return data.data;
			});
	},
	//商家推荐的api 按照排序来查询商家排行（2018/7/18/16：14）
	getShopRanking(params) {
		return axios
			.get(
				`shop/recomshop/selectShopAll?pageNum=${params.pageNum}&pageSize=${
				params.pageSize
				}`
			)
			.then(data => {
				return data.data;
			});
	},
	//根据精选状态来查询商家http://173.248.226.49:8604/shop/recomshop/findByStatus?pageNum=1&pageSize=6
	getShopStatue(params) {
		return axios
			.get(
				`shop/recomshop/findByStatus?&pageNum=${params.pageNum}&pageSize=${
				params.pageSize
				}`
			)
			.then(data => {
				return data.data;
			});
	},
	//根据根据关键字来查询商家http://173.248.226.49:8604/shop/recomshop/findByName?name=%E4%BC%91%E9%97%B2%E5%95%86%E5%AE%B6&pageNum=1&pageSize=6
	getGoodsNameSearch(params) {
		return axios
			.get(
				`shop/recomshop/findByName?&name=${params.name}&pageNum=${
				params.pageNum
				}&pageSize=${params.pageSize}`
			)
			.then(data => {
				return data.data;
			});
	},
	getAllShop(params) {
		return axios
			.get(
				`shop/shop/findAll?pageNum=${params.pageNum}&pageSize=${
				params.pageSize
				}`
			)
			.then(data => {
				return data.data;
			});
	},

	//根据主键Id来获取商家的信息
	getIdShop(params) {
		return axios.get(`shop/shop/findById?id=${params}`).then(data => {
			return data.data;
		});
	},
	//修改默认地址
	updateDefault(params) {
		return axios
			.get(
				`shop/shoppingaddress/updateStatus?id=${params.id}&isdefault=${
				params.isdefault
				}`
			)
			.then(res => {
				return res.data;
			});
	},

	///根据商家id来获取该商家下的商品//http://173.248.226.49:8604/shop/shop/findById?id=4///http://173.248.226.49:8604/shop/item/findItemByShopId?shopid=1&pageNum=2&pageSize=9
	getIdShopGoods(params) {
		return axios
			.get(`shop/v2/item/findItemByShopId?shopid=${params}&pageNum=2&pageSize=9`)
			.then(data => {
				return data.data;
			});
	},

	//加入购物车

	getGoodsCar(params) {
		return axios
			.get(`shop/cart/addCartItem?itemid=${params.itemid}&num=${params.num}`)
			.then(data => {
				return data.data;
			});
	},

	//////////////////////////////////////汪

	// 优惠买单接口

	//商品详情页
	commodityDetails(params) {
		return axios.get(`shop/item/findJBItemById?id=${params.id}`).then(res => {
			return res.data;
		});
	},
	//渲染商品详情最底部的图片
	applyImg(id) {
		return axios.get(`shop/item/findDetilItemById?id=${id}`).then(res => {
			return res.data;
		});
	},
	//随机获取3个商家
	getmerchant() {
		return axios.get("/remark/dpshop/findshopByRandom").then(res => {
			return res.data;
		});
	},
	commentStarLevel(params) {
		return axios
			.post("/remark/dpcomment/insertcomment", qs.stringify(params))
			.then(res => {
				return res.data;
			});
	},
	//根据id来搜索该商家的商品
	searchCom(shopid, name, pageNum, pageSize) {
		return axios
			.get(
				`/shop/item/findItemByShopName?shopid=${shopid}&name=${name}&pageNum=${pageNum}&pageSize=${pageSize}`
			)
			.then(res => {
				return res.data;
			});
	},

	/* 随机获取3个商品 */
	getThreeShop() {
		return axios
			.get(`shop/v2/recomproduct/selectByTypeId?typeid=3`)
			.then(res => {
				return res.data;
			});
	},


	/* 第二版本    汪*/
	// 热门大促
	getPopularpromotion(pageNum, pageSize) {
		return axios
			.get(
				`shop/v2/recomproduct/selectByType?typeid=1&pageNum=${pageNum}&pageSize=${pageSize}`
			)
			.then(data => {
				return data.data;
			});
	},
	//主播优选
	getAnchoroptimization(pageNum, pageSize) {
		return axios
			.get(
				`shop/v2/recomproduct/selectByType?typeid=2&pageNum=${pageNum}&pageSize=${pageSize}`
			)
			.then(data => {
				return data.data;
			});
	},
	//必买清单
	getmustlist(pageNum, pageSize) {
		return axios
			.get(
				`shop/v2/recomproduct/selectByType?typeid=3&pageNum=${pageNum}&pageSize=${pageSize}`
			)
			.then(data => {
				return data.data;
			});
	},

	//根据商品Id来获取商品详情
	getProductDetail(params) {
		return axios.get(`shop/v2/item/findJBItemById?id=${params}`).then(data => {
			return data.data;
		});
	},
	commodityDetails(params) {
		return axios
			.get(`shop/v2/item/findJBItemById?id=${params.id}`)
			.then(res => {
				return res.data;
			});
	},
	//详情里面的颜色分类     colorClassify以及renderClassify已经被pooledData合并了
	// colorClassify(itemTypeId) {
	//   return axios
	//     .get(`shop/v2/typeProperty/selectByitemTypeId?itemTypeId=${itemTypeId}`)
	//     .then(res => {
	//       return res.data;
	//     });
	// },
	//根据商品id来获取颜色分类以及套餐类型
	// renderClassify(itemId) {
	//   return axios
	//     .get(`shop/v2/typeProperty/selectByname?itemId=${itemId}`)
	//     .then(res => {
	//       return res.data;
	//     });
	// },
	//弹出框中价格接口
	getPrice(itemId) {
		return axios.get(`shop/v2/item/findItem?itemId=${itemId}`).then(res => {
			return res.data;
		});
	},
	//加入购物车中选中的商品
	joinShopCar(params) {
		return axios.get("shop/v2/typeProperty/selectByitemType?", {
			params
		});

		/* return axios
		  .get(
		    `shop/v2/typeProperty/selectByitemType?itemId=${params.itemId}&color=${
		      params.color
		    }&size=${params.size}&Cname=${params.Cname}`
		  )
		  .then(res => {
		    return res.data;
		  }); */
	},
	//选中商品后显示对应的价格
	selectCommodityPrice(itemTypeId) {
		return axios
			.get(`shop/v2/item/findJBProperty?itemTypeId=${itemTypeId}`)
			.then(res => {
				return res.data;
			});
	},
	//弹出框中的数据api
	pooledData(itemId, itemTypeId) {
		return axios
			.get(
				`shop/v2/typeProperty/selectByItem?itemId=${itemId}&itemTypeId=${itemTypeId}`
			)
			.then(res => {
				return res.data;
			});
	},
	//人气排名更多
	morePopularRanking(parentid) {
		return axios
			.get(`shop/type/getByParentId?parentid=${parentid}`)
			.then(res => {
				return res.data;
			});
	},

	/* 优惠买单中的五个图标 */
	fiveIcon(id) {
		return axios.get(`remark/v2/shopType/selectByShopType?parentId=${id}`).then(res => {
			return res.data;
		});
	},

	/* 优惠买单中banner图,分别对应美食,娱乐，酒店，电影，ktv */
	getFood() {
		return axios.get(`remark/v2/adspots/selectByAdspots?title=1`).then(res => {
			return res.data;
		});
	},

	/* 优惠买单中首页美食相关的商家 */
	getPlayStore(params) {
		return axios
			.get(
				`remark/v2/dpshop/findShopByTypeId?typeid=${params.typeid}&addr=${params.addr}&pageNum=${
				params.pageNum
				}&pageSize=${params.pageSize}&lng=${params.lng}&lat=${params.lat}`
			)
			.then(res => {
				return res.data;
			});
	},




}
