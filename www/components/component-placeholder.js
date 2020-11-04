"use strict"

class ComponentPlaceholder extends ComponentCore {
  constructor() {
    super()
  }
  connectedCallback(){
    this.initializeShadow()
    const
      width = 100,
      height = 100,
      svg = d3
        .select(this.shadow)
        .append('svg')
        .attr('stroke-width', 2)
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`)

      /*
      svg
        .append('line')
        .attr('stroke-width', 2)
        .attr('x1', -25)
        .attr('x2', 25)
        .attr('y1', 0)
        .attr('y2', 0)
        .classed('stroke-shade', true)

      svg
        .append('line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', -25)
        .attr('y2', 25)
        .classed('stroke-shade', true)
        */

      svg
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 45)
        .attr('fill', 'transparent')
        .classed('stroke-shade-darker', true)

      svg.append('defs').html(this.filters)
      svg.attr('filter', 'url(#glow)')
  }

}
window.customElements.define('component-placeholder', ComponentPlaceholder)