import React from 'react';
import { scaleBand, scaleLinear, max } from "d3";

/*
data:  Should be a single object with each property correlating to a single year of data.
{
    2000: 5,
    2001: null,
    2002: 7
}
*/
const BarChart = ({
    data,
    width=350, 
    height=250
}) => {

    const entries = Object.entries(data)
    const marginTop=0
    const marginRight=15
    const marginBottom=20
    const marginLeft=50
    const innerHeight = height - marginTop -marginBottom
    const innerWidth = width - marginLeft - marginRight
    const xScaleMax = max(entries, entry => entry[1])
    const tickMax = 6

    const getTickAmount = () => {
        if(xScaleMax <= tickMax)
            return xScaleMax
        
        else return tickMax
    }

    const xScale = scaleLinear()
    .domain([0, xScaleMax])
    .range([0, innerWidth])

    const yScale = scaleBand()
        .domain(entries.map(entry => entry[0]))
        .range([0, innerHeight])
        .padding(0.2)

    return (
        <svg width={width} height={height}>
            <g 
            className='bar-chart'
            transform={`translate(${marginLeft}, ${marginTop})`}
            >
                {xScale.ticks(getTickAmount()).map(tickValue => 
                <g 
                key={`x-scale-g-${tickValue}`}
                transform={`translate(${xScale(tickValue)}, 0)`}
                >
                    <line 
                    y2={innerHeight}
                    key={`x-scale-line-${tickValue}`}
                    />
                    <text 
                    key={`x-scale-text-${tickValue}`}
                    style={{textAnchor: 'middle'}}
                    y={innerHeight + 3}
                    dy="0.71em"
                    >
                        {tickValue}
                    </text>
                </g>
                )}

                {entries.map(entry => 
                    <g 
                    key={`y-scale-g-${entry[0]}`}
                    transform={`translate(0, ${yScale(entry[0])})`}
                    >
                        <text 
                        key={`y-scale-label-${entry[0]}`}
                        style={{textAnchor: "end"}}
                        x="-3"
                        y={yScale.bandwidth() / 2}
                        dy="0.32em"
                        >
                            {entry[0]}
                        </text>

                        <rect
                        key={`y-scale-rect-${entry[1]}`}
                        width={xScale(entry[1])}
                        height={yScale.bandwidth()}
                        />
                        
                        <text
                        key={`y-scale-value-text-${entry[1]}`}
                        className='rect-text'
                        x={xScale(entry[1]) / 2}
                        y={yScale.bandwidth() / 2}
                        dx="-5"
                        dy="0.32em"
                        >
                            {entry[1]}
                        </text>
                    </g>
                    )
                }
            </g>
        </svg>
    )
}

export default BarChart