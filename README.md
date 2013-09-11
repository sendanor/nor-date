nor-date
========

Date helpers for Node.js

Getting Started
---------------

You can install `nor-date` from the NPM:

	`npm install nor-date`

Use it inside Node.js like: `var nor_date = require('nor-date');`

This library is also supported on browser side but all features are not tested 
yet.

License
-------

It's licenced under the MIT license.

nor_date.format ( {string}format, {Date}timestamp, {object}opts )
---------------------------------------------------------

This function formats `timestamp` -- which is an instance of Date -- into 
format specified by the string `format` option. If `time` is ommited the 
current time will be used.

All arguments are optional arguments. The order of these arguments is not 
important. However please note that the type is **very important**.

The `format` is a string in the same format as `strftime()` system call is 
using, except that the library re-implements, so there might be small 
differences and unsupported features. Please 
[create issues](https://github.com/Sendanor/nor-date/issues/new) if you find 
missing features or wrong behaviour.

The `opts` -- which is an object -- can be used to change the locale with 
the property named `locale`.

#### Example 1

To get current date as YYYY-MM-DD you can call it 
`nor_date.format('%Y-%m-%d')`.

#### Example 2

To get current month name in Finnish locale you can call it 
`nor_date.format('%B', {locale:'fi'})` or 
`nor_date.format({locale:'fi'}, '%B')`.

#### Example 3

To get month of `t`, which is instance of Date, in Finnish locale you can call 
it like:

```javascript
var t = new Date(2013, 8, 15);
console.log( nor_date.format({locale:'fi'}, '%B', t) );
```

#### Binding support

Because `format()` supports each argument in any order, it makes binding 
functions very easy.

```javascript
var t = new Date(2013, 8, 15);

var fi_format = nor_date.format.bind(undefined, {locale:'fi'});
var fi_date_format = nor_date.format.bind(undefined, {locale:'fi'}, '%a %d %B %Y');

console.log( fi_format('%a %d %B %Y', t) );
console.log( fi_date_format(t) );
```

Locale support
--------------

Currently only English as `en` and Finnish as `fi` is supported.

However you may implement your own locale like this:

```javascript
// Setup custom locale fi and make it a copy of $def
nor_date.setupLocale("fi", "$def", {
    "title": "Finnish locale",
    "days_short": [
        'su', 'ma', 'ti', 'ke', 'to', 'pe', 'la', 'su'
    ],
    "days_long":  [
        'sunnuntai', 'maanantai', 'tiistai', 'keskiviikko', 'torstai', 
		'perjantai', 'lauantai', 'sunnuntai'
    ],
    "months_short": [
        'tammi', 'helmi', 'maalis', 'huhti', 'touko', 'kesä', 'heinä', 'elo', 
		'syys', 'loka', 'marras', 'joulu'
    ],
    "months_long": [
        'tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesäkuu', 
		'heinäkuu', 'elokuu', 'syyskuu', 'lokakuu', 'marraskuu', 'joulukuu'
    ],
    "format_date": "%d.%m.%Y",
    "format_time": "%H:%M:%S",
    "format_datetime": "%d.%m.%Y %H:%M:%S"
});
```

