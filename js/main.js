/*********************************************************************************
* WEB422 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Moxa Jayeshkumar Panchal  
* Student ID: 14888597 
* Date: 04/02/2022
********************************************************************************/ 

var restaurantData = [];
var currentRestaurant = {};
var page = 1;
const perPage = 10;
var map = null;

function avg(grades) {
    var total = 0, average = 0;

    var i = 0;
    while (i < grades.length) {
        total += grades[i].score;

        i++;
    }

    average = total / grades.length;

    return average.toFixed(2);
}


const tableRows = _.template(`
 <% _.forEach(restaurants,res=> { %>
     <tr data-id="<%- res._id %>">
         <td><%- res.name %></td>
         <td><%- res.cuisine %></td>
         <td><%- res.address.building %> <%- res.address.street%></td>
         <td><%- avg(res.grades) %></td>
     </tr>
 <% }); %>`);


 function loadRestaurantData() {
    fetch(
        `https://restaurant---api.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`
    )
        .then((res) => res.json())
        .then((information) => {
            restaurantData = information.restaurant;
            
            let tabrows = tableRows({ restaurants: restaurantData });
           
           
            $("#restaurant-table tbody").html(tabrows);
            $("#current-page").html(page);
        });
}

$(function () {

    loadRestaurantData();

    $("#restaurant-table tbody").on("click", "tr", function (e) {

        let cRows;
        cRows = $(this).attr("data-id");

        currentRestaurant = restaurantData.find(({ _id }) => _id == cRows);

        $(".modal-title").html(`${currentRestaurant.name}`);
        
        $("#restaurant-address").html(
            `${currentRestaurant.address.building} ${currentRestaurant.address.street}`
        );

        $("#restaurant-modal").modal({
            backdrop: "static",
            keyboard: false,
        });
    
    });

    $("#previous-page").on("click", function (e) {
        if (page > 1) {
            page--;
        }
       
        loadRestaurantData();
    
    });

    $("#next-page").on("click", function (e) {
    
        page++;
    
        loadRestaurantData();
    
    });

    $("#restaurant-modal").on("shown.bs.modal", function () {
    
        map = new L.Map("leaflet", {
    
            center: [
                currentRestaurant.address.coord[1],
                currentRestaurant.address.coord[0],
            ],
            zoom: 18,
            layers: [
                new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
            ],
        });
    
        L.marker([
            currentRestaurant.address.coord[1],
            currentRestaurant.address.coord[0],
        ]).addTo(map);
    });

    $("#restaurant-modal").on("hide.bs.modal", function () {

        map.remove();
    });
});
