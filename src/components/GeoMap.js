import React, { useState, useEffect } from 'react';
import {geoMercator, fitSize, geoPath} from "d3";
import { useDateHandler } from '../helpers/DataHandler';
import ColorLegend from './ColorLegend';

//Grab the global css variables in the root element.
const style = getComputedStyle(document.body)

//Get all of the css global variables used for the map component.
const MAP_COLORS = {
    bg: style.getPropertyValue("--map-bg-color"),
    null: style.getPropertyValue("--accident-null"),
    accidentShades: [
        style.getPropertyValue("--accident-0"),
        style.getPropertyValue("--accident-1"),
        style.getPropertyValue("--accident-2"),
        style.getPropertyValue("--accident-3"),
        style.getPropertyValue("--accident-4"),
        style.getPropertyValue("--accident-5"),
        style.getPropertyValue("--accident-6"),
        style.getPropertyValue("--accident-7")
    ]
}

//A mapping of colors to their associated texts.  Used for the map legend.
const legendColors = [
    {
        color: MAP_COLORS.bg,
        text: "No Region Data"
    },

    {
        color: MAP_COLORS.accidentShades[0],
        text: "Low"
    },

    {
        color: MAP_COLORS.accidentShades[7],
        text: "High"
    },

    {
        color: MAP_COLORS.null,
        text: "No Accident Data"
    },
]

//Data must follow the exact format of the annotatedData.geojson file given in exampleData.
const GeoMap = ({
    data, 
    width=1280, 
    height=720,
    regionClick = () => {}
}) => {

    const { selectedMapRegion, setSelectedMapRegion, dataFilters } = useDateHandler()

    //Used for the color scale that all regions get shaded with.
    const getMaxAccidents = () => {
        if(data?.features){
            let currentMax = 0
    
            data.features.forEach(feature => {
                if(feature?.properties?.total && feature.properties.total > currentMax)
                    currentMax = feature.properties.total
                
            })
    
            return currentMax
        }

        return 0
    }

    const [maxAccidents, setMaxAccidents] = useState(0)

    useEffect(() => {
        if(data){
            setMaxAccidents(getMaxAccidents())
        }
    }, [data])

    //Note:  Due to fitsize, the svg will not resize with the window in real time.  Only scales on render.
    const projection = geoMercator().fitSize([width, height], data);
    const pathGenerator = geoPath(projection);
    
    const getRegionShade = (feature) => {
        const accidentCount = feature.properties.total

        //Accidents have occured here, so get the shade of the fill.
        if(accidentCount && maxAccidents > 0){
            let shade = Math.floor((accidentCount / maxAccidents) * 10)

            if(shade > 7)
                shade = 7
            
            return MAP_COLORS.accidentShades[shade]
        }

        //Region exists, but there is no accident data given for it.
        else if(accidentCount === null || accidentCount === undefined)
            return MAP_COLORS.null

        return MAP_COLORS.bg
    }

    const compareFilters = (region) => {
        let isValid = true

        if(dataFilters?.search !== "" && region.properties.name.toLowerCase().includes(dataFilters.search.toLowerCase()))
            isValid = false

        if(dataFilters?.["filter-low"] && dataFilters["filter-low"] > region.properties.total)
            isValid = false

        if(dataFilters?.["filter-high"] && dataFilters["filter-high"] < region.properties.total)
            isValid = false

        return isValid
    }

    const handleClick = (e, feature) => {

        e.stopPropagation()

        //User clicks on the main svg element, but not on any map region.  Clear the selected map region to close the popover.
        if(e.target.className.baseVal === "GeoSvg"){
            setSelectedMapRegion(undefined)
        }

        else if(!selectedMapRegion || (selectedMapRegion && selectedMapRegion.id !== feature.id)){
            setSelectedMapRegion(feature)
            regionClick(e)
        }

        else {
            setSelectedMapRegion(undefined)
        }
    }

    const getRegionClass = (region) => {
        let str = "county"

        if(!compareFilters(region)){
            str += " disabled"
        }

        else if(selectedMapRegion && selectedMapRegion.id === region.id){
            str += " selected"
        }


        return str
    }

    return (
        maxAccidents &&
        <div className='map-section'>

            <ColorLegend colors={legendColors}/>

            <div className='map-container'>
                <svg 
                width={width} 
                height={height} 
                onClick={(e) => handleClick(e)} 
                className="GeoSvg"
                >
                    <g>
                        {data.features.map(feature => 
                            <path 
                            className={getRegionClass(feature)}
                            fill={getRegionShade(feature)}
                            id={`path-${feature.id}`}
                            key={`path-${feature.id}`}
                            d={pathGenerator(feature)}
                            onClick={compareFilters(feature) ? (e) => handleClick(e, feature) : () => {}}
                            />
                            )
                        }
                    </g>
                </svg>
            </div>
        </div>
        
    )
}

export default GeoMap