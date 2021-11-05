
/* JnJ Tech. KOREA.
*/
/*----------------------------------------------------------------------*\
 J&J Technology Co. Confidential
 Licensed Materials - Property of J&J Technology Co. KOREA
 (C) COPYRIGHT J&J Technology, Co. 2011,2012  All rights reserved.

 Author   : Ja-Cheon Yoon
 Date     : 2015-04-29
 Version  : 1.0
 Purpose  : Utils of J&J Technology

 Ja-Cheon Yoon, Ph.D.        email: j c y o o n @ j n j t . c o . k r
\*----------------------------------------------------------------------*/
// Usage jDB /////////////////////////////////
/*
	jDB.init({
		name:"DVI_DB",version:"1.0",desc:"Dvision DB created by JNJT", size: 1024*1024,
		tables: [
			{ name:"LandInfo", fields: "(x integer, y integer, id text, info text)" }
		]
	});
	jDB.insert({name:"LandInfo", fields:" (x, y, id, info) values ( ?, ?, ?, ?") ", values: [10,20,'u','u001'], callback: callbackInsert });

	jDB.select({name:"LandInfo", fields:" * ", where:" ", values: [], callback: callbackSelect });

	function callbackInsert (ok) {
		console.log("Insert Result::"+ok);
	}

	function callbackSelect (J) {
		if(!J || !J.rows) {
			console.log("No Selected Data");
			return;
		}
		for(var i=0;i<J.rows.length;i++) {
			console.log(" "+J.rows[i].id+" "+J.rows[i].content+" "+J.rows[i].indate );
		}
	}


	/////////////////////////////////////

		DB: {
			DBName: 'DVI_DB',
			version: '1.0',
			tableName: 'LandInfo',
			description: 'DVI DB',
			Size: 1024*1024*2
		},

		jDB.init({
				name: gConfig.DB.name, version: gConfig.DB.version, desc: gConfig.DB.description, size: gConfig.DB.size,
				tables: [
					{ name: gConfig.DB.tableName, fields: "(x integer, y integer, id text, info text)" }
				]
			});

			// if blocks.length !== select count
				jDB.initTable({name: gConfig.DB.tableName, callback:function(){}});
			// end if

			var values = "(10,10,'u','001'),(10,11,'u','002'),(10,13,'u','003')"
			// var values = "(?,?,?,?)"
			jDB.insert({
				name: gConfig.DB.tableName,
				fields: "(x, y, id, info) values " + values,
				// values: [10,10,'u','001'],
				values: [],
				callback: this.onDBInsert
			})

		},

		onDBInsert(e) {
			console.log('@@@@@@ e:',e);
		}
	///////////////////////////
*/
/////////////////////////////////////

export default function jDB() {
	var _O = {};
	_O.DB = null;
	_O.init = function (J) { // {name, version, desc, size, tables:[{name,fields},] }
		if(_O.DB) return;
		try{
			_O.DB = window.openDatabase(J.name,J.version,J.desc, J.size);
			for(var i=0;i<J.tables.length;i++) {
				var sql = "create table if not exists "+J.tables[i].name+" "+J.tables[i].fields+" ";
				_O.DB.transaction(
					function (tx) {
						tx.executeSql(sql);
					}
			);
		}
		}catch(e){
				console.error("Error Open DB");
		}
	};
	_O.initTable = function (J) {
		if(!_O.DB) return;
		_O.DB.transaction(
			function (tx) {
				// console.log("insert into "+J.name+" "+J["fields"]+" "+ J["values"])
				tx.executeSql(
					"delete from "+J.name+" ",
					[],
					function () { J.callback(true); },
					function () { J.callback(false);}
				);
			}
		);
	};
	_O.insert = function (J) { /// {name, fields = "(id, content) values (?,?)", values=[], callback
		if(!_O.DB) return;
		_O.DB.transaction(
			function (tx) {
				// console.log("insert into "+J.name+" "+J["fields"]+" "+ J["values"])
				tx.executeSql(
					"insert into "+J.name+" "+J.fields+" ",
					J.values,
					function () { J.callback(true); },
					function () { J.callback(false);}
				);
			}
		);
	};
	_O.select = function (J) { /// {name, fields = "(id, content)", where="id=?",  values=[], callback
		if(!_O.DB) return;
		var sql = "select "+J.fields+" from "+J.name+" "+J.where+" ";
		var values = J.values;
		_O.DB.transaction(
			function (tx) {
				tx.executeSql(
					sql,
					values,
					function (tx,results) {
						if(results && results.rows.length>0) {
							var rv=[];
							for(var i=0;i<results.rows.length;i++) {
								rv[rv.length]=results.rows.item(i);
							}
							J.callback({rows:rv});
						}else{
							J.callback(null);
						}
					},
					function () { J.callback(null);}
				);
			}
		);
	};

	return _O;
}
