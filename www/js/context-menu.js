"use strict"

const
  mouse = {
    handle: evt => {
      mouse.x = evt.clientX
      mouse.y = evt.clientY
    },
    x: 0,
    y: 0
  }
document.addEventListener('DOMContentLoaded', () => {
  document.body.onmousemove = mouse.handle
  document.body.ontouchmove = mouse.handle
})
document.addEventListener('contextmenu', event => event.preventDefault());

if(!('motorhome' in window))
  window.motorhome = {}

window.motorhome.contextMenu = ({ options }) => {
  const
    element = document.querySelector('#context-menu')

  element.style.left = `calc(${mouse.x}px - 4rem)`
  element.style.top = `calc(${mouse.y}px)`

  console.log(mouse)
}