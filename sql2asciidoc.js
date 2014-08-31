#!/usr/bin/env node

var sql = require('mssql');
// var jsont = require('jsont')();
// var template = require('./my-template.json');
var stdio = require('stdio');
var pjson = require("./package.json");

var ops = stdio.getopt({
    'server': {
        key: 's',
        args: 2,
        description: 'Server\\Instance',
        args: 1,
        default: 'localhost'
    },
    'login': {
        key: 'l',
        description: 'Login',
        args: 1,
        default: 'sa'
    },
    'pass': {
        key: 'p',
        description: 'Password',
        args: 1,
        default: 'sa'
    },
    'database': {
        key: 'd',
        description: 'Database name',
        mandatory: false,
        args: 1
    },
    'schema': {
        key: 'c',
        description: 'Comma separated list of schemas. All if null.',
        mandatory: false,
        args: 1
    },
    'version': {
        key:'v',
        description:'Displays current version',
        args: 1
    }

});

var config = {
    user     : ops['login'],
    password : ops['pass'],
    server   : ops['server'],       // You can use 'localhost\\instance' to connect to named instance
    database : ops['database'],

    options: {
        encrypt: false              // Use this if you're on Windows Azure
    }
}

if (ops['version']){
    console.log(pjson.name + ' version ' + pjson.version);
    process.exit(0);
} else{
    if(!ops['database']){
        console.log('Please provide at the very least the database name. Use --help for details.');
        process.exit(1);
    }
}

//console.info('connecting...');
var co = new sql.Connection(config, function(err) {
    //console.info('connected!');
    // ... error checks
    if (err) {
        console.log (err);
        process.exit(1);
    }

    var rq1 = new sql.Request(co);
    rq1.multiple = true;

    var q_schemas = 'SELECT SCHEMA_NAME FROM information_schema.SCHEMATA ';
    if (ops['schema'])
        q_schemas += "WHERE SCHEMA_NAME = '" + ops['schema'] + "'";

    q_schemas += " ORDER BY SCHEMA_NAME ASC ";

    // rq1.on('done', function(retVal) {
    //     console.info('DONE MAIN');
    // });

    rq1.query(q_schemas, function(err, schemas) {
        //console.info("Schema found: " + schemas[0].length);

        var lastSchema = "";
        schemas[0].forEach(function(sc) {
            var schema = sc['SCHEMA_NAME'];
            var q_tables = "SELECT * FROM INFORMATION_SCHEMA.TABLES "
            // if (ops['Tables']) 
                 q_tables += "WHERE TABLE_SCHEMA='" + schema + "'";
            q_tables += " ORDER BY TABLE_SCHEMA, TABLE_NAME ASC ";
            
            rq1.query(q_tables, function(err, tables) {
                tables[0].forEach(function(tbl) {
                    var table = tbl['TABLE_NAME'];
                    //console.log('Table: ' + table);

                    var q_colums = "SELECT * FROM INFORMATION_SCHEMA.COLUMNS ";
                    q_colums += "WHERE TABLE_SCHEMA='" + schema + "' ";
                    q_colums += "AND TABLE_NAME ='" + table + "'";

                    var res = [];
                    rq1.query(q_colums, function(err, cols) {
                        //console.log(cols[0]);               // here we have an array of columns for a given schema.table

                        if(!lastSchema | lastSchema!== schema) {              // we print the schame name as chapter only if this is a new one
                            res.push('\n== ' + schema);
                            lastSchema=schema;
                        }   
                            
                        res.push('\n=== ' + table);
                        res.push('[width="80%",frame="topbot",options="header,footer"]');
                        res.push('|==== ');
                        res.push('| Column name | Nullable | Type | Size ');
            
                        var line = [];

                        cols[0].forEach(function(col) {
                            //console.log(schema + '.' + table + '.' + col['COLUMN_NAME']);

                            for (var colprop in col) {
                                if (['COLUMN_NAME',
                                    'DATA_TYPE',
                                    'CHARACTER_MAXIMUM_LENGTH',
                                    'IS_NULLABLE'
                                ].indexOf(colprop) >= 0) {
                                    line.push('| ' + col[colprop]);
                                }
                            }
                            line.push('\n');
                        });
                        line.pop();

                        res.push(line.join(''));
                        res.push('|==== ');
                        console.log(res.join('\n'));
                    });
                });
            });
        });
    });
});
