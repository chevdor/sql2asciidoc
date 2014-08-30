var sql = require('mssql'); 
// var jsont = require('jsont')();
// var template = require('./my-template.json');
var stdio = require('stdio');

var ops = stdio.getopt({
    'server': {key: 's', args: 2, description: 'Server\\Instance',  args: 1, default: 'localhost'},
    'login': {key: 'l', description: 'Login', args: 1 , default: 'sa'},
    'pass': {key: 'p', description: 'Password', args: 1, default: 'sa'},
    'database': {key: 'd', description: 'DB name', mandatory:true, args: 1},
    'table': {key: 't', description: 'Table name', mandatory:false, args: 1},
    'schema': {key: 'c', description: 'Schemas', mandatory:false, args: 1},

});

//console.log(ops);

var config = {
    user: ops['login'],
    password: ops['pass'],
    server: ops['server'],              // You can use 'localhost\\instance' to connect to named instance
    database: ops['database'],

    options: {
        encrypt: false                  // Use this if you're on Windows Azure
    }
}

console.log('connecting...');
var co = new sql.Connection(config, function(err){
    console.log('connected!');
    // ... error checks
    if(err) console.log(err);
    
    var rq1 = new sql.Request(co);
    rq1.multiple = true;

    if (!rq1) console.log(rq1);
   
    var q_schemas='SELECT SCHEMA_NAME FROM information_schema.SCHEMATA ';
    if (ops['schema']) 
        q_schemas += "WHERE SCHEMA_NAME = '"+ops['schema']+"'";
    
    //console.log('q1='+q1);
    
    rq1.query(q_schemas , function(err, schemas){
        if(err) console.log(err);
        var res = [];
        //console.log(schemas);

        console.log("Schema found: " + schemas[0].length);
            
        schemas[0].forEach(function(sc) {
            var schema = sc['SCHEMA_NAME'];
            //console.log(' Schema found: ' + schema);

            res.push('\n== '+ schema);

            var q_tables = "SELECT * FROM TISAPWF.INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='"+schema+"'";

            //console.log('q2='+q2);

            //var rq2 = sql.Request(co);
            //if (!rq2) console.log(rq2);
            
            rq1.query(q_tables, function(err, tables) {
                //console.log('Tables found in ' + schema + ': ' +tables[0].length);
                 
                tables[0].forEach(function(tbl){
                    var table = tbl['TABLE_NAME'];
                    //console.log('Table: ' + table);
                    
                    res.push('\n. '+ table);
                    res.push('[options="header]' );
                    res.push('|==== ' );
                    res.push('| Column | Nullable | Type | Size ');

                    var q_colums = "SELECT * FROM TISAPWF.INFORMATION_SCHEMA.COLUMNS ";
                       q_colums += "WHERE TABLE_SCHEMA='"+schema+"' ";
                       q_colums += "AND TABLE_NAME ='"+table+"'";

                    //console.log(q_colums);

                    rq1.query(q_colums, function(err, cols) {    
                        //console.log(cols[0]);               // here we have an array of columns for a given schema.table
                        

                        cols[0].forEach(function(col) {
                            //console.log(col);
                            console.log(schema + '.' + table + '.' + col['COLUMN_NAME']);

                            for (var colprop in col){

                                // var line =[];
                                
                                if ([   'COLUMN_NAME',
                                        'DATA_TYPE',
                                        'CHARACTER_MAXIMUM_LENGTH',
                                        'IS_NULLABLE'].indexOf(colprop) >= 0){
                                   //line.push('| '+ col[colprop]);
                                 }
                            }
                        });
                        
                        //res.push(line.join(' '));
                        res.push('|==== ' );
                        
                    });
                //console.log(res.join('\n'));        
                
            });
            
        });
    });
    
});});
