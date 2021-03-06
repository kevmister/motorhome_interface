"use strict"

class ComponentGaugeSingle extends ComponentCore {
  constructor() {
    super()
  }
  connectedCallback(){
    this.initializeShadow()

    const
      width = 130,
      height = 130,
      range = this.max - this.min,
      round = value => (Math.round(Math.round(value/this.step)*this.step*100000)/100000).toFixed(this.digits),
      convert = value => ((Math.min(value, this.max) - this.min) / range) * (Math.PI/0.75) - (Math.PI/1.5),
      svg = d3
        .select(this.shadow)
        .append('svg')
        .classed('fill-color', true)
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2 + 14})`),
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
        .attr('font-size', `${(1.75-((`${round(this.max)}`).length/7))*28}`)
        .attr('value', this.min)
        .text(this.min)
        .attr('text-anchor', 'middle'),
      unit = svg.append('text')
        .attr('x', 0)
        .attr('y', 22)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12')
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
  set min(value){
    this.setAttribute('min', value)
  }
  get min(){
    return this.getAttribute('min')*1
  }
  set max(value){
    this.setAttribute('max', value)
  }
  get max(){
    return this.getAttribute('max')*1
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
  get digits(){
    return this.hasAttribute('digits') ? this.getAttribute('digits')*1 : 0
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
    return this.getAttribute('value')
  }

  /*
  attributeChangedCallback(name,oldValue,newValue) {
    if(name === 'value')
      setValue(value)
  }
  */

  static get observedAttributes() {
    return ['title', 'unit', 'min', 'max', 'step', 'digits', 'threshold-below', 'threshold-above', 'value']
  }

}

class ComponentGaugeDouble extends ComponentCore {
  constructor() {
    super()
  }
  connectedCallback(){
    this.initializeShadow()

    const
      width = 130,
      height = 130,
      range = this.max - this.min,
      round = value => (Math.round(Math.round(value/this.step)*this.step*100000)/100000).toFixed(this.digits),
      convert = value => ((Math.min(value, this.max) - this.min) / range) * (Math.PI/0.75) / 2,
      svg = d3
        .select(this.shadow)
        .append('svg')
        .classed('fill-color', true)
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2 + 14})`),
      arc = [
        d3.arc()
          .innerRadius(42)
          .outerRadius(55)
          .startAngle(0),
        d3.arc()
          .innerRadius(42)
          .outerRadius(55)
          .startAngle(0)
      ],
      background = [
        svg.append('path')
          .classed('fill-shade', true)
          .datum({ endAngle: -convert(this.max)})
          .attr('d', arc[0]),
        svg.append('path')
          .classed('fill-shade', true)
          .datum({ endAngle: convert(this.max)})
          .attr('d', arc[0])
      ],
      display = [
        svg.append('path')
          .datum({ endAngle: -convert(this.min) })
          .attr('d', arc[0]),
        svg.append('path')
          .datum({ endAngle: convert(this.min) })
          .attr('d', arc[0])
      ],
      text = [
        svg.append('text')
          .attr('x', -5)
          .attr('y', -12)
          .attr('font-size', `${(1.4-((`${round(this.max)}`).length/7))*28}`)
          .attr('value', this.min)
          .text(this.min)
          .attr('text-anchor', 'middle'),
        svg.append('text')
          .attr('x', 10)
          .attr('y', 8)
          .attr('font-size', `${(1.4-((`${round(this.max)}`).length/7))*28}`)
          .attr('value', this.min)
          .text(this.min)
          .attr('text-anchor', 'middle')
      ],
      unit = svg.append('text')
        .attr('x', 0)
        .attr('y', 22)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12')
        .text(this.unit),
      tween = {
        arc: (value, number) => d => {
          const
            interpolate = d3.interpolate(d.endAngle, (number === 0 ? -1 : 1) * convert(value))

          return t => {
            d.endAngle = interpolate(t)
            return arc[number](d)
          }
        },
        text: (value, number) => d => {
          const
            interpolate = d3.interpolate((text[number].attr('value'))*1, value)

          return t => {
            const
              result = interpolate(t)

            text[number]
              .attr('value', result)
              .text(round(result))
          }
        }
      },
      update = () => {
        for(const number of [0,1]){
          display[number].transition()
            .duration(500)
            .attrTween('d', tween.arc(this.value[number], number))

          text[number].transition()
            .duration(500)
            .tween("text", tween.text(this.value[number], number))

          const
            bad = (this.thresholdAbove && this.value[number] > this.thresholdAbove[0]) || (this.thresholdBelow && this.value[number] < this.thresholdBelow[0]),
            ugly = (this.thresholdAbove && this.value[number] > this.thresholdAbove[1]) || (this.thresholdBelow && this.value[number] < this.thresholdBelow[1])

          
          display[number].classed('fill-highlight', bad && !ugly)
          display[number].classed('fill-warn', ugly)
          text[number].classed('fill-highlight', bad && !ugly)
          text[number].classed('fill-warn', ugly)
        }
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
  set min(value){
    this.setAttribute('min', value)
  }
  get min(){
    return this.getAttribute('min')*1
  }
  set max(value){
    this.setAttribute('max', value)
  }
  get max(){
    return this.getAttribute('max')*1
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
  get digits(){
    return this.hasAttribute('digits') ? this.getAttribute('digits')*1 : 0
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
    this.setAttribute('value', value.join(','))
    this.update()
  }
  get value(){
    return this.hasAttribute('value') ? this.getAttribute('value').split(',').map(value => value*1) : null
  }

  /*
  attributeChangedCallback(name,oldValue,newValue) {
    if(name === 'value')
      setValue(value)
  }
  */

  static get observedAttributes() {
    return ['title', 'unit', 'min', 'max', 'step', 'digits', 'threshold-below', 'threshold-above', 'value']
  }

}
window.customElements.define('component-gauge-single', ComponentGaugeSingle)
window.customElements.define('component-gauge-double', ComponentGaugeDouble)