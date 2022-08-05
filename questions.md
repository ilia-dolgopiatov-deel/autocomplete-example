### 1. What is the difference between Component and PureComponent? give an example where it might break my app.

PureComponent has default implementation of shouldComponentUpdate lifecycle method.
It shallow compares next props and state, and if they are equal, component render will not be triggered.
It will break if state or props gets mutated or if there are impure components are used as chidren of a pure one.


### 2. Context + ShouldComponentUpdate might be dangerous. Can think of why is that?

I think this is the case for older Context Api, for which it would npt rerender if context changes, but ShouldComponentUpdate returns false. In new version on Context API, all the consumers would be rerendered despite of SCU result.


### 3. Describe 3 ways to pass information from a component to its PARENT.

1. Pass callback function as prop to child, for example onChange function like so:
```js
const [value, setValue] = React.useState('');

<MyComponent onChange={(v) => setValue(v)} />
```
so when MyComponent calls its onChange prop with some value, the value in it's paremt changes.

2. Use state manager like Redux and dispatch an event, wich will change the value used in parent component

```js
<button onClick={() => dispatch({ type: 'increment-counter' })}>
    Increment counter
</button>
```

Then in parent component

```js
const counter = useSelector((state) => state.counter)
```

3. Are there more ways? Can't think of something that is not a hack or boils down to 2 ways above.
May be the third way is not to pass it to parent at all, instead lift state up or something.


### 4. Give 2 ways to prevent components from re-rendering.

1. use PureComponent or useMemo hook for functional components.
use memoization to prevent creating new instances.

for exmaple, following component will re-render each time on parent re-render, because new functiononChange function will be created on each parent render:
```js
<MyComponent onChange={(v) => setValue(v)} />
```
This way, when we pass onChange to child, it will be the same instance and prevent child re-rendering:
```js
  const onChange = useCallback((v) => setValue(v), []);

  <MyComponent onChange={onChange} />
```

2. If we store some data, which does not necessarily need to update UI, we can store it with useRef hook.
```js
  const ref = useRef(null);

  // changes to ref won't trigger rendering
  ref.data = someData;
```


### 5. What is a fragment and why do we need it? Give an example where it might break my app.

React Fragment allows to return multiple nodes without need to create unnecessary wrapper element.
```js
<>
  <Header />
  <Content />
</>
```
The only attribute Fragment can have is the key, so if your component had a wrapper with spread props like so
```js
<div {...someProps}>
  <Header />
  <Content />
</div>
```

and later you decide to change div to Fragment, the props would not be applied since there is no DOM element for fragment.


### 6. Give 3 examples of the HOC pattern.

HOC wraps component and can add some functionality to it.

For example, we can use it to wrap components that may not be ready to show content, so they will display some loading state by default

```js
function withLoading = (WrappedComponent) => {
    function WithLoading(props) {
        // some logic 
	    ...

	    if (isLoading) {
            return <Loader /> 
	    }

	    return <WrappedComponent {...props} />
	}

    return WithLoading;
}
```

HOCs can be used to enrich multiple component with set of props (props injection)
```js
function withSomeService (WrappedComponent) {
    class HOC extends React.Component {
        render () {
            const apiKey = this.props.apiKey;
            const Service = new ApiService(apiKey);
   
    return (
        <WrappedComponent {...this.props} service={Service} />
     );
    }
  }
  return HOC;
}
```

another example of HOC can be Redux connect method.


### 7. what's the difference in handling exceptions in promises, callbacks and async...await.

When using callbacks we usually pass onSuccess and onError callbacks, so with a long chaing on callbacks it becomes very hard to understand and maintain.

With promise we can add .catch method to a long chain of promises and handle errors in one place.

async...await allow to write async code in style of sync code and use the try...catch statements.


### 8. How many arguments does setState take and why is it async.

setState has 2 arguments:
first is update function (state, props) => stateDiff or just an diff object itself

second argument is callback which is called after the change is complete

it is async because react can dalay the execution to make batch changes. If it was synchronous there would be a lot more of rerenders and performance would be poor.


### 9. List the steps needed to migrate a Class to Function Component.

1. remove the constructor
2. remove render method, return jsx from function itself
3. remove other methods, declare them as funcitons
4. remove references to this
5. change this.setState to useState
6. change lifecycle methods to hooks

### 10. List a few ways styles can be used with components.

with classNames
```js
<div class="styleClass" />
```
with css modules
```js
<div class={styles.styleClass} />
```
inline styles
```js
<div style={{ backgroundColor: 'red' }} />
```

CSS-in-JS (StyledComponents, etc)

```js
const StyledDiv = styled.div`
  background-color: red;
`;
```


### 11. How to render an HTML string coming from the server.

You can use dangerouslySetInnerHTML or parse a string manually (or with third party lib)