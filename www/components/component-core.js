"use strict"

class ComponentCore extends HTMLElement {
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
          grid-area: ${this.getAttribute('name')};
          transition: fill 500ms;
          user-select: none;
        }
        .fill-color{
          fill: var(--primary-color);
          transition: fill 500ms;
        }
        .fill-background{
          fill: var(--primary-background);
          transition: fill 500ms;
        }
        .fill-highlight{
          fill: var(--primary-highlight);
          transition: fill 500ms;
        }
        .fill-shade{
          fill: var(--primary-shade);
          transition: fill 500ms;
        }
        .fill-warn{
          fill: var(--primary-warn);
          transition: fill 500ms;
        }
      </style>
    `

    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.filters = `
      <filter id="glow" height="300%" width="300%" x="-75%" y="-75%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="glow"/>
        <feMerge>
          <feMergeNode in="glow"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <clipPath id="above-title">
        <rect x="-65" y="-65" width="130" height="85" />
      </clipPath>

    `
  }
}