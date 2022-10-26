# @jodzjcm/string-format

  

![Tests](https://github.com/DesuDes/string-format/actions/workflows/node.js.yml/badge.svg)

  
 This is a string interpolation library inspired by how [Angular](https://angular.io/guide/interpolation) embeds an expression into a formatted string.

## Installation

```
npm i @jodzjcm/string-format
```

  
Require:

```
import { formatString } from "@jodzjcm/string-format";
```



  

## Usage

Provide a string literal with one or more placeholders, and a data as its reference to interpolate a formatted string.

***formatString( stringTemplate : string, object : Object, opts ? : any );***

````

const greeting = "Hello";

const STR = formatString("{{ :greeting }} world!", { greeting } );

console.log(STR); //OUTPUT: "Hello world!"

````

  

````

const lives = 9;

const STR = formatString("A cat has {{ :lives }} lives.", { lives } );

console.log(STR); //OUTPUT: "A cat has 9 lives."

````

  

````

const DATA = { greetings : "Hello" };

const STR = formatString("{{ :greetings }} world!", DATA);

console.log(STR); //OUTPUT: "Hello world!"

````

  

### Accessing Object Properties

To access object properties, use the dot notation as shown below.

  

````

const CAT_DATA = {
	info: {
		name : "Tiger"
		age: 8,
		species: "cat",
		type: "tabby",
	residence: {
		country: "Philippines"
	},
	hobbies : ["Eating","Sleeping", "Playing"]
	}
};

const STR1 = formatString(

"Hi! I'm {{ :info.name }} and I'm a {{ :info.type }}  {{ :info.species }} from the {{ :info.residence.country }}.", CAT_DATA);

  
console.log(STR1); //OUTPUT: "Hi! I'm Tiger and I'm a tabby cat from the Philippines."

````

  
````

const STR1 = formatString(

"Hi! I'm {{ :info.name }} and I'm a {{ :info.type }}  {{ :info.species }} from the {{ :info.residence.country }}." , CAT_DATA);

console.log(STR1); //OUTPUT: "Hi! I'm Tiger and I'm a tabby cat from the Philippines."

````

  

### Accessing Array Elements

  

Use `@<index>`, `@<startingIndex>-<endIndex>`, and `@<startingIndex>-` to access array elements.



```

//using CAT_DATA from the previous example.

const STR1 = formatString("Hi! I'm {{ :info.name }} and I like to {{ :info.hobbies.@2  }}.", CAT_DATA);

console.log(STR1); //OUTPUT: "Hi! I'm Tiger and I like Playing."

```

  

You can also define ranges to enumerate the elements of an array accordingly into the placeholder. If the end index is not provided, it will take up the length of the provided array.

  

```

//using CAT_DATA from the previous example.

const STR1 = formatString(
"Hi! I'm {{ :info.name }} and my hobbies are: {{ :info.hobbies.@0- }}.", CAT_DATA);

console.log(STR1); //OUTPUT: "Hi! I'm Tiger and my hobbies are: Eating Sleeping Playing."

```

```

//using CAT_DATA from the previous example.

const STR1 = formatString("Hi! I'm {{ :info.name }} and my hobbies are: {{ :info.hobbies.@1-2  }}.", CAT_DATA);

console.log(STR1); //OUTPUT: "Hi! I'm Tiger and my hobbies are: Sleeping Playing."

```

```

const TEST_DATA = {

numbers2: [
	[
		[0, 1, 2, 3, 4, 5],
		[6, 7, 8, 9, 10],
	],
	[
		[11, 12, 13, 14, 15],
		[16]
	],
],
};

//OUTPUT => 6 7 8 9 10 16.
console.log(formatString("{{:numbers2.@0-.@1.@0-}}.", TEST_DATA));

```

  
### Accessing JSON String
  
  To make things easier, you could access a json string directly by using `!` in your expression.

```
const JSON_CHILD_2 = {
	team: "Team 3&5 - GSW",
	year: [2014, 2019],
	members: ["Steph", "Dray", "Klay", "Durant", true, undefined, false, null], //json.stringify converts `undefined` to `null`
	complexChild: [
		{ data: JSON.stringify(CAT_DATA) },
		{ data: JSON.stringify(CAT_DATA) },
	],
};

const JSON_CHILD_1 = {
	randomNumber: 70,
	child: JSON.stringify(JSON_CHILD_2),
};

const JSON_MAIN = {
	name: "Tiger",
	age: 30,
	city: "New York",
	child: JSON.stringify(JSON_CHILD_1),
};

//THE_EXAMPLE.raw is a JSON string.
const THE_EXAMPLE = { myRawJSONString: JSON.stringify(JSON_MAIN) }; 
```
  
Indicate `!` to automatically interpret the JSON string and use the existing notations discussed to access its properties.

```
formatString("Hello {{:!myRawJSONString.name}}.", THE_EXAMPLE); //OUTPUT: Hello Tiger.
```

```
formatString("{{:!myRawJSONString.!child.randomNumber}}.", THE_EXAMPLE); //OUTPUT: 70.
```

```
formatString("{{:!myRawJSONString.!child.!child.year.@0-}}.", THE_EXAMPLE); //OUTPUT: 2014 2019.
```

```
//uses the cat data test data in the previous examples
formatString("{{:!myRawJSONString.!child.!child.complexChild.@0-.info.name}} {{:!myRawJSONString.!child.!child.complexChild.@0-.info.name}}.", THE_EXAMPLE);
//OUTPUT: Tiger Tiger Tiger Tiger.
```

For performance considerations, the resulting values when parsing the JSON string are cached ephemerally until the end of the function's invocation.

### Pipes

Pipes are used to do transformations of the interpolated string.

  

```

//using CAT_DATA from the previous example above.

const STR1 = formatString("Hi! I'm {{ :info.name }} and my hobbies are: {{ :info.hobbies.@1-2 | !toLowerCase }}.", CAT_DATA);

//Sleeping and playing are now in lowercase.
console.log(STR1); //OUTPUT: "Hi! I'm Tiger and my hobbies are: sleeping playing."
```

  

A pipe prefixed by `!` are built-in javascript string methods as documented here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String.

  

Take note that you can't pass params to the string methods in our template or placeholders hence it is recommended to use functions that takes no or optional params. If you really need to pass params, you may need to create a **custom pipe**.

  
  

### Chaining Pipes

You could also chain pipes using `-->`.

```
//using CAT_DATA from the previous example above.

const STR1 = formatString(
"Hi! I'm {{ :info.name }} and my hobbies are: {{ :info.hobbies.@1-2 | !toLowerCase --> !toUpperCase}}.", CAT_DATA);

//Sleeping and playing are now in lowercase and will be uppercased
console.log(STR1); //OUTPUT: "Hi! I'm Tiger and my hobbies are: SLEEPING PLAYING."


```
You can chain two or more pipes.
```
"Hi! I'm {{ :info.name }} and my hobbies are: 
{{ :info.hobbies.@1-2 | pipe1 --> pipe2 ---> pipe3 --> andSoOn }}.", CAT_DATA);
```

  
### Available Pipes

- Built-in string methods prefixed by `!` as discussed above. Case sensitive when providing built-in string methods. 

-  **SQLStringEscape** (shorthand: **sqlq**)

	- Escapes or sanitizes the data. The pipe internally calls `SqlString.escape(yourData)` to sanitize the string before placing it to the placehoder. For more info, https://www.npmjs.com/package/sqlstring.

	Usage:

	```
	formatString("SELECT * FROM Users WHERE surrogateId = {{ :mydata.myattr.id | SQLStringEscape }}", QUERY );

	formatString("SELECT * FROM Users WHERE surrogateId = {{ :mydata.myattr.id | sqlq }}", QUERY );
	```

- toJSON

	- parses the data into JSON.

- parseJSON

	- reads the JSON and dumps its output in the string template.

- ReverseString

  

### Creating Custom Pipes

If you want to create your own set of transformation rules like transforming dates using your favorite library like `date-fns` or `moment`, you may need to create your own pipes.


To create your own transformation pipe,  provide the options object which is third param of the `formatString`  and assign a property named `pipes`. 

```
pipes : Array<{
	name : string,
	action(value : any): string
}
```

Example:

```
formatString("{{:msg | aReplacer --> !toLowerCase }}.",
{
	msg: "helLo a!",
},{
pipes: [
		{
			name: "aReplacer",
			action: (value: any) => (value + "").replace("a", "wooorld!"),
		},
	],
});

//The output: "hello wooorld!."
```