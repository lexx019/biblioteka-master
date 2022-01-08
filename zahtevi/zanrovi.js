const express=require('express')
const mysql=require('mysql')
const app=require('../app');
const primerci_knjige=require('./primerci_knjige');
const zahtev=require('./zahtev');
async function prikazi()
{
    let sql="SELECT * from kategorije"
    return zahtev.query(sql)
   
}
exports.prikazi=prikazi;