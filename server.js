/***********************************************************************************
 * WEB422 – Assignment 1
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Moxa Jayeshkumar Panchal  
 * Student ID: 14888597 
 * Date: 21/01/2022
 * Heroku Link: https://restaurant---api.herokuapp.com/
 *
 ********************************************************************************/

const express = require('express');
const app = express();
const cors = require('cors');
const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB();
require("dotenv").config();

const HTTP_PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: `API Listening`});
});

app.post("/api/restaurants", (req, res) => {
    db.addNewRestaurant(req.body)
    .then((information) => {
      res.status(201).json({ restaurant: information });
    })
    .catch((err) => {
      res.status(500).json({ message: `Restaurant adding failed.` });
    });
});

app.get("/api/restaurants", (req, res) => {
    db.getAllRestaurants(req.query.page, req.query.perPage, req.query.borough)
      .then((information) => {
        res.status(200)
              .json({ restaurant: information });
         
      })
      .catch((err) => {
        res.status(500).json({ message: `Restaurant retrieving failed.` });
      });
  });

  app.get("/api/restaurants/:Id", (req, res) => {
    db.getRestaurantById(req.params.Id)
      .then((information) => {
       res.status(200).json({
              restaurant : information
            });
         
      })
      .catch((err) => {
        res.status(500).json({
          message: `Restaurant with Id:${req.params.Id} not found.`,
        });
      });
  });

  app.put("/api/restaurants/:Id", (req, res) => {
    db.updateRestaurantById(req.body, req.params.Id)
      .then(() => {
       
        res.status(204).json({
          message: `Restaurant with Id:${req.params.Id} updated.`,
        })
     
      })
      .catch((err) => {
        res.status(500).json({
          message: `Restaurant with Id:${req.params.Id} was not updated.`,
        });
      });
  });

  app.delete("/api/restaurants/:Id", (req, res) => {
    db.deleteRestaurantById(req.params.Id)
      .then(() => {
        res.status(204).json({
          message: `Restaurant with Id:${req.params.Id} deleted.`,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: `Restaurant with Id:${req.params.Id} was not deleted.`,
        });
      });
  });

  app.use((req, res) => {
    res.status(404).json({ message: "Error 404! Resource not found." });
  });

db.initialize(
  `${process.env.MONGO}`
)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
