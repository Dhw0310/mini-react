
// v1
// const dom = document.createElement("div")
// dom.id = "app"
// document.querySelector("#root").append(dom)
//
// const textNode = document.createTextNode("")
// textNode.nodeValue = "app"
// dom.append(textNode)

// v2 react --> vdom --> js object

// const textEl = {
//   type: "TEXT_ELEMENT",
//   props: {
//     nodeValue: "app",
//     children: []
//   }
// }

function createTextNode (text) {
  console.log('heiheihei')
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  }
}
// type props children
// const el = {
//   type: "div",
//   props: {
//     id: "app",
//     children: [ textEl ]
//   }
// }

function createElement (type, props, ...children) {
  return {
    type: type,
    props: {
      ...props,
      children: children.map(child => {
        return typeof child === "string" ? createTextNode(child) : child
      })
    }
  }
}

// const dom = document.createElement(App.type)
// dom.id = App.props.id
// document.querySelector("#root").append(dom)
//
// const textNode = document.createTextNode("")
// textNode.nodeValue = textEl.props.nodeValue
// dom.append(textNode)


function render (el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el]
    }
  }
  // const dom = el.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(el.type)

  // Object.keys(el.props).forEach(key => {
  //   if (key !== "children") {
  //     dom[key] = el.props[key]
  //   }
  // })
  // const children = el.props.children
  // children.forEach(child => {
  //   render(child, dom)
  // })
  // container.append(dom)
}

let nextWorkOfUnit = null
function workLoop (deadline) {
  let shouldYield = false
  if (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}

function createDom (type) {
  return type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(type)
}

function updateProps (dom, props) {
  Object.keys(props).forEach(key => {
    if (key !== "children") {
      dom[key] = props[key]
    }
  })
}
function initChildren (fiber) {
  // 3. 转换链表 设置好指针
  let children = fiber.props.children
  let prevChild = null
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    prevChild = newFiber
  })
}
function performWorkOfUnit (fiber) {
  // 1. 创建 DOM
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))
    fiber.parent.dom.append(dom)
    // 处理 props
    updateProps(dom, fiber.props)
  }
  initChildren(fiber)
  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child
  }

  if (fiber.sibling) {
    return fiber.sibling
  }
}

requestIdleCallback(workLoop)
const React = {
  render,
  createElement
}

export default React