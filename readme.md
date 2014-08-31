What is sql2asciidoc?
=====================

SQL ⇒ [Asciidoc](http://asciidoc.org/)

`sql2asciidoc` is a node package for lazy people who need to write
documentation and want to do it quick but right.

It connects to your database, discovers the schemas and tables then
generates an asciidoc document listing all the schemas, tables, their
columns and type, size, etc…

The output using the [Asciidoctor Live Preview Chrome
Extension](https://chrome.google.com/webstore/detail/asciidoctorjs-live-previe/iaalpfgpbocpdfblpnhhgllgbdbchmia)
for one table looks like:

![](images/Screenshot01.png)

Of course you can include this asciidoc text into your documents and
render that as HTML, PDF, ePub, etc…

> **Note**
>
> You do not have to run this on a Windows machine as long as you can
> connect to your DB remotely.

Installation
============

This is a regular npm package.

    npm install sql2asciidoc

Usage
=====

``` {.shell}
chevdor-imac:sql2asciidoc will$ node index.js --help
USAGE: node index.js [OPTION1] [OPTION2]... arg1 arg2...
  -s, --server <ARG1>           Server\Instance ("localhost" by default)
  -l, --login <ARG1>            Login ("sa" by default)
  -p, --pass <ARG1>             Password ("sa" by default)
  -d, --database <ARG1>         Database name (mandatory)
  -c, --schema <ARG1>           Comma separated list of schemas. All if null.
```

Examples
--------

**No filtering, all schemas, all tables.**

``` {.shell}
node index.js -d <DB Name>
```

**One schema only.**

``` {.shell}
node index.js -s "myserver\MyInstance" -d MYDB -c dbo
```

**Sample asciidoc output.**

    == dbo

    === SomeConfig
    [width="80%",frame="topbot",options="header,footer"]
    |====
    | Column name | Nullable | Type | Size
    | id| NO| uniqueidentifier| null
    | paramKey| YES| varchar| 50
    | paramValue| YES| varchar| 255
    | valueType| YES| varchar| 50
    | defaultValue| YES| varchar| 255
    | description| YES| text| 2147483647
    |====

    == MySchema

    === SomeFolks
    [width="80%",frame="topbot",options="header,footer"]
    |====
    | Column name | Nullable | Type | Size
    | EmployeeCode| NO| varchar| 10
    | EmployeeName| YES| nvarchar| 100
    | EmployeeEmail| YES| varchar| 100
    | EmployeeLocation| YES| varchar| 40
    |====

    === BrandName
    [width="80%",frame="topbot",options="header,footer"]
    |====
    | Column name | Nullable | Type | Size
    | ID| NO| uniqueidentifier| null
    | BrandNameID| YES| varchar| 50
    | BrandNameName| YES| nvarchar| 100
    |====

Limitations & knownn issues
===========================

If you want to help with the following, please feel free to propose
merge requests.

1.  For now not available as global command

2.  Output is not really customizable

3.  Auth is limited to user+password

4.  Cannot filter a **list** of schemas

5.  Using jsont ?

6.  Putting those stuff in the issue tracker

7.  Not yet possible to select the column properties

<!-- -->

1.  Closing the connection is not handled properly

License
=======

    The MIT License (MIT)

    Copyright (c) 2014 Chevdor

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
