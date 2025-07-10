# Declarative Data in HTML

*A tinker's overnight obsession session.*

They said it couldn't be done. Or, maybe they said it shouldn't be done. I don't remember. All I remember is I sat down last night and thought "yeah, but what if I could just declare the details of queries and variables in HTML without having to worry about writing any JavaScript myself?" Then I slipped into a stupor and began coding.

## Live

https://tmetcalfe89.github.io/declarative-data-in-html/

## What it do

### Variables

Observe the humble HTML. It defines variables like so:

```HTML
<meta
  data-var
  id="response-body"
  data-type="object"
  data-value='{"results": []}'
/>
```

That `id` is later used to point to this guy, same as we do most any other time we want to point at such guys.

The `data-type` helps us figure out if we should parse it or not (hardcoded, could be expanded).

The `data-value` is the value of this variable.

Observe the (some say humbler) HTML. It's kinda basic, but I was kinda hoping for a page number on the data I get back from a thing we'll talk about in the future, so... working with what I've got.

```HTML
<div
  data-variable="#response-body"
  data-variable-pointer="results.length"
></div>
```

It says "hey I've got a `data-variable` over at this selector, and it just happens to be a thing I can point to some property of, can you get me the `data-variable-pointer` property on it? When you're done, go ahead and set that as my content." And the system obliges.

### Events

So the last bit's neat, if you want to make static data or whatever. I dunno, maybe you load stuff via some other script and then you point it to change the `data-value` on the variable element; I don't question your methods. But yeah, it's kinda boring. Let's make something that does something *and* demonstrates a property of the variable logic.

```HTML
<html>
  <head>
    <meta
      data-var
      id="count"
      data-type="number"
      data-value="0"
    />
  </head>
  <body>
    <button data-evt-click="setvar:#count:prev+1" type="button">+1</button>
    <button data-evt-click="setvar:#count:prev*2" type="button">x2</button>
    <button data-evt-click="setvar:#count:0" type="button">0</button>
    <div>You've counted to <span data-variable="#count"></span></div>
  </body>
</html>
```

Ah man, I wound up getting back into scripting-by-another-dialect.

So, first, we've got a `#count` variable. This sucker holds onto the current count (betcha never seen that before). The buttons each have their own `data-evt-click` that references a rudimentary af referencing system for `<an action to take>:<its params separated by colons>`. I kinda hate it, it'd be the first thing to get a rework, but the idea's there and it works alright.

The `setvar` action expects to receive the selector of a variable container somewhere, as well as an expression to evaluate, which is populated with the previous value as an internal variable `prev`.

The `type="button"` is mostly just there because OCD and it *should* be the default value in HTML but it's not.

The `span` that's attached its content to the `#count` variable container will receive updates as the `#count` variable changes. Click away on the buttons, it'll keep up.

### Queries

Aight, so we've got some variables, we've got some events, but life wouldn't be complete without being able to fetch arbitrary data from the internet and do neat things with it. Woof.

In comes queries, looking way too smooth for its intended use.

```HTML
<meta
  data-query
  id="get-pokemon"
  data-url="https://pokeapi.co/api/v2/pokemon"
/>
```

Well. Yeah. That checks out. Remote data, an `id` to find it by later, and a `data-url` to know whom to send the request off to. So how do we use it?

```HTML
<html>
  <head>
    <meta
      data-var
      id="response-body"
      data-type="object"
      data-value='{"results": []}'
    />
    <meta
      data-query
      id="get-pokemon"
      data-url="https://pokeapi.co/api/v2/pokemon"
    />
  </head>
  <body data-evt-load="fetch:#get-pokemon:#response-body">
    <div
      data-variable="#response-body"
      data-variable-pointer="results.length"
    ></div>
  </body>
</html>
```

Ah yeah, the guys from earlier, and is that a new event I see? Ye, it is. On body loading, we'll `fetch` the query contained in `#get-pokemon`, and output its results to `#response-body` as the `data-value` property value. A little fixed in regards to where to put it there, but eh, another thing I'd fix in the future. Probably something like `#response-body|data-value`? `|` isn't used in CSS, is it? The output param there currently takes a CSS selector and outputs to all, though Idk why you'd need to output to more than one (and so Idk why I even...).

So in this scenario, we start with `0` and then it fetches the data available on the body of the query container (those weren't the right words, but wtv), and then it becomes `20`. Unless your internet goofs or something, in which case... I don't actually have a handler for that. It just errors out, which is kinda graceful in this, kinda not? I'd add the idea of smoother error handling for sure.

### Lists

Aight, for the last bit here, I'm just gonna point to the [index.html](index.html) file as it's a bit more.

Follow with me here. We have the query container `#get-pokemon`. The body loads said the JSON body of the response on that query into `#response-body` on load. That `#response-body` starts out with dummy data, then has real data. `#previous-link` has subscribed to changes in `#response-body`, changing its `data-value` property to the `previous` value on the `#response-body` variable. `#next-link` has done similar, but for the next link. The `#get-pokemon` query is actually getting its `data-url` from the `#get-pokemon-url` variable, which is changed via an event handler when the user clicks on the prev/next buttons.

All that's a mouthful, but not more than we'd expect from declarative event-driven noise. We have variables holding onto data, we have events possibly going off, we have queries loading their data into variables. We have elements subscribing to changes in the values of those variables for their own nefarious purposes. It's cool.

Also, did you catch that new `$.vars["#next-link"]` in the next button (and similar in the previous button)'s click event handler? Hooked up a `Proxy` for vars in a `$` internal object so that it'll go over and get whichever variable container you're looking for. Could probably be done smoother, but I wanted less steps so here we are.

But uh, none of those are the reason for the `List` header.

Check out this lil guy:

```HTML
<ul
  data-list-template="#pokemon-card"
  data-list="#response-body"
  data-list-pointer="results"
></ul>
```

and its friend:

```HTML
<template id="pokemon-card">
  <li>
    <a data-part="name" data-part-href="url"></a>
  </li>
</template>
```

I hope this is as intuitive as the other guys, or more. We have a list. The data's in an array in a variable container somewhere. For each element in that array, I would like to create an instance of the given `data-list-template` element and spit it out into my `ul`. Standard `data-list` and `data-list-pointer` looking like `data-variable` and `data-variable-pointer` from before (DRY anybody? not me, not now, but it'd be neat).

Inside of the template, on its evaluation, we have `data-part` and its siblings `data-part-whatever`. The `whatever` works just like `data-variable-whatever`, and the `data-part` part works like `data-variable-pointer`, but as a pointer to something in the scope of the entry in the array instead of the value inside of a varaible container somewhere.

The list subscribes to changes in the variable container, same as regular variable-tapping elements do. Receive initial results, hit button that is now hooked up to data about the next link, hit the button that is now hooked up to data about the previous link, watch as the query does its thing, and then the list updates. Spins and rimbledeebadoodles, as they say in Scotland. They don't say that. Nobody's ever said that.

### Caching

Did I say lists were the last bit? I lied. I sprinkled in some caching.

```HTML
<meta
  data-var
  id="count"
  data-type="number"
  data-value="0"
  data-cache="localstorage"
  data-cacheable="data-value"
/>
```

The `data-cache` says "store me in local storage on change and load me from there on load". `sessionstorage` is also available, for the weirdos.

The `data-cacheable` is me prying away from hardcoding `data-value` as the cacheable bit. Point to any given property on the element, it'll get cached.

No `data-cache-type` because we're just `JSON.stringify`ing it immediately on write and `JSON.parse`ing it immediately on read. By "immediately," I might mean "redundantly," given the value's always gonna be a string. Meh. At least it's consistent.

## Summary

Anyway, yeah, that's what I spent a night making. I like it. I could probably use it in a pinch for simpler projects. I'd love something like this to be real; intuitive, (mostly) declarative (Idk about that evt handler structure, but it's what I could think of; maybe an event handler element? similar to query/variable container elements? would make the `data-` syntax a little less squished), dare I say loving?

I would probably also dive into a proper parser for the expressions, but that wasn't my goal in this particular project. Man could it benefit from having a custom parser for the event stuff though. Maybe something for general calculations too.

Alright, show's over, go home. <3