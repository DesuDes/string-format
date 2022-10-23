
# String-Format
String-Format is a Javascript/Typescript tool for formatting strings inspired by Angular's text interpolation.

### formatString( template : string, object : any, opts ? : any );

Example of usage:
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

```
//using CAT_DATA from the previous example.
const STR1 = formatString(
"Hi! I'm {{ :info.name }} and I like to {{ :info.hobbies.@2 | toLowerCase }}."
, CAT_DATA);

console.log(STR1); //OUTPUT: "Hi! I'm Tiger and I like playing."

```

```
//using CAT_DATA from the previous example.
const STR1 = formatString(
"Hi! I'm {{ :info.name }} and my hobbies are: {{ :info.hobbies.@0- | toLowerCase }}."
, CAT_DATA);

console.log(STR1); //OUTPUT: "Hi! I'm Tiger and my hobbies are: eating sleeping playing."

```

```
//using CAT_DATA from the previous example.
const STR1 = formatString(
"Hi! I'm {{ :info.name }} and my hobbies are: {{ :info.hobbies.@1-2 | toLowerCase }}."
, CAT_DATA);

console.log(STR1); //OUTPUT: "Hi! I'm Tiger and my hobbies are: sleeping playing."

```