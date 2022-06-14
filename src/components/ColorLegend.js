import React, { useState } from 'react';

/*
colorScale:  an array of objects whose properties are the color and text associated.  Ex:
[
    {
        color: "red",
        text: "Invalid Data"
    }
]
spacing:  The distance/gap between each legend item.
iconSize:  The size of the color icon rectangle.
textOffset:  The gap between the icon and its associated text.
*/
const ColorLegend = ({
    colors,
    width = "100%",
    direction = "row",
    spacing = "1.5rem",
    iconSize = "1rem",
    textOffset = "0.5rem"
}) => {


    return (
        <span style={{
            display: "flex",
            flexDirection: direction,
            flexWrap: "wrap",
            gap: spacing,
            width: width
        }}>
            {colors.map(item => (
                <span
                style={{
                    display: "inline-flex"
                }}
                key={`legend-span-${item.color}-${item.text}`}
                >
                    <div
                    style={{
                        backgroundColor: item.color,
                        border: "1px solid black",
                        marginRight: textOffset,
                        width: iconSize,
                        height: iconSize
                    }}
                    key={`legend-icon-${item.color}`}
                    />
                    
                    <p
                    key={`legend-text-${item.text}`}
                    >
                        {item.text}
                    </p>
                </span>
            ))

            }
        </span>
    )
}

export default ColorLegend