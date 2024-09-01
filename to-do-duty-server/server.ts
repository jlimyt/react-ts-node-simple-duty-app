"use strict";
const express = require("express")
const cors = require("cors")
const postgresPool = require("pg").Pool
const app = express()
const { dutyCreateController, dutySearchController, dutyUpdateController, dutyDeleteController } = require('./controllers/duty.js')
const bodyParser = require("body-parser")
const port = process.env.port || 3000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.listen(port, (err) => {
    if(err) throw err;
    console.info(`Server is running successfully on port: ${port}`)
})


// Database configuration
const pool = new postgresPool({
    host: "postgres",
    user: "postgres",
    password: "postgres",
    database: "tododuty_db",
})

pool.connect((err) => {
    if(err) throw err;
    // console.info("Connected to database tododuty_db successfully")  
})

const createTable = async () => { 
    await pool.query(`CREATE TABLE IF NOT EXISTS duty 
    (id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    name character varying(250) COLLATE pg_catalog."default" NOT NULL,
    active boolean NOT NULL DEFAULT true,
    priority character varying(30) COLLATE pg_catalog."default" NOT NULL,
    deadline timestamp without time zone NOT NULL,
    CONSTRAINT duty_pkey PRIMARY KEY (id));`)
  };
  
createTable();

// Duty APIs
app.get("/duties", (_, res) => {
    const listDutiesSql = "SELECT * FROM duty WHERE active = true";
    pool.query(listDutiesSql, (err, result) => {
        if(err) return res.json(err);
        return res.status(200).json(result.rows)
    })
})

app.post("/duties", (req, res) => {
    const {name, priority, deadline} = req.body
    const currDate = new Date();
    const createDutySql = "INSERT INTO duty(name, priority, deadline, active) VALUES ($1, $2, $3, true) RETURNING *";
    pool.query(createDutySql, [name, priority, deadline], (err, result) => {
        if(err) return res.json(err);
        return res.status(201).json(result)
    })
})

app.patch("/duties/:dutyId", (req, res) => {
    const dutyId = Number(req.params.dutyId)
    const {name, priority, deadline} = req.body
    const updateDutySql = "UPDATE duty SET name=$1, priority=$2, deadline=$3, active=true WHERE id = $4";
    pool.query(updateDutySql, [name, priority, deadline, dutyId], (err, result) => {
        if(err) return res.json(err);
        return res.status(200).send(`Duty #${dutyId} is updated successfully.`)
    })
})

app.delete("/duties", (req, res) => {
    const {ids} = req.body
    const deleteDutySql = "UPDATE duty SET active=false WHERE id IN ($1)";
    pool.query(deleteDutySql, [ids], (err, result) => {
        if(err) return res.json(err);
        return res.status(410).send(`Deleted successfully.`)
    })
})

module.exports = { pool, app };