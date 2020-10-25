"use strict"

class ComponentToggle extends ComponentCore {
  constructor() {
    super()
  }
  connectedCallback(){
    this.initializeShadow()


    this.addEventListener('action-primary', evt => {
      console.log('action-primary')
      this.state = !this.state
    })
    this.addEventListener('action-secondary', evt => {
      console.log('action-secondary')
    })

    const
      width = 120,
      height = 120,
      svg = d3
        .select(this.shadow)
        .append('svg')
        .classed('fill-color', true)
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2 + 14})`),
      background = svg
        .append('circle')
        .attr('cx', 0)
        .attr('cy', -5)
        .attr('r', 45)
        .attr('clip-path', 'url(#above-title)')
        .attr('filter', !this.state ? '' : 'url(#glow)')
        .classed('fill-background', !this.state),
      text  = svg.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('font-size', 30)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .attr('filter', this.state ? '' : 'url(#glow)')
        .classed('fill-shade', !this.state)
        .classed('fill-background', this.state)
        .text(this.state ? this.textOn : this.textOff),
      update = () => {
        background
          .attr('filter', !this.state ? '' : 'url(#glow)')
          .classed('fill-background', !this.state)

        text
          .attr('filter', this.state ? '' : 'url(#glow)')
          .classed('fill-shade', !this.state)
          .classed('fill-background', this.state)
          .text(this.state ? this.textOn : this.textOff)
      }

    svg.append('text')
      .attr('x', 0)
      .attr('y', 36)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10')
      .attr('font-weight', 'bold')
      .text(this.title)

    svg.append('defs').html(this.filters)
    svg.attr('filter', 'url(#glow)')

    this.update = update
  }

  updgradeProperty = property => {
    if(this.hasOwnProperty(property)){
      const value = this[property]
      delete this[property]
      this[property] = value
    }
  }

  set title(value){
    this.setAttribute('title', value)
  }
  get title(){
    return this.getAttribute('title')
  }
  set textOn(value){
    this.setAttribute('text-on', value)
  }
  get textOn(){
    return this.getAttribute('text-on') || 'ON'
  }
  set textOff(value){
    this.setAttribute('text-off', value)
  }
  get textOff(){
    return this.getAttribute('text-off') || 'OFF'
  }

  set state(value){
    this.setAttribute('state', value === true ? 'on' : 'off')
    this.update()
  }
  get state(){
    return this.getAttribute('state') === 'on' ? true : false
  }

  static get observedAttributes() {
    return ['title', 'current-state', 'states']
  }
}
class ComponentToggleCycle extends ComponentCore {
  constructor() {
    super()
  }
  connectedCallback(){
    this.initializeShadow()
    
    this.addEventListener('action-primary', evt => {
      console.log('action-primary')
      this.state = this.states[this.states.indexOf(this.state)+1] || this.states[0]
    })
    this.addEventListener('action-secondary', evt => {
      console.log('action-secondary')
    })

    const
      width = 120,
      height = 120,
      svg = d3
        .select(this.shadow)
        .append('svg')
        .classed('fill-color', true)
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2 + 14})`),
      background = svg
        .append('circle')
        .attr('cx', 0)
        .attr('cy', -5)
        .attr('r', 45)
        .attr('clip-path', 'url(#above-title)')
        .classed('fill-background', !this.state !== 'off'),
      text  = svg.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('font-size', 30)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .attr('filter', this.state !== 'off' ? '' : 'url(#glow)')
        .classed('fill-shade', this.state === 'off')
        .classed('fill-background', this.state !== 'off')
        .text(this.state),
      update = () => {
        background
          .attr('filter', this.state === 'off' ? '' : 'url(#glow)')
          .classed('fill-background', this.state === 'off')

        text
          .attr('filter', this.state !== 'off' ? '' : 'url(#glow)')
          .classed('fill-shade', this.state === 'off')
          .classed('fill-background', this.state !== 'off')
          .text(this.state)
      }

    svg.append('text')
      .attr('x', 0)
      .attr('y', 36)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10')
      .attr('font-weight', 'bold')
      .text(this.title)

    svg.append('defs').html(this.filters)
    svg.attr('filter', 'url(#glow)')

    this.update = update
  }

  updgradeProperty = property => {
    if(this.hasOwnProperty(property)){
      const value = this[property]
      delete this[property]
      this[property] = value
    }
  }

  set title(value){
    this.setAttribute('title', value)
  }
  get title(){
    return this.getAttribute('title')
  }


  set states(value){
    this.setAttribute('states', this.states.join(','))
  }
  get states(){
    return this.hasAttribute('states') ? this.getAttribute('states').split(',') : null
  }
  set state(value){
    this.setAttribute('state', value)
    this.update()
  }
  get state(){
    return this.getAttribute('state')
  }

  static get observedAttributes() {
    return ['title', 'state', 'states']
  }
}
window.customElements.define('component-toggle', ComponentToggle)
window.customElements.define('component-toggle-cycle', ComponentToggleCycle)