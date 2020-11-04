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
          width: 100%;
          height: 100%;
          ${this.hasAttribute('name') ? `grid-area: ${this.getAttribute('name')};` : ''}
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
        .fill-shade-darker{
          fill: var(--primary-shade-darker);
          transition: fill 500ms;
        }
        .fill-warn{
          fill: var(--primary-warn);
          transition: fill 500ms;
        }
        .stroke-color{
          stroke: var(--primary-color);
          transition: stroke 500ms;
        }
        .stroke-background{
          stroke: var(--primary-background);
          transition: stroke 500ms;
        }
        .stroke-highlight{
          stroke: var(--primary-highlight);
          transition: stroke 500ms;
        }
        .stroke-shade{
          stroke: var(--primary-shade);
          transition: stroke 500ms;
        }
        .stroke-shade-darker{
          stroke: var(--primary-shade-darker);
          transition: stroke 500ms;
        }
        .stroke-warn{
          stroke: var(--primary-warn);
          transition: stroke 500ms;
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

    this.customEvents = {
      primary: new Event('action-primary'),
      secondary: new Event('action-secondary'),
      timeout: null,
      begin: evt => {
        evt.preventDefault()
        if(this.customEvents.timeout)
          clearTimeout(this.customEvents.timeout)

        this.customEvents.timeout = setTimeout(() => {
          this.customEvents.clear()
          this.dispatchEvent(this.customEvents.secondary)
        }, 750)
      },
      clear: evt => {
        clearTimeout(this.customEvents.timeout)
        this.customEvents.timeout = null
      },
      end: evt => {
        evt.preventDefault()
        if(this.customEvents.timeout){
          this.customEvents.clear()
          if(evt.button !== 2)
            this.dispatchEvent(this.customEvents.primary)
          else
            this.dispatchEvent(this.customEvents.secondary)
        }
      }
    }

    
    this.oncontextmenu  = evt => {
      evt.preventDefault()
      evt.stopPropagation()
    }

    this.addEventListener('mousedown', this.customEvents.begin)
    this.addEventListener('touchstart', this.customEvents.begin)
    this.addEventListener('mouseout', this.customEvents.clear)
    this.addEventListener('mouseup', this.customEvents.end)
    this.addEventListener('touchend', this.customEvents.end)
    this.addEventListener('touchleave', this.customEvents.clear)
    this.addEventListener('touchcancel', this.customEvents.end)
  }
}