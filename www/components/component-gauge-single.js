"use strict"

class ComponentGaugeSingle extends Component {
  constructor() {
    super()
  }
  connectedCallback(){
    this.initializeShadow()

    console.dir(this)

    const
      width = 120,
      height = 120,
      range = this.max - this.min,
      round = value => (Math.round(Math.round(value/this.step)*this.step*100000)/100000).toFixed(this.digits),
      convert = value => ((value - this.min) / range) * (Math.PI/0.75) - (Math.PI/1.5),
      svg = d3
        .select(this.shadow)
        .append('svg')
        .classed('fill-color', true)
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`),
      arc = d3.arc()
        .innerRadius(42)
        .outerRadius(55)
        .startAngle(convert(this.min)),
      background = svg.append('path')
        .classed('fill-shade', true)
        .datum({ endAngle: convert(this.max)})
        .attr('d', arc),
      display = svg.append('path')
        .datum({ endAngle: convert(this.min) })
        .attr('d', arc),
      text  = svg.append('text')
        .attr('x', 0)
        .attr('y', 5)
        .attr('font-size', `${1.75-((`${round(this.max)}`).length/7)}rem`)
        .attr('value', this.min)
        .text(this.min)
        .attr('text-anchor', 'middle'),
      unit = svg.append('text')
        .attr('x', 0)
        .attr('y', 22)
        .attr('text-anchor', 'middle')
        .attr('font-size', '0.5rem')
        .text(this.unit),
      tween = {
        arc: value => d => {
          const
            interpolate = d3.interpolate(d.endAngle, convert(value))

          return t => {
            d.endAngle = interpolate(t)
            return arc(d)
          }
        },
        text: value => d => {
          const
            interpolate = d3.interpolate((text.attr('value'))*1, value)

          return t => {
            const
              result = interpolate(t)

            text
              .attr('value', result)
              .text(round(result))
          }
        }
      },
      update = () => {
        display.transition()
          .duration(500)
          .attrTween('d', tween.arc(this.value))

        text.transition()
          .duration(500)
          .tween("text", tween.text(this.value))

        const
          bad = (this.thresholdAbove && this.value > this.thresholdAbove[0]) || (this.thresholdBelow && this.value < this.thresholdBelow[0]),
          ugly = (this.thresholdAbove && this.value > this.thresholdAbove[1]) || (this.thresholdBelow && this.value < this.thresholdBelow[1])

        
        display.classed('fill-highlight', bad && !ugly)
        display.classed('fill-warn', ugly)
        text.classed('fill-highlight', bad && !ugly)
        text.classed('fill-warn', ugly)
      }

    svg.append('text')
      .attr('x', 0)
      .attr('y', 36)
      .attr('text-anchor', 'middle')
      .attr('font-size', '0.35rem')
      .text(this.title)

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
  set min(value){
    this.setAttribute('min', value)
  }
  get min(){
    return this.getAttribute('min')
  }
  set max(value){
    this.setAttribute('max', value)
  }
  get max(){
    return this.getAttribute('max')
  }
  set unit(value){
    this.setAttribute('unit', value)
  }
  get unit(){
    return this.getAttribute('unit')
  }
  set step(value){
    this.setAttribute('step', value)
  }
  get step(){
    return this.hasAttribute('step') ? this.getAttribute('step') : 1
  }
  set digits(value){
    this.setAttribute('digits', value)
  }
  get digits(){
    return this.hasAttribute('digits') ? this.getAttribute('digits') : 0
  }
  set thresholdBelow(value){
    this.setAttribute('threshold-below', value.join(','))
  }
  get thresholdBelow(){
    return this.hasAttribute('threshold-below') ? this.getAttribute('threshold-below').split(',') : null
  }
  set thresholdAbove(value){
    this.setAttribute('threshold-above', value.join(','))
  }
  get thresholdAbove(){
    return this.hasAttribute('threshold-above') ? this.getAttribute('threshold-above').split(',') : null
  }
  set value(value){
    this.setAttribute('value', value)
    this.update()
  }
  get value(){
    return this.getAttribute('value')
  }

  /*
  attributeChangedCallback(name,oldValue,newValue) {
    if(name === 'value')
      setValue(value)
  }
  */

  static get observedAttributes() {
    return ['title', 'unit', 'min', 'max', 'step', 'digits', 'threshold-below', 'threshold-below', 'value']
  }

}
window.customElements.define('component-gauge-single', ComponentGaugeSingle)