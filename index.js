// Write your code here

// Description
// In this exercise we explore a common scenario in ecommerce and booking sites, using filters and search to modify what we render from state.

// Deliverables
// - A user can enter a US state and view a list of breweries in that state
//     - The list has a maximum of 10 breweries on display
//     - The list has three types of breweries that offer brewery tours:
//         - Micro
//         - Regional
//         - Brewpub
//     - Do not show the other types of breweries
// - From the list of breweries, a user can view the following details about each brewery:
//     - Name
//     - Type of brewery
//     - Address
//     - Phone Number
// - From the list of breweries, a user can visit the website of a brewery
// - From the 'filter by type of brewery' section, a user can filter by type of brewery
// - From the 'filter by city' section, a user can filter by city, the location of the brewery
// - From the 'filter by city' section, a user can clear all filters
// - From the 'search' section, a user can search for breweries by:
//     - Name
//     - City

// Instructions
// - Download the files from https://codesandbox.io/s/day-16-hoxton-breweries-template-h2c0q
// - Read the "Open Brewery DB" documentation: https://www.openbrewerydb.org/documentation/01-listbreweries
// - Think about which request type to use
// - Create a state object
// - Create a fetch function to get data
// - Create action functions that update state
// - Create render functions that read from state
// @everyone part2

// Tips
// - Start with the logic first, use console.log(state) to check your logic is working; when the logic is working as expected move onto styling
// - Use a cleanData function to modify the data in the fetch request before adding it to state
// - Use a extractCitiesData function to extract the cities from the data in the fetch request and add it to state for the 'filter by city' section
// - For filter by type use a select element to capture user input
// - For filter by city use a list of checkbox elements to capture user input

// Challenge
// - Add pagination to the list; if the list of breweries is greater than 10 a user can go to the next page to view more breweries

// Challenge 2
// - Add a booking section; a user can select a date and time to go on a tour at a brewery

const baseUrl = "https://api.openbrewerydb.org/breweries"

const stateSelectorForm = document.querySelector('#select-state-form')
const filtersSectionAsideEl = document.querySelector('.filters-section')
const filterByCityForm = document.querySelector('#filter-by-city-form')

const state = {
    breweries: [],
    selectedState: null,
    breweryType: ['micro', 'regional', 'brewpub'],
    selectedBreweryType: '',
    selectedCities: []
}


// Filters the breweries we want to display by type
function getBreweriesToDisplay() {
    let breweriesToDisplay = state.breweries
    breweriesToDisplay = breweriesToDisplay.filter(brewery =>
        state.breweryType.includes(brewery.brewery_type))

    breweriesToDisplay = breweriesToDisplay.slice(0, 10)

    return breweriesToDisplay
}

function getStateFromStateSelectorForm() {
    stateSelectorForm.addEventListener('submit', (e) => {
        e.preventDefault()
        state.selectedState = stateSelectorForm['select-state'].value
        fetchBreweriesByState(state.selectedState)
            .then((breweries) => {
                state.breweries = breweries
                render()
            })
    })
}


function getCitiesFromBreweries(breweries) {
    let cities = []
    for (const brewery of breweries) {
        if (!cities.includes(brewery.city)) {
            cities.push(brewery.city)
        }
    }
    return cities
}

function getSelectedBreweryType() {
    const filterByTypeSelect = document.querySelector('#filter-by-type')

    filterByTypeSelect.addEventListener('change', () => {
        state.selectedBreweryType = filterByTypeSelect.value
    })
}

function getSelectedCities() {
    let cityCheckboxes = document.querySelectorAll('.city-checkboxes')

    // cityCheckboxes.forEach((element) => {
    //     element.addEventListener('change', () => {
    //         render()
    //     })
    // })

    cityCheckboxes = [...cityCheckboxes]

    return state.selectedCities = cityCheckboxes
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value)

}

function fetchBreweries() {
    return fetch(baseUrl).then(resp => resp.json())
}

function fetchBreweriesByState(state) {
    return fetch(baseUrl + `?by_state=${state}`).then(resp => resp.json())
}

function renderFilterSection() {
    if (state.breweries.length !== 0) {
        filtersSectionAsideEl.style.display = "block";
    } else {
        filtersSectionAsideEl.style.display = "none";
    }

    const cities = getCitiesFromBreweries(state.breweries)
    filterByCityForm.innerHTML = ""

    for (const city of cities) {
        const cityCheckboxInputEl = document.createElement('input')
        const cityCheckboxLabelEl = document.createElement('label')

        cityCheckboxInputEl.setAttribute('type', 'checkbox')
        cityCheckboxInputEl.setAttribute('name', city)
        cityCheckboxInputEl.setAttribute('value', city)
        cityCheckboxInputEl.setAttribute('id', city)
        cityCheckboxInputEl.setAttribute('class', 'city-checkboxes')


        cityCheckboxLabelEl.setAttribute('for', city)
        cityCheckboxLabelEl.textContent = city
        filterByCityForm.append(cityCheckboxInputEl, cityCheckboxLabelEl)
    }

}


function render() {
    renderFilterSection()
    getSelectedBreweryType()
    getSelectedCities()
}



function init() {
    render()
    getStateFromStateSelectorForm()
}

init()