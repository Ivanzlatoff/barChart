
let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
let req = new XMLHttpRequest()

let heightScale
let xScale
let xAxisScale
let yAxisScale

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select('svg')

let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

let generateScales = () => {
    heightScale = d3.scaleLinear()
                    .domain([0,d3.max(JSON.parse(req.responseText).data, (item) => {
                        return item[1]
                    })])
                    .range([0, height - (2*padding)])

    xScale = d3.scaleLinear()
               .domain([0, JSON.parse(req.responseText).data.length - 1])
               .range([padding, width - padding])

    let datesArray = JSON.parse(req.responseText).data.map((item) => {
        return new Date(item[0])
    })

    xAxisScale = d3.scaleTime()
                   .domain([d3.min(datesArray), d3.max(datesArray)])
                   .range([padding, width - padding])

    yAxisScale = d3.scaleLinear()
                   .domain([0, d3.max(JSON.parse(req.responseText).data, (item) => {
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

    svg.selectAll('rect')
       .data(JSON.parse(req.responseText).data)
       .enter()
       .append('rect')
       .attr('class', 'bar')
       .attr('width', (width - (2*padding)) / JSON.parse(req.responseText).data.length)
       .attr('data-date', item => {
        return item[0]
       })
       .attr('data-gdp', item => {
        return item[1]
       })
       .attr('height', item => {
        return heightScale(item[1])
       })
       .attr('x', (item, index) => {
        return xScale(index)
       })
       .attr('y', item => {
        return ((height - padding) - heightScale(item[1]))
       })
       .append('title')
       .text(item => item[0])
       .on('mouseover', (item) => {
            tooltip.transition()
                   .style('visibility', 'visible')

            tooltip.text(item[0])

            document.querySelector('#tooltip').setAttribute('data-date', item[0])
       })
       .on('mouseout', item => {
        tooltip.transition()
               .style('visibility', 'hidden')
       })
}

let generateAxes = () => {
    let xAxis = d3.axisBottom(xAxisScale)
    let yAxis = d3.axisLeft(yAxisScale)

    svg.append('g')
       .call(xAxis)
       .attr("id", "x-axis")
       .attr('transform', 'translate(0, ' + (height - padding) + ')')

    svg.append('g')
       .call(yAxis)
       .attr("id", "y-axis")
       .attr('transform', 'translate(' + padding + ', 0)')

}

req.open('GET', url, true)
req.onload = () => {
    JSON.parse(req.responseText).data
    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()
}
req.send()

