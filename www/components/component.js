"use strict"

class Component extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }
  initializeShadow(){
    const
      template = document.createElement('template')

    template.innerHTML = `
      <style>
        :host{
          display: block;
          -background: var(--primary-color);
          width: 100%;
          height: 100%;
          grid-area: ${this.getAttribute('name')}
        }
        .fill-color{
          fill: var(--primary-color);
        }
        .fill-background{
          fill: var(--primary-background);
        }
        .fill-highlight{
          fill: var(--primary-highlight);
        }
        .fill-shade{
          fill: var(--primary-shade);
        }
        .fill-warn{
          fill: var(--primary-warn);
        }
      </style>
    `

    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}