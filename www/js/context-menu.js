"use strict"

const
  mouse = {
    handle: evt => {
      mouse.x = evt.clientX
      mouse.y = evt.clientY
    },
    x: 0,
    y: 0
  },
  createElementFromString = string => {
    const
      template = document.createElement('template')

    template.innerHTML = string

    return template.content.cloneNode(true)
  }

document.addEventListener('DOMContentLoaded', () => {
  document.body.onmousemove = mouse.handle
  document.body.ontouchmove = mouse.handle
})

document.addEventListener('contextmenu', event => event.preventDefault());
if(!('motorhome' in window))
  window.motorhome = {}

window.motorhome.contextMenu = ({ text,options }) => {
  const
    element = document.querySelector('#context-menu'),
    ul = element.querySelector('ul')

  for(const element of ul.querySelectorAll('li'))
    element.remove()

  ul.appendChild(createElementFromString(`<li class="title text-highlight">${text}</li>`))

  for(const option of options){
    const
      li = createElementFromString(`<li>${option.text}</li>`)

    li.addEventListener('click', evt => {
      option.callback()
    })

    ul.appendChild(li)
  }

  element.style.left = `calc(${mouse.x}px - 3rem)`
  element.style.top = `calc(${mouse.y}px)`

  console.log(mouse)
}