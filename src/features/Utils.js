
import axios from 'axios'

import AppConfig from '@/App.Config.js'
var gConfig = AppConfig();


export default function Utils() {
	return {
		getUUID(){
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});
		},
		E(str) {
			return document.getElementById(str);
		},
		Q(str) {
			return document.querySelector(str);
		},
		Qo(obj,str) {
			if(!obj) return null;
			var rv = obj.querySelector(str);
			// delete obj;
			return rv;
		},
		Qs(str) {
			return document.querySelectorAll(str);
		},
		Qos(obj,str) {
			if(!obj) return null;
			var rv = obj.querySelectorAll(str);
			// delete obj;
			return rv;
		},
		getAttr(obj,attr) {
			if(!obj) return null;
			if(typeof obj.getAttribute != "function") return null;
			return obj.getAttribute(attr);
		},
		setAttribute (obj,attrName, attrValue) {
			if(!obj) return null;
			if(typeof obj.getAttribute != "function") return null;
			obj.setAttribute(attrName,attrValue);
		},
		setAttr(o, attrs) {
			if(!o) return false;
			if(o && o.length > 0) {
				for(var i=0; i<o.length; i++) {
					for( key in attrs) {
						var v = _U.getAttr(o[i],key);
						if(v != attrs[key]) {
							_U.setAttribute(o[i], key, attrs[key]);
						}
					}
				}
			}
			else {
				for( var key in attrs) {
					var v = _U.getAttr(o,key);
					if(v != attrs[key]) {
						_U.setAttribute(o, key, attrs[key]);
					}
				}
			}
			return true;
		},
		isNumber(v) {
			if(typeof v == 'number') return true;
			return false;
		},
		isDefined(o,v) {
			if(!o) return false;
			if(typeof o[v] == 'undefined' || o[v] == null) return false;
			else return true;
		},
		getIfDefined(o, arr) {

			if(this.isArray(arr) && arr.length > 0) {
				var found = true;
				var obj = o;
				for(var i=0; i<arr.length; i++) {
					var nn = arr[i];
					if(this.isDefined(obj, nn)) {
						obj = obj[nn];
					}else{
						found = false;
						break;
					}
				}
				return found == true ? obj : null; // last value
			}else{
				return this.isDefined(o,arr) ? o[arr] : null;
			}
		},
		isArray(o,v) {
			if(v) {
				return ( this.isDefined(o,v) && this.isDefined(o[v],'join') ? true : false );
			}else{
				return this.isDefined(o,'join');
			}
		},

		getTime() {
			if(typeof Date.now == 'function') {
				return Date.now();
			}else{
				return new Date().getTime();
			}
		},

		getCapitalChar(str) {
			if(!str) return '';
			var ch = str.substr(0,1);
			if(ch) {
				return ch.toUpperCase();
			}
			return '';
		},

		getCreateTime(str) {
			if(!str) return '';
			var ch = str.substr(0,10);
			if(ch) {
				return ch.toUpperCase();
			}
			return '';
		},

		encodeUrl (str) {
			if(!str) return '';
			return encodeURIComponent(str).replace(/'/g,"%27").replace(/"/g,"%22");
		},
		decodeUrl(str) {
			if(!str) return '';
			return decodeURIComponent(str.replace(/\+/g,  " "));
		},

		getFormParams(data) {
			var params = new URLSearchParams();
			for(var key in data) {
				params.append(key, data[key]);
			}
			return params;
		},

		callPost(J) {
			var data = gConfig.getPostData(J.data);
			var params =_U.getFormParams(data);
			var options = {
				headers: { "Content-Type": (_U.isDefined(J,'dtaType') ? J.dataType : "application/x-www-form-urlencoded") }
			};
			axios.post(J.url, params, options )
			.then((resp)=>{
				J.callback(resp);
			});
		},

		callSMS(data,callbackSMS) {

			console.log("[Utils] callSMS()-> req ", data);

			_U.callPost({
				url:gConfig.sms_url,
				data: data,
				callback: (resp) =>{
					callbackSMS(resp);
				}
			});

		},

		callEmail(data,callbackEmail) {

			console.log("[Utils] callEmail()-> req ", data);

			_U.callPost({
				url:gConfig.email_url,
				data: data,
				callback: (resp) =>{
					callbackEmail(resp);
				}
			});

		},

		checkCert(data,callbackCert) {
			_U.callPost({
				url:gConfig.check_cert,
				data: data,
				callback: (resp) =>{
					callbackCert(resp);
				}
			});
		},

		getObserver() {
			// usage : observer01 = _U.getObserver();
			// observer01.observe(_U.Q('.aaa'));
			// observer01.unobserve(_U.Q('.aaa'))
			// observer01.disconnect()// 모두 중지
			// intersection (뷰에 object가 보이는지 판단)
			// https://heropy.blog/2019/10/27/intersection-observer/
			// https://coolcssanimation.com/how-to-trigger-a-css-animation-on-scroll/
			return new IntersectionObserver(entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						_U.setAttr(entry.target,{isdisplayed:"on"});
						return; // if we added the class, exit the function
					}
					_U.setAttr(entry.target,{isdisplayed:"off"});
				});
			});
		},

	}

}
