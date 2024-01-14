import ReactDom from "./core/reactDom.js"
import App from "./App.jsx"
// const textEl = createTextNode("app")
// const App = createElement("div", {id: "app"}, textEl)


// render(App, document.querySelector("#root"))


ReactDom.createRoot(document.querySelector("#root")).render(App)