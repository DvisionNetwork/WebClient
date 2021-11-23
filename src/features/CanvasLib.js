/* JnJ Tech. KOREA.
*/
/*----------------------------------------------------------------------*\
 J&J Technology Co. Confidential
 Licensed Materials - Property of J&J Technology Co. KOREA
 (C) COPYRIGHT J&J Technology, Co. 2019,2020,2021 All rights reserved.

 Author   : Ja-Cheon Yoon
 Date     : 2019-04-29
 Version  : 1.0
 Purpose  : CanvasLib of J&J Technology

 Ja-Cheon Yoon, Ph.D.        email: j c y o o n @ j n j t . c o . k r
\*----------------------------------------------------------------------*/

import AppConfig from '@/App.Config.js'
var gConfig = AppConfig();


export default function CanvasLib() {
	var _O = {};

	_O.Data = {
		cvId:'',
		blocks:[],
		landInfo: {},
		selectedId: null,
		cvInfo : {
			'main': Array(), // {cv: cv, cvId: cvId, coord:coord, ctx: ctx};
			'drawing' : Array()
		},
		setCvInfo(cvId,type,info) {
			this.cvInfo[type][cvId] = info;
		},
		getCvInfo(cvId,type) {
			return this.cvInfo[type][cvId];
		},
	};

	_O.init= function(cvId,landInfo) {
		_O.Data.cvId = cvId;
		_O.Data.landInfo = landInfo;
		_O.Ctrl.initTypes(cvId,'main');
		_O.Ctrl.initTypes(cvId,'drawing');

		var dxy = _O.Ctrl.getCv2LandDxy(cvId,'main');
		_O.Ctrl.setCoord(dxy); // canvas center
	};

	_O.Func = {

		draw(cvInfo, blocks, mons, selectedId) {
			_O.Data.selectedId = typeof selectedId == 'undefined' ? null : Number(selectedId);
			_O.Data.blocks = blocks;
			_O.Data.mons = mons;
			this.drawBgLines(cvInfo);
			// this.drawBg(cvInfo);
			// this.drawLines(cvInfo);
			this.drawBlocks(cvInfo);
			this.drawMons(cvInfo);
		},
		reDraw(selectedId) {
			_O.Data.selectedId = typeof selectedId == 'undefined' ? _O.Data.selectedId : Number(selectedId);
			var cvInfo = _O.Data.getCvInfo(_O.Data.cvId, 'main');
			_O.Ctrl.clearCV(_O.Data.cvId, 'main');
			this.drawBgLines(cvInfo);
			// this.drawBg(cvInfo);
			// this.drawLines(cvInfo);
			this.drawBlocks(cvInfo);
			this.drawMons(cvInfo);
		},

		drawBgLines(cvInfo) {
			var info = _O.Data.landInfo;
			var w= info.width;
			var h= info.height;
			var s = info.blockSize;

			var bg = info.cvStyle.bg;

			var cvH = cvInfo.cv.clientHeight;
			var cvW = cvInfo.cv.clientWidth;

			var r = Math.ceil(gConfig.canvas.blockSizeMax / gConfig.canvas.blockSizeMin) +1;
			var cvRect = {
				x1: cvW * r * -1,
				x2: cvW * r,
				y1: cvH * r * -1,
				y2: cvH * r
			};
			// console.log("@@ cvRect:", cvRect, cvInfo, info);

			// 가로 라인
			for(var y=cvRect.y1; y < cvRect.y2; y++) {
				var line = {
					x1: cvRect.x1*s, y1: y*s,
					x2: cvRect.x2*s, y2: y*s
				};
				_O.Line.draw(cvInfo.ctx, cvInfo.coord,
					line, bg.lineColor, bg.lineWidth,
				);
			}
			// 세로 라인
			for(var x=cvRect.x1; x < cvRect.x2; x++) {
				var line = {
					x1: x*s, y1: cvRect.y1*s,
					x2: x*s, y2: cvRect.y2*s
				};
				_O.Line.draw(cvInfo.ctx, cvInfo.coord,
					line, bg.lineColor, bg.lineWidth,
				);
			}
		},

		drawBg(cvInfo) {
			var info = _O.Data.landInfo;
			var bs = info.blockSize;
			var halfW = Math.ceil((cvInfo.coord.w/2)/bs);
			var halfH = Math.ceil((cvInfo.coord.h/2)/bs);
			var spare = 5;
			var cvRect = {
				x1: (halfW * -1 - spare ) * 2,
				x2: (halfW + spare ) * 2,
				y1: (halfH * -1 - spare ) * 2,
				y2: (halfH + spare) * 2
			};

			// console.log("[CV] cvInfo ", bs, halfW, cvRect, info, cvInfo.coord, cvInfo.cv);
			for(var x=cvRect.x1; x < cvRect.x2; x++) {
				for(var y=cvRect.y1; y < cvRect.y2; y++) {
					var block = {x1:x, y1:y, x2:x, y2:y, lineWidth: 0};
					var rect = this.getRect(block);
					// console.log("[CV] drawBg ========== rect["+x+","+y+"]=", rect);
					var color = gConfig.canvas.bgLineColor; // "rgba(255,255,0,0.5)"; // line color
					var fillColor = gConfig.canvas['bgFillColor_'+(Math.abs(x+y)%2).toString()];
					var lineWidth = 1; //  info.lineWidth;

					_O.Rect.draw(cvInfo.ctx, cvInfo.coord, rect, color, lineWidth, fillColor);
				}
			}

		},
		drawLines(cvInfo) {

			var info = _O.Data.landInfo;
			var w= info.width;
			var h= info.height;
			var s = info.blockSize;

			var lw = info.lineWidth;

			// 가로 라인
			for(var y=0; y <= h; y++) {
				var line = {x1:0, y1:y*s, x2: w*s, y2: y*s};
				_O.Line.draw(cvInfo.ctx, cvInfo.coord,
					line, info.lineColor, lw,
				);
			}
			// 세로 라인
			for(var x=0; x <= w; x++) {
				var line = {x1:x*s, y1:0, x2:x*s, y2: h*s};
				_O.Line.draw(cvInfo.ctx, cvInfo.coord,
					line, info.lineColor, lw
				);
			}

		},
		drawBlocks(cvInfo) {
			var drawSeq = gConfig.canvas.drawSequence;
			for(var i=0; i<drawSeq.length; i++) {
				_O.Func.drawBlockType(cvInfo,drawSeq[i]);
			}
		},
		drawMons(cvInfo) {
			var blocks = _O.Data.mons;
			for(var i=0; i<blocks.length; i++) {
				var block = blocks[i];
				block.lineWidth = 1;
				var rect = this.getRect(block);
				var style = gConfig.canvas.monsterBlock;

				_O.Rect.draw(cvInfo.ctx, cvInfo.coord, rect, style.lineColor, style.lineWidth, style.fillColor);

				var cRect = _O.Utils.getCenterRect(rect, 0.7); // margin rate : 0.7
				var imgName ='m_'+(i%2).toString();
				// _O.Image.drawImage(cvInfo.ctx, cvInfo.coord, cRect, {mapId: "monster", name:imgName});
			}
		},
		drawBlockType(cvInfo, blockType) {
			var blocks = _O.Data.blocks;
			for(var i=0; i<blocks.length; i++) {
				var block = blocks[i];
				if(blockType=='selected' && block.id == _U.getIfDefined(_O.Data,'selectedId')) {
					_O.Func.drawBlock(cvInfo, block);
					break;
				}

				if(block.c != blockType) continue;
				_O.Func.drawBlock(cvInfo, block);
			}
		},
		drawBlock(cvInfo,block) {

			var info = _O.Data.landInfo;
			// console.log("==================== info:",info, gConfig.canvas.landBlock, block);

			var style = info.cvStyle.landBlock[block.c.toString()];
			var fillColor = _U.getIfDefined(style,'fillColor');
			if(!fillColor) fillColor = "rgba(255,255,255,0)";
			var lineColor = _U.getIfDefined(style,'lineColor');
			if(!lineColor) lineColor = "rgba(255,255,255,0)";
			var lineWidth = _U.getIfDefined(style,'lineWidth');
			// console.log("===================== lineWidth",style, lineWidth);
			if(lineWidth==null) lineWidth = 1;

			if(block.id == _U.getIfDefined(_O.Data,'selectedId')) {
				var sStyle = info.cvStyle.selectedBlock;
				lineColor = sStyle.lineColor;
				fillColor = sStyle.fillColor;
				lineWidth = sStyle.lineWidth;
			}

			block.lineWidth = lineWidth;
			var rect = this.getRect(block);
			// console.log("========== rect",  _O.Data.selectedId, block, info.center, info.blockSize, block.id, rect);
			_O.Rect.draw(cvInfo.ctx, cvInfo.coord, rect, lineColor, lineWidth, fillColor);

			if(block.logo_url) {
				var rect = this.getRect(block);
				var cRect = _O.Utils.getCenterRect(rect, 0.7); // margin rate : 0.7
				var imgName = block.logo_url;
				_O.Image.drawImage(cvInfo.ctx, cvInfo.coord, cRect, {mapId: info.mapId, name:imgName});
			}

			// line draw again
			if(block.id == '-1' || block.id == _U.getIfDefined(_O.Data,'selectedId')) { // cnter
				block.lineWidth = 1;
				var rect = this.getRect(block);
				_O.Rect.drawRectLine(cvInfo.ctx, cvInfo.coord, rect, info.cvStyle.bg.lineColor, 1);
			}

			if(block.id == '-1') {
				var s = info.blockSize;
				block.lineWidth = 1;
				var rect = this.getRect(block);
				var cRect = _O.Utils.getCenterRect(rect, 0.7); // margin rate : 0.7
				// var imgName ='centerLogoImg';
				// _O.Image.drawImage(cvInfo.ctx, cvInfo.coord, cRect, {mapId: info.mapId, name:imgName});
			}
		},

		centerOnBlock(blockId) {
			if(typeof blockId == 'undefined' || blockId==null) return;
			var dxy = this.getBlockDxy(blockId);
			if(dxy) {
				this.move(dxy);
			}
		},
		getBlockDxy(blockId) {
			var block = this.getBlock(blockId);
			if(!block) return null;
			// console.log("================= block:", block);
			var info = _O.Data.landInfo;
			var c = info.center;
			var s = info.blockSize;
			return {
				dx: Math.floor((block.x1 + (block.x2 - block.x1)/2 + c.dx) * s * -1),
				dy: Math.floor((block.y1 + (block.y2 - block.y1)/2 - c.dy) * s)
			};
		},
		getBlock(blockId) {
			// console.log("==================== blockId, blocks", blockId, _O.Data.blocks, _O.Data);
			var selectedBlock = null;
			var blocks = _O.Data.blocks;
			for(var i=0; i<blocks.length; i++) {
				// if(i==15) break;
				var block = blocks[i];
				if(block.id == blockId) {
					selectedBlock = block;
					break;
				}
			}
			return selectedBlock;
		},
		getRect(block) {
			var info = _O.Data.landInfo;
			var c = info.center;
			var s = info.blockSize;
			var lineW = (typeof block.lineWidth =='undefined' ? info.lineWidth : block.lineWidth);
			var inside = false;
			if(lineW > 1) {
				inside = true;
			}
			return {
				inside: inside,
				x: (block.x1 + c.x) * s + (inside ? lineW : 0),
				y: (c.y - block.y1) * s + (inside ? lineW : 0),
				w: (block.x2 - block.x1 + 1)*s - (inside ? lineW : 0)*2,
				h: (block.y1 - block.y2 + 1)*s - (inside ? lineW : 0)*2 // 좌상단 -> 우하단 : y는 -(minus) 방향임.

				// 좌하단 우상단
				// x: (block.x1 + c.x) * s + info.lineWidth,
				// y: (c.y - block.y2) * s + info.lineWidth,
				// w: (block.x2 - block.x1 + 1)*s - info.lineWidth*2,
				// h: (block.y2 - block.y1 + 1)*s - info.lineWidth*2 // 좌상단 -> 우하단 : y는 -(minus) 방향임.
			}
		},
		zoom(inOut,pointerPos) {
			// console.log("[CanvasLib] zoom inout:",inOut);
			var info = _O.Data.landInfo;
			var prevbs = info.blockSize;
			var bs = info.blockSize;
			var step = 1; // bs/2;
			if(inOut == 'in') {
				bs += step;
			}else{
				bs -= step;
			}
			if(bs <= info.blockSizeMin || info.blockSizeMax <= bs) {
				return;
			}

			// 캔버스 가운데 중심으로 확대
			var dx = Math.floor(info.width * step / 2); // (numOfBlocs(info.width) * increment_BlockSize(1)) /2
			var dy = Math.floor(info.height * step / 2);

			info.blockSize = bs;
			var pos = {dx: dx, dy: dy};
			if(inOut == 'in') {
				pos.dx *= -1;
				pos.dy *= -1;
			}

			// pointerPos (포인터 중심으로 이동)
			var cvInfo = _O.Data.getCvInfo(_O.Data.cvId, 'main');

			var cvx = info.center.ox * prevbs + cvInfo.coord.x;
			var cvy = info.center.oy * prevbs + cvInfo.coord.y;
			var ddx = (pointerPos.x - cvx) - bs/prevbs * (pointerPos.x - cvx) ;
			var ddy = (pointerPos.y - cvy) - bs/prevbs * (pointerPos.y - cvy) ;

			pos.dx += Math.floor(ddx);
			pos.dy += Math.floor(ddy);

			_O.Ctrl.setCoord(pos);

			this.reDraw();

		},
		// pos = { dx, dy }
		move(pos) {
			_O.Ctrl.setCoord(pos);
			this.reDraw();
		},
		getBlockPos(pos) {
			var cvInfo = _O.Data.getCvInfo(_O.Data.cvId, 'main');
			var coord = cvInfo.coord;
			var info = _O.Data.landInfo;
			var rect = {
				x: coord.x,
				y: coord.y,
				w: info.width * info.blockSize,
				h: info.height * info.blockSize
			}
			var isIn = _O.Utils.isPointInRect(rect, pos);
			if(!isIn) {
				// console.log("========= pos, rect",pos, rect);
				return null;
			}
			var x = Math.floor( (pos.x - coord.x) / info.blockSize );
			var y = Math.floor( (pos.y - coord.y) / info.blockSize );
			return {x: x - info.center.x, y: info.center.y - y};
		},

		getCenterBlockPos() {
			var cvInfo = _O.Data.getCvInfo(_O.Data.cvId, 'main');
			var coord = cvInfo.coord;
			var info = _O.Data.landInfo;
			var x = Math.floor( (coord.w/2 - coord.x) / info.blockSize );
			var y = Math.floor( (coord.h/2 - coord.y) / info.blockSize );
			return {x: x - info.center.x, y: info.center.y - y};
		},

	};

	_O.Ctrl = {
		getCV(cvId,type) {
			// console.log("========================= cvId, type", cvId, type);
			return _U.Q('#'+cvId+'[type="'+type+'"]');
		},

		initTypes(cvId, type) {

			var cv = _O.Ctrl.getCV(cvId,type);

			// When the canvas view is hidden, cv is null
			if(!cv) return null;

			var cvW = cv.clientWidth;
			var cvH = cv.clientHeight;
			cv.width = cvW;
			cv.height = cvH;
			var ctx = cv.getContext("2d");

			var coord = _O.Utils.getScaledCoord(cvW, cvH);
			ctx.clearRect(0, 0, cvW, cvH);

			// console.log("[CV] ==== ctx :", ctx);

			var cvInfo = {cv: cv, cvId: cvId, coord:coord, ctx: ctx};

			if(type=='main') {
				this.initMain(cvInfo);
			}
			if(type == 'drawing') {
				this.initDrawing(cvInfo);
			}

			_O.Data.setCvInfo(cvId,type,cvInfo);

			return cvInfo;
		},
		setCoord(pos) {

			var cvInfo = _O.Data.getCvInfo(_O.Data.cvId, 'main');
			if(!cvInfo) return;
			if(!pos) return;
			var landInfo = _O.Data.landInfo;
			var coordx = cvInfo.coord.x + pos.dx;
			var coordy = cvInfo.coord.y + pos.dy;
			var max_x = cvInfo.coord.w/2;
			var max_y = cvInfo.coord.h/2;

			// cvInfo.coord.x = coordx;
			// cvInfo.coord.y = coordy;
			// return;
			// console.log("=============== ", coordx , landInfo.width * landInfo.blockSize , cvInfo.coord.w);
			if(coordx < max_x && coordx + landInfo.width*landInfo.blockSize > cvInfo.coord.w - max_x) {
				cvInfo.coord.x = coordx;
			}
			if(coordx >= max_x) {
				cvInfo.coord.x = max_x;
			}
			if(coordx + landInfo.width*landInfo.blockSize <= cvInfo.coord.w - max_x) {
				cvInfo.coord.x = cvInfo.coord.w - max_x - landInfo.width*landInfo.blockSize ;
			}


			if(coordy < max_y && coordy + landInfo.height*landInfo.blockSize > cvInfo.coord.h - max_y) {
				cvInfo.coord.y = coordy;
			}
			if(coordy >= max_y) {
				cvInfo.coord.y = max_y;
			}
			if(coordy + landInfo.height*landInfo.blockSize <= cvInfo.coord.h - max_y) {
				cvInfo.coord.y = cvInfo.coord.h - max_y - landInfo.height*landInfo.blockSize;
			}

		},
		getCv2LandDxy(cvId,type) {
			var landInfo = _O.Data.landInfo;
			var cv = _O.Ctrl.getCV(cvId,type);
			if(!cv) return;
			var ox = landInfo.center.ox * landInfo.blockSize;
			var oy = landInfo.center.oy * landInfo.blockSize;
			var cx = Math.floor(cv.width / 2);
			var cy = Math.floor(cv.height / 2);
			return {dx: cx - ox, dy: cy -oy };
		},

		clearCV(cvId,type) {
			var cv = _O.Ctrl.getCV(cvId,type);
			if(!cv) return null;
			var ctx = cv.getContext("2d");
			ctx.clearRect(0, 0, cv.width, cv.height);
		},
		initMain(cvInfo) {
		},
		initDrawing(cvInfo) {
		}
	};

	_O.Image = {

		imgObjs:{},

		// imgInfo {mapId: info.mapId, name:'centerLogoImg'}
		drawImage : function (ctx, coord, rect, imgInfo) {

			var oImg = _U.getIfDefined(_O.Image.imgObjs,[imgInfo.mapId, imgInfo.name]);
			if(oImg) {
				_O.Utils.openCtx(ctx);
					var sRect = _O.Utils.getScaledRect(coord,rect);
					ctx.drawImage(oImg, 0,0, oImg.width, oImg.height, sRect.x, sRect.y, sRect.w, sRect.h);
				_O.Utils.closeCtx(ctx);
			}else{
				var imgSrc = _U.getIfDefined(gConfig.canvas.imgList,[imgInfo.mapId, imgInfo.name]);
				if(!imgSrc) {
					imgSrc = imgInfo.name;
				}
				oImg = new Image();
				if(!_U.isDefined(_O.Image.imgObjs,imgInfo.mapId)) {
					_O.Image.imgObjs[imgInfo.mapId]= {};
				}
				_O.Image.imgObjs[imgInfo.mapId][imgInfo.name] = oImg;
				oImg.src = imgSrc;
				oImg.onload = function() {
					_O.Utils.openCtx(ctx);
						var sRect = _O.Utils.getScaledRect(coord,rect);
						ctx.drawImage(oImg, 0,0, oImg.width, oImg.height, sRect.x, sRect.y, sRect.w, sRect.h);
					_O.Utils.closeCtx(ctx);
				}
			}
		}
	};

	_O.Line = {
		// coord = { x1,y1, x2, y2 }
		// line ={x1,y1,x2,y2},
		draw(ctx, coord, line, color, lineWidth) {
			_O.Utils.openCtx(ctx);
				_O.Utils.setProperty(ctx,{color:color, lineWidth:lineWidth});
				var sLine = _O.Utils.getScaledLine(coord,line);
				_O.Utils.drawLine(ctx,sLine);
				ctx.stroke();
			_O.Utils.closeCtx(ctx);
		},
	};

	_O.Rect = {
		// cv, ctx, color : "rgba(200,30,50,0.5)"
		draw(ctx, coord, rect, color, lineWidth, fillColor) {
			// console.log('@@@@ Rect draw :: ',rect);
			_O.Utils.openCtx(ctx);
				var sRect = _O.Utils.getScaledRect(coord,rect);
				// console.log('@@@@ sRect draw :: ',sRect, color, lineWidth, fillColor);
				_O.Utils.setProperty(ctx,{color:color, lineWidth:lineWidth, fillColor:( fillColor ? fillColor : null)});
				ctx.fillRect(sRect.x, sRect.y, sRect.w, sRect.h);
				if(lineWidth>0) {
					if(fillColor && color != fillColor) {
						ctx.moveTo(sRect.x - Math.floor(lineWidth/2), sRect.y);
						ctx.lineTo(sRect.x+sRect.w, sRect.y);
						ctx.lineTo(sRect.x+sRect.w, sRect.y+sRect.h);
						ctx.lineTo(sRect.x, sRect.y+sRect.h);
						ctx.lineTo(sRect.x, sRect.y - Math.floor(lineWidth/2));
						ctx.stroke();
					}
				}
			_O.Utils.closeCtx(ctx);
		},
		drawRectLine(ctx, coord, rect, color, lineWidth) {
			// console.log('@@@@ Rect draw :: ',rect);
			_O.Utils.openCtx(ctx);
				var sRect = _O.Utils.getScaledRect(coord,rect);
				// console.log('@@@@ sRect draw :: ',sRect, color, lineWidth, fillColor);
				_O.Utils.setProperty(ctx,{color:color, lineWidth:lineWidth});
				// ctx.fillRect(sRect.x, sRect.y, sRect.w, sRect.h);
				if(lineWidth>0) {
					ctx.moveTo(sRect.x - Math.floor(lineWidth/2), sRect.y);
					ctx.lineTo(sRect.x+sRect.w, sRect.y);
					ctx.lineTo(sRect.x+sRect.w, sRect.y+sRect.h);
					ctx.lineTo(sRect.x, sRect.y+sRect.h);
					ctx.lineTo(sRect.x, sRect.y - Math.floor(lineWidth/2));
					ctx.stroke();
				}
			_O.Utils.closeCtx(ctx);
		},
	};

	_O.Utils = {
		openCtx(ctx) {
			ctx.save();
			ctx.beginPath();
		},
		closeCtx(ctx) {
			ctx.closePath();
			ctx.restore();
		},
		getColor(color) {
			return color ? color : gConfig.canvas.defaultColor;
		},
		getLineWidth(lw) {
			return typeof lw != 'undefined' ? lw : gConfig.canvas.defaultLineWidth ;
		},
		getFont(fontSize,fontName) {
			var fs = (fontSize ? fontSize : 14);
			var fn = (fontName ? fontName : 'sans-serif');
			return fs+'px '+fn;
		},
		drawLine(ctx,line) {
			ctx.moveTo(line.x1, line.y1);
			ctx.lineTo(line.x2, line.y2);
		},
		setProperty(ctx,prop) {
			var strokeStyle = this.getColor(prop.color);
			var fillStyle = ( prop.fillColor ? prop.fillColor : this.getColor(prop.color) );
			var lineWidth = this.getLineWidth(prop.lineWidth);
			if(prop.font) {
				var font = this.getFont(prop.font.fontSize, prop.font.fontName);
				ctx.font = font;
				ctx.textAlign = (typeof prop.font['textAlign'] == 'undefined' ? "center" : prop.font['textAlign']);
				ctx.textBaseline = (typeof prop.font['textBaseline'] == 'undefined' ? "middle" : prop.font['textBaseline']);
			}else{
				var font = this.getFont();
				ctx.font = font;
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
			}
			ctx.strokeStyle = strokeStyle;
			ctx.fillStyle = fillStyle;
			ctx.lineWidth = lineWidth;
		},
		getScaledCoord(cvW, cvH) {
			return {x:0, y:0, w:cvW, h:cvH, sR: 1};
		},
		getScaledRect(coord, rect) {
			var rv = {
				x : coord.x + rect.x * coord.sR,
				y : coord.y + rect.y * coord.sR,
				w : rect.w * coord.sR,
				h : rect.h * coord.sR,
				inside: rect.inside
			};
			return rv;
		},
		getScaledLine(coord, line) {
			var rv = {
				x1 : coord.x + line.x1*coord.sR,
				y1 : coord.y + line.y1*coord.sR,
				x2 : coord.x + line.x2*coord.sR,
				y2 : coord.y + line.y2*coord.sR
			};
			return rv;
		},
		isPointInRect(rect,pt) {
			var rv = false;
			if( rect.x <= pt.x && rect.y <= pt.y &&
				pt.x <= rect.x + rect.w && pt.y <= rect.y + rect.h
			) {
				rv = true;
			}
			return rv;
		},
		isPointInPoly(poly, pt) {
			if(!poly) return false;
			for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
				((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
				&& (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
				&& (c = !c);
			return c;
		},
		getCenterRect(rect,marginRate) {
			var smallSize = rect.w > rect.h ? rect.h : rect.w;
			var center = {
				x: Math.floor(rect.x + rect.w/2),
				y: Math.floor(rect.y + rect.h/2),
			}
			var smallSize = smallSize * marginRate;
			return {
				x : center.x - Math.floor(smallSize / 2),
				y : center.y - Math.floor(smallSize / 2),
				w : smallSize,
				h : smallSize
			}
		}
	};


	return _O;
}
