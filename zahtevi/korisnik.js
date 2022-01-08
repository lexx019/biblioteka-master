const express=require('express')
const mysql=require('mysql')
const app=require('../app');
const korisnik=require('./korisnik');
const zahtev=require('./zahtev');
async function dodaj(ime,prezime,email,brojlicne,datumrodjenja,jmbg,telefon,tipnaloga,lozinka)
{
    let sql="INSERT INTO korisnici (ime,prezime,email,brojlicne,datumrodjenja,jmbg,telefon,tipnaloga,lozinka) VALUES(?,?,?,?,?,?,?,?,?)"
    return zahtev.query(sql,[ime,prezime,email,brojlicne,datumrodjenja,jmbg,telefon,tipnaloga,lozinka])
   
}
async function prijava(email)
{
    let sql="SELECT * FROM korisnici WHERE email=?"
    return zahtev.query(sql,[email])
}
async function nadji_po_id(idKorisnika)
{
    let sql="SELECT *,DATE_FORMAT(datumrodjenja,'%d.%m.%Y.') as datumrodjenja,COUNT(primerci_knjige.idKorisnika) as broj_iznajmljenih_knjiga FROM korisnici INNER JOIN primerci_knjige ON primerci_knjige.idKorisnika=korisnici.idKorisnika WHERE korisnici.idKorisnika =?  GROUP BY korisnici.idKorisnika "
    return zahtev.query(sql,[idKorisnika])
}

exports.dodaj=dodaj;
exports.prijava=prijava;
exports.nadji_po_id=nadji_po_id;
