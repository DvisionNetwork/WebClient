import axios from 'axios'

import { gConfig } from '../App.Config'

export default class Utils {
    lv_checkDuplicateIds: any[] = [];

    getUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    E(str: string) {
        return document.getElementById(str);
    }

    Q(str: string) {
        return document.querySelector(str);
    }

    Qo(obj: Element, str: string) {
        if(!obj) return null;
        const rv = obj.querySelector(str);
        // delete obj;
        return rv;
    }

    Qs(str: string) {
        return document.querySelectorAll(str);
    }

    Qos(obj: Element, str: string) {
        if(!obj) return null;
        const rv = obj.querySelectorAll(str);
        // delete obj;
        return rv;
    }

    getAttr(obj: Element, attr: string) {
        if(!obj) return null;
        if(typeof obj.getAttribute != "function") return null;
        return obj.getAttribute(attr);
    }

    setAttribute (obj: Element, attrName: string, attrValue: string) {
        if(!obj) return null;
        if(typeof obj.getAttribute != "function") return null;
        obj.setAttribute(attrName,attrValue);
    }

    setAttr(o: any, attrs: any) {
        if(!o) return false;
        if(o && o.length > 0) {
            for(let i=0; i<o.length; i++) {
                for(const key in attrs) {
                    const v = this.getAttr(o[i],key);
                    if(v != attrs[key]) {
                        this.setAttribute(o[i], key, attrs[key]);
                    }
                }
            }
        }
        else {
            for(const key in attrs) {
                const v = this.getAttr(o,key);
                if(v != attrs[key]) {
                    this.setAttribute(o, key, attrs[key]);
                }
            }
        }
        return true;
    }

    isNumber(v: any) {
        if(typeof v == 'number') return true;
        return false;
    }

    getNumber(str: string) {
        const val = str;  let temp = "";  let num = "";
        for(let i=0; i<val.length; i++) {
            temp = val.charAt(i);
            if(temp >= "0" && temp <= "9") num += temp;
        }
        return num;
    }
    
    addComma(v: any) {
        if(!v) return '';

        let val, decimal;
        decimal='';
        const str = (typeof v == 'string' ? v : v.toString());

        if(str.indexOf(".") >= 0) {
            val = str.substring(0,str.indexOf("."));
            decimal = str.substring(str.indexOf("."));
        }else{
            val = str;
        }

        val = this.getNumber(val);

        if(val.length <= 3)
            return val+decimal;

        const loop = Math.ceil(val.length / 3);
        let offset = val.length % 3;
        if(offset==0) offset = 3;
        let ret = val.substring(0, offset);
        for(let i=1;i<loop;i++) {
            ret += "," + val.substring(offset, offset+3);
            offset += 3;
        }

        return ret+decimal;
    }

    isDefined(o: any, v: any) {
        if(!o) return false;
        if(typeof o[v] == 'undefined' || o[v] == null) return false;
        else return true;
    }

    getIfDefined(o: any, arr: any) {

        if(this.isArray(arr) && arr.length > 0) {
            let found = true;
            let obj = o;
            for(let i=0; i<arr.length; i++) {
                const nn = arr[i];
                if(this.isDefined(obj, nn)) {
                    obj = obj[nn];
                }else{
                    found = false;
                    break;
                }
            }
            return found == true ? obj : null; // last value
        }else{
            return this.isDefined(o, arr) ? o[arr] : null;
        }
    }

    isArray(o: string[], v?: any) {
        if(v) {
            return ( this.isDefined(o,v) && this.isDefined(o[v],'join') ? true : false );
        }else{
            return this.isDefined(o,'join');
        }
    }

    getTime() {
        if(typeof Date.now == 'function') {
            return Date.now();
        }else{
            return new Date().getTime();
        }
    }

    getCapitalChar(str: string) {
        if(!str) return '';
        const ch = str.substr(0,1);
        if(ch) {
            return ch.toUpperCase();
        }
        return '';
    }

    getCreateTime(str: string) {
        if(!str) return '';
        const ch = str.substr(0,10);
        if(ch) {
            return ch.toUpperCase();
        }
        return '';
    }

    encodeUrl (str: string) {
        if(!str) return '';
        return encodeURIComponent(str).replace(/'/g,"%27").replace(/"/g,"%22");
    }

    decodeUrl(str: string) {
        if(!str) return '';
        return decodeURIComponent(str.replace(/\+/g,  " "));
    }

    getFormParams(data: any) {
        const params = new URLSearchParams();
        for(const key in data) {
            params.append(key, data[key]);
        }
        return params;
    }

    callPost(J: any) {
        const data = gConfig.getPostData(J.data);
        const params =this.getFormParams(data);
        const options = {
            headers: { "Content-Type": (this.isDefined(J,'dtaType') ? J.dataType : "application/x-www-form-urlencoded") }
        };
        axios.post(J.url, params, options )
        .then((resp)=>{
            J.callback(resp);
        });
    }

    callSMS(data: any, callbackSMS: any) {
        console.log("[Utils] callSMS()-> req ", data);

        this.callPost({
            url: gConfig.sms_url,
            data: data,
            callback: (resp: any) =>{
                callbackSMS(resp);
            }
        });
    }

    callEmail(data: any, callbackEmail: any) {
        console.log("[Utils] callEmail()-> req ", data);

        this.callPost({
            url: gConfig.email_url,
            data: data,
            callback: (resp: any) =>{
                callbackEmail(resp);
            }
        });
    }

    checkCert(data: any, callbackCert: any) {
        this.callPost({
            url: gConfig.check_cert,
            data: data,
            callback: (resp: any) =>{
                callbackCert(resp);
            }
        });
    }

    getObserver() {
        // usage : observer01 = this.getObserver();
        // observer01.observe(this.Q('.aaa'));
        // observer01.unobserve(this.Q('.aaa'))
        // observer01.disconnect()// 모두 중지
        // intersection (뷰에 object가 보이는지 판단)
        // https://heropy.blog/2019/10/27/intersection-observer/
        // https://coolcssanimation.com/how-to-trigger-a-css-animation-on-scroll/
        return new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setAttr(entry.target,{isdisplayed:"on"});
                    return; // if we added the class, exit the function
                }
                this.setAttr(entry.target,{isdisplayed:"off"});
            });
        });
    }

    checkDuplicatedCall(J: any) {
        // console.error("=== TRACK === Util.checkDuplicatedCall() ", J);
        if(typeof J == 'undefined') J = {id:'jnjt',interval:500};
        if(!J || !J.id) return false;

        if(!this.lv_checkDuplicateIds[J.id]) {
            this.lv_checkDuplicateIds[J.id] = (typeof J.t =='undefined' ?  this.getTime() : J.t);
            return false;
        }

        const now = (typeof J.t =='undefined' ?  this.getTime() : J.t);
        if(now - this.lv_checkDuplicateIds[J.id] <= J.interval) {
            return true;
        }else{
            this.lv_checkDuplicateIds[J.id] = now;
            return false;
        }
    }
}