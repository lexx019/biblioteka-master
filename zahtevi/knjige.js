const express=require('express')
const mysql=require('mysql')
const app=require('../app');
const primerci_knjige=require('./primerci_knjige');
const zahtev=require('./zahtev');
async function dodaj(ime,ime_autora,id_kategorije,broj_primeraka)
{
    let sql="INSERT INTO knjige (ime,imeAutora,idKategorije) VALUES(?,?,?)"
    var knjiga=await zahtev.query(sql,[ime,ime_autora,id_kategorije]);
    let id_knjige=knjiga.insertId;
    primerci_knjige.dodaj(id_knjige,broj_primeraka)
    
}
async function sve()
{
    let sql="SELECT *,knjige.idKnjige as idKnjige,kategorije.zanr as zanr,COUNT(primerci_knjige.idKnjige) as broj_primeraka FROM knjige INNER JOIN kategorije ON kategorije.idKategorije=knjige.idKategorije LEFT JOIN primerci_knjige ON primerci_knjige.idKnjige=knjige.idKnjige GROUP BY knjige.idKnjige"
    var knjige=await zahtev.query(sql);
    return knjige;
    
}
async function nadji_po_id(id_knjige)
{
    let sql="SELECT *,knjige.idKnjige as idKnjige,kategorije.zanr as zanr,COUNT(primerci_knjige.idKnjige) as broj_primeraka FROM knjige INNER JOIN kategorije ON kategorije.idKategorije=knjige.idKategorije LEFT JOIN primerci_knjige ON primerci_knjige.idKnjige=knjige.idKnjige WHERE primerci_knjige.idKnjige=? GROUP BY knjige.idKnjige"
    var knjige=await zahtev.query(sql,[id_knjige]);
    return knjige;
    
}
async function obrisi(idKnjige)
{
    let sql="DELETE FROM knjige WHERE idKnjige=?"
    return zahtev.query(sql,[idKnjige]);
}
exports.dodaj=dodaj;
exports.sve=sve;
exports.nadji_po_id=nadji_po_id;
exports.obrisi=obrisi;