const { pool } = require('../server')

function dutyCreateController(req, res){
    const {name, priority, deadline} = req.body
    const currDate = new Date();
    const createDutySql = "INSERT INTO duty(name, priority, deadline, active) VALUES ($1, $2, $3, true) RETURNING *";
    pool.query(createDutySql, [name, priority, deadline], (err, result) => {
        if(err) return res.json(err);
        return res.status(201).json(result.rows)
    })
}

function dutySearchController(req, res){
    const listDutiesSql = "SELECT * FROM duty WHERE active = true";
    pool.query(listDutiesSql, (err, result) => {
        if(err) return res.json(err);
        return res.status(200).json(result.rows)
    })
}

function dutyUpdateController(req, res){
    const dutyId = Number(req.params.dutyId)
    const {name, priority, deadline} = req.body
    const updateDutySql = "UPDATE duty SET name=$1, priority=$2, deadline=$3, active=true WHERE id = $4";
    pool.query(updateDutySql, [name, priority, deadline, dutyId], (err, result) => {
        if(err) return res.json(err);
        return res.status(200).send(`Duty #${dutyId} is updated successfully.`)
    })
}

function dutyDeleteController(req, res){
    const {ids} = req.body
    const deleteDutySql = "UPDATE duty SET active=false WHERE id IN ($1)";
    pool.query(deleteDutySql, [ids], (err, result) => {
        if(err) return res.json(err);
        return res.status(200).send(`Deleted successfully.`)
    })
}
module.exports = { dutyCreateController, dutySearchController, dutyUpdateController, dutyDeleteController };