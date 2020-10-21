"use strict"

class ComponentReadingSingle extends Component {
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
      textLength = `${round(this.value)} ${this.unit}`.length / 5,
      text  = svg.append('text')
        .attr('x', 0)
        .attr('y', 12)
        .attr('font-size', `${2/(Math.pow(length, 2)+2)}rem`)
        .attr('value', this.value)
        .attr('text-anchor', 'middle'),
      textValue = text.append('tspan')
        .attr('font-size', '2.5em')
        .text(round(this.value)),
      textUnit = text.append('tspan')
        .attr('font-size', '1em')
        .text(this.unit),
      tween = {
        text: value => d => {
          const
            interpolate = d3.interpolate((text.attr('value'))*1, value)

          return t => {
            const
              result = interpolate(t)

            text
              .attr('value', result)

            textValue.text(round(result))
          }
        }
      },
      update = () => {
        const
          textLength = `${round(this.value)} ${this.unit}`.length / 5

        text.transition()
          .duration(500)
          .attr('font-size', `${(2/(Math.pow(textLength, 2)+2))}rem`)
          .tween("text", tween.text(this.value))

        const
          bad = (this.thresholdAbove && this.value > this.thresholdAbove[0]) || (this.thresholdBelow && this.value < this.thresholdBelow[0]),
          ugly = (this.thresholdAbove && this.value > this.thresholdAbove[1]) || (this.thresholdBelow && this.value < this.thresholdBelow[1])

        text.classed('fill-highlight', bad && !ugly)
        text.classed('fill-warn', ugly)
      }

    svg.append('text')
      .attr('x', 0)
      .attr('y', 36)
      .attr('text-anchor', 'middle')
      .attr('font-size', '0.35rem')
      .attr('font-weight', 'bold')
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
    return this.hasAttribute('step') ? this.getAttribute('step')*1 : 1
  }
  set digits(value){
    this.setAttribute('digits', value)
  }
  get digits(){
    return this.hasAttribute('digits') ? this.getAttribute('digits')*1 : 0
  }
  set thresholdBelow(value){
    this.setAttribute('threshold-below', value.join(','))
  }
  get thresholdBelow(){
    return this.hasAttribute('threshold-below') ? this.getAttribute('threshold-below').split(',').map(value => value*1) : null
  }
  set thresholdAbove(value){
    this.setAttribute('threshold-above', value.join(','))
  }
  get thresholdAbove(){
    return this.hasAttribute('threshold-above') ? this.getAttribute('threshold-above').split(',').map(value => value*1) : null
  }
  set value(value){
    this.setAttribute('value', value)
    this.update()
  }
  get value(){
    return this.getAttribute('value')*1
  }

  static get observedAttributes() {
    return ['title', 'unit', 'step', 'digits', 'threshold-below', 'threshold-above', 'value']
  }

}
window.customElements.define('component-reading-single', ComponentReadingSingle)