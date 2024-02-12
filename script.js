let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
let req = new XMLHttpRequest();

let data;
let value = []

let heightScale;
let xScale;
let xAxisScale;
let yAxisScale;

let width = 800;
let height = 600;
let padding = 40; 

let svg = d3.select('svg')

let drawCanvas = () => {
    svg.attr('width', width)
       .attr('height', height)
}

let generateScales = () => {
    heightScale = d3.scaleLinear()
                    .domain([0, d3.max(value, (item) => {
                        return item[1]
                    })])
                    .range([0, height - (2 * padding)])

    xScale = d3.scaleLinear()
               .domain([0, value.length - 1])
               .range([padding, width - padding])

    let datesArray = value.map((item) => {
        return new Date(item[0])
    })

    xAxisScale = d3.scaleTime()
                   .domain([d3.min(datesArray), d3.max(datesArray)])
                   .range([padding, width - padding])

    yAxisScale = d3.scaleLinear()
                   .domain([0, d3.max(value, (item) => {
                    return item[1]
                   })])
                   .range([height - padding, padding])
}

let drawBars = () => {

    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('visibility', 'hidden')
                    .style('width', 'auto')
                    .style('height', 'auto')

    let color = d3.scaleLinear()
                  .domain([0, value.length])
                  .range(['#ff0000', '#0000ff'])

    svg.selectAll('rect')
       .data(value)
       .enter()
       .append('rect')
       .attr('class', 'bar')
       .attr('width', (width - (2 * padding)) / value.length)
       .attr('data-date', (item) => {
          return item[0]
       })
       .attr('data-gdp', (item) => {
          return item[1]
       })
       .attr('height', (item) => {
        return heightScale(item[1])
       })
       .attr('x', (item, index) => {
        return xScale(index)
       })
       .attr('y', (item) => {
        return (height - padding) - heightScale(item[1])
       })
       .attr('fill', (d, i) => color(i))
       .on('mouseover', (event, item) => {
        const tooltip = d3.select('#tooltip')
        tooltip.transition().style('visibility', 'visible')
            .style('top', (event.pageY - 10) + 'px')
            .style('left', (event.pageX + 10) + 'px');
        tooltip.html(`<strong>Date:</strong> ${item[0]}<br><strong>GDP:</strong> ${item[1]}`);
        })    
       .on('mouseout', (item) => {
        tooltip.transition()
               .style('visibility', 'hidden')
       })

}

let generateAxis = () => {
    let xAxis = d3.axisBottom(xAxisScale)
    let yAxis = d3.axisLeft(yAxisScale)

    svg.append('g')
       .call(xAxis)
       .attr('id', 'x-axis')
       .attr('transform', 'translate(0, ' + (height - padding) + ')')

    svg.append('g')
       .call(yAxis)
       .attr('id', 'y-axis')
       .attr('transform', 'translate( ' + padding +', 0)')
}

req.open('GET', url, true)
req.onload = () => {
    data = JSON.parse(req.responseText)
    value = data.data
    console.log(value)
    drawCanvas()
    generateScales()
    drawBars()
    generateAxis()
}
req.send()