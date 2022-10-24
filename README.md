
# @jodzjcm/string-format
Format-String is a Javascript/Typescript tool for formatting strings inspired by Angular's text interpolation.


Install:
`npm i @jodzjcm/string-format`

Require:
``import { formatString } from  "@jodzjcm/string-format";``


### formatString( template : string, object : Object, opts ? : any );

### Usage

````
const greeting = "Hello";
const STR = formatString("{{ :greeting }} world!", { greeting } );
console.log(STR); //OUTPUT: "Hello world!"
````

````
const lives = 9;
const STR = formatString("A cat has {{ :lives }} lives.",  { lives } );
console.log(STR); //OUTPUT: "A cat has 9 lives."
````

````
const DATA = { greetings : "Hello" };
const STR = formatString("{{ :greetings }} world!", DATA);
console.log(STR); //OUTPUT: "Hello world!"
````

#### Accessing Object Properties
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
		Hobbies : ["Eating","Sleeping", "Playing"]
	}
 };
 
const STR1 = formatString(
"Hi! I'm {{ :info.name }} and I'm a {{ :info.type }} {{ :info.species }} from 
the {{ :info.residence.country }}."
, CAT_DATA);

console.log(STR1); //OUTPUT: "Hi! I'm Tiger and I'm a tabby cat from the Philippines."
````

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
"Hi! I'm {{ :info.name }} and I'm a {{ :info.type }} {{ :info.species }} from 
the {{ :info.residence.country }}."
, CAT_DATA);

console.log(STR1); //OUTPUT: "Hi! I'm Tiger and I'm a tabby cat from the Philippines."
````

#### Accessing Array Elements

Use `@<index>`  to access array elements.

```
//using CAT_DATA from the previous example.
const STR1 = formatString(
"Hi! I'm {{ :info.name }} and I like to {{ :info.hobbies.@2 }}."
, CAT_DATA);

console.log(STR1); //OUTPUT: "Hi! I'm Tiger and I like Playing."

```

You can also define ranges (zero-based index). Use `@startingIndex-endIndexExclusive` to enumerate the elements of an array accordingly into the placeholder. If the endIndex is not provided, it will take up the length of the provided array.

```
//using CAT_DATA from the previous example.
const STR1 = formatString(
"Hi! I'm {{ :info.name }} and my hobbies are: {{ :info.hobbies.@0- }}."
, CAT_DATA);

console.log(STR1); //OUTPUT: "Hi! I'm Tiger and my hobbies are: Eating Sleeping Playing."

```

```
//using CAT_DATA from the previous example.
const STR1 = formatString(
"Hi! I'm {{ :info.name }} and my hobbies are: {{ :info.hobbies.@1-2 }}."
, CAT_DATA);

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


## Pipes 
Pipes are used to do transformations of the interpolated string.

```
//using CAT_DATA from the previous example above.
const STR1 = formatString(
"Hi! I'm {{ :info.name }} and my hobbies are: {{ :info.hobbies.@1-2 | !toLowerCase }}."
, CAT_DATA);

//Sleeping and playing are now in lowercase.
console.log(STR1); //OUTPUT: "Hi! I'm Tiger and my hobbies are: sleeping playing."

```

A pipe prefixed by `!` are built-in javascript string methods as documented here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String. 

Take note that you can't pass params to the string methods in our template hence it is recommended to use functions that takes no or optional params. If you really need to pass params, you may need to create a **custom pipe**.


### Chaining Pipes
You could also chain pipes using `-->`.
```
//using CAT_DATA from the previous example above.
const STR1 = formatString(
"Hi! I'm {{ :info.name }} and my hobbies are: {{ :info.hobbies.@1-2 | !toLowerCase --> !toUpperCase}}."
, CAT_DATA);

//Sleeping and playing are now in lowercase and will be uppercased.
console.log(STR1); //OUTPUT: "Hi! I'm Tiger and my hobbies are: SLEEPING PLAYING."

```

### Available Pipes
- Built-in string methods as discussed above.

- **SQLStringEscape** (shorthand: **sqlq**)
	- Escapes or sanitizes the data. The pipe internally calls `SqlString.escape(yourData)` to sanitize the string before placing it to the placehoder. For more info, https://www.npmjs.com/package/sqlstring.
	
		Usage: 
		`formatString("SELECT * FROM Users WHERE surrogateId = {{ :mydata.myattr.id | SQLStringEscape }}", QUERY );`
		`formatString("SELECT * FROM Users WHERE surrogateId = {{ :mydata.myattr.id | sqlq }}", QUERY );`
- toJSON
	 - parses the data into JSON.
- parseJSON
	 - reads the JSON and dumps its output in the string template.
- ReverseString

### Creating Custom Pipes

To be continued.

