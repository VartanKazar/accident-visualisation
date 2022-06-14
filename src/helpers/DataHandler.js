import React, { useState, createContext, useContext } from 'react';

export const DataHandlerContext = createContext()

export const DataHandlerProvider = ({children}) => {

  /*The contents of an uploaded file from the users disk.
  Format is an array containing feature objects.  Use annotatedData in the exampleData folder for reference.
  This information is never modified to avoid having to re-parse the file again.
  */
  const [file, setFile] = useState()

  const [dataFilters, setDataFilters] = useState({
    search: "",
    "filter-low": 0,
    "accident-filter-high": 0
  })

  //Holds the selected data associated with the interactable map regions.
  const [selectedMapRegion, setSelectedMapRegion] = useState()

  //Lists all of the possible year properties of the features.
  //Used to quickly access discovered year properties after the first data parse.
  const [years, setYears] = useState([])

  const handleFileSelection = (e) => {
    const fileReader = new FileReader();

    const fileType = e.target.files[0]?.type
    const fileNameSplit = e.target.files[0].name.split('.')
    const fileName = fileNameSplit[fileNameSplit.length - 1]

    //Make sure that the file uploaded is a compatible format.
    //Either JSON, or GEOJSON are allowed.
    if((fileType && fileType === "application/json") || fileName === "geojson"){

      fileReader.readAsText(e.target.files[0], "UTF-8")
  
      fileReader.onload = readerEvent => {
        const mapData = JSON.parse(readerEvent.target.result)
        setFile(mapData)

        //Get a list of all the year fields in the feature properties.
        //Year must be between 1900 and 2099
        var date_regex = /^(19|20)\d{2}$/;
        let featureYears = []
        Object.keys(mapData.features[0].properties).forEach(property => {
          if(property.match(date_regex)){
            featureYears.push(property)
          }
        })

        setYears(featureYears)
        setSelectedMapRegion(undefined)
      }
    }

    else {
      alert("Invalid file type given.  Only json and geojson types are allowed!")
      e.target.value = null
    } 

  }

    return (
        <DataHandlerContext.Provider value = {{
          file, setFile,
          dataFilters, setDataFilters,
          selectedMapRegion, setSelectedMapRegion,
          handleFileSelection,
          years, setYears
        }}>
          {children}
        </DataHandlerContext.Provider>
    )
}

export const useDateHandler = () => useContext(DataHandlerContext)