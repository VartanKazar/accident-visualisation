import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { useDateHandler } from './helpers/DataHandler';
import GeoMap from "./components/GeoMap"
import BarChart from './components/BarChart';
import Input from './components/Input';

const App = () => {

  const { file, handleFileSelection,
          selectedMapRegion, setSelectedMapRegion, 
          years, 
          dataFilters, setDataFilters } = useDateHandler()
  
  //Holds the location of the clicked element that the popover should be positioned above.
  const [popover, setPopover] = useState()

  //Used for both the width and height of the map projection so it fits a square boundingbox.
  //To avoid screen clipping, size will either be the lesser of the screen with or screen height.
  const MAP_SIZE = Math.min(window.innerWidth, window.innerHeight) * 0.75

  //Finds the position on the screen of the clicked map region.
  //Used to place the popover directly under the selected region.
  const handleRegionClick = (e) => {

    const currentTargetRect  = e.target.getBoundingClientRect()
    const x = currentTargetRect.x
    const y = currentTargetRect.y +  window.pageYOffset + currentTargetRect.height

    setPopover({
      x: x,
      y: y
    })
  }

  //When the user clicks on a map region, the feature in file has to be parsed into a format that BarChart accepts.
  //Returns an object for the data property of BarChart.
  const prepareSelectedChartData = () => {

    let data = {}

    if(years){
      years.forEach(year => {
        if(selectedMapRegion.properties[`${year}`] !== null)
          data[`${year}`] = selectedMapRegion.properties[`${year}`]
      })
    }
    return data
  }

  const handleFilterChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setDataFilters(values => ({...values, [name]: value}))
  }

  const handlePopoverClose = () => {
    setSelectedMapRegion(undefined)
    setPopover(undefined) 
  }

  return (
    <div className="App">

      <Input
      type="file"
      accept=".json, .geojson"
      onChange={(e) => handleFileSelection(e)}
      />

      {file &&
      <React.Fragment>

        <div className='filters-bar'>

          <Input
          type="search"
          name="search"
          label="Search for an Area"
          placeholder="Ex: Naylor Gardens"
          onChange={handleFilterChange}
          value={dataFilters?.search}
          style={{
            width: "26ch"
          }}
          />

          <span className='frequency-filters'>
            <Input
            type="number"
            name="filter-low"
            label="From"
            placeholder="5"
            onChange={handleFilterChange}
            value={dataFilters?.["accident-filter-low"]}
            style={{
              width: "10ch"
            }}
            />

            <Input
            type="number"
            name="filter-high"
            placeholder="15"
            label="to"
            onChange={handleFilterChange}
            value={dataFilters?.["accident-filter-high"]}
            style={{
              width: "10ch"
            }}
            />
          </span>

        </div>


        <GeoMap 
        data={file}
        width={MAP_SIZE}
        height={MAP_SIZE}
        regionClick={(e) => handleRegionClick(e)}
        />
      </React.Fragment>
      }

      {selectedMapRegion && popover &&
        <div 
        className='popover'
        style={{
          position: "absolute",
          top: popover.y,
          left: popover.x
        }}
        >
          <div style={{
            width: "100%",
            textAlign: "end"
          }}>
            <button className='button icon del' onClick={() => handlePopoverClose()}>
              X
            </button>
          </div>
          <h2 className='text-centered'>{selectedMapRegion.properties.name}</h2>
          {selectedMapRegion.properties.total ?
          <BarChart
          data={prepareSelectedChartData()}
          />

          :

          <h4 className='text-centered'>No Data Recorded</h4>
          }
        </div>
      }

    </div>
  );
}

export default App;
