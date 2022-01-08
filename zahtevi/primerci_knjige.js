const express=require('express')
const mysql=require('mysql')
const app=require('../app');
const zahtev=require('./zahtev');
const moment=require('moment');
async function dodaj(id_knjige,broj_primeraka)
{
    let vrednosti=new Array();
    let sql='';
    for(let i=0;i<broj_primeraka;i++)
    {
        console.log(i);
        vrednosti.push(id_knjige);
        if(i==0)
        sql+="INSERT INTO primerci_knjige (idKnjige) VALUES (?)";
        else
        sql+=",(?)";
    }
   return await zahtev.query(sql,vrednosti);
}

async function nadji_po_id(id)
{
    let sql="SELECT primerci_knjige.id,primerci_knjige.idKnjige,primerci_knjige.idKorisnika,primerci_knjige.datumUzimanja,primerci_knjige.datumVracanja,knjige.ime,knjige.imeAutora,kategorije.zanr,korisnici.ime as ime_korisnika ,korisnici.prezime as prezime_korisnika,korisnici.idKorisnika as idKorisnika,korisnici.brojlicne,korisnici.telefon,korisnici.email,DATE_FORMAT(datumrodjenja,'%d.%m.%Y.') as datumrodjenja,jmbg FROM primerci_knjige INNER JOIN knjige ON knjige.IdKnjige=primerci_knjige.IdKnjige INNER JOIN kategorije ON kategorije.idKategorije=knjige.IdKategorije LEFT JOIN korisnici ON korisnici.idKorisnika=primerci_knjige.idKorisnika  WHERE id = ?"
    return zahtev.query(sql,[id])
}
async function nadji_po_idKorisnika(idKorisnika)
{
    let sql="SELECT primerci_knjige.id,primerci_knjige.idKorisnika,DATE_FORMAT(primerci_knjige.datumUzimanja,'%d.%m.%Y.') as datumUzimanja,DATE_FORMAT(primerci_knjige.datumVracanja,'%d.%m.%Y.') as datumVracanja,IF(NOW()>primerci_knjige.datumVracanja, '1', '0') as kasni,knjige.ime,knjige.imeAutora,kategorije.zanr,korisnici.ime as ime_korisnika ,korisnici.prezime as prezime_korisnika,korisnici.idKorisnika as idKorisnika FROM primerci_knjige INNER JOIN knjige ON knjige.IdKnjige=primerci_knjige.IdKnjige INNER JOIN kategorije ON kategorije.idKategorije=knjige.IdKategorije LEFT JOIN korisnici ON korisnici.idKorisnika=primerci_knjige.idKorisnika WHERE primerci_knjige.idKorisnika = ?"
    return zahtev.query(sql,[idKorisnika])
}
async function nadji_po_idKnjige(idKnjige)
{
    let sql="SELECT primerci_knjige.id,primerci_knjige.idKorisnika,DATE_FORMAT(primerci_knjige.datumUzimanja,'%d.%m.%Y.') as datumUzimanja,DATE_FORMAT(primerci_knjige.datumVracanja,'%d.%m.%Y.') as datumVracanja,IF(NOW()>primerci_knjige.datumVracanja, '1', '0') as kasni,knjige.ime,knjige.imeAutora,kategorije.zanr,korisnici.ime as ime_korisnika ,korisnici.prezime as prezime_korisnika,korisnici.idKorisnika as idKorisnika FROM primerci_knjige INNER JOIN knjige ON knjige.IdKnjige=primerci_knjige.IdKnjige INNER JOIN kategorije ON kategorije.idKategorije=knjige.IdKategorije LEFT JOIN korisnici ON korisnici.idKorisnika=primerci_knjige.idKorisnika WHERE primerci_knjige.idKnjige = ?"
    return zahtev.query(sql,[idKnjige])
}
async function iznajmi_potvrda(idKorisnika,idPrimerkaKnjige)
{
    var danasnjiDatum=moment().format('YYYY-MM-DD');
    var datumVracanja=moment().add(14,'days').format('YYYY-MM-DD');
    let sql="UPDATE primerci_knjige SET idKorisnika=?,datumUzimanja=?,datumVracanja=? WHERE primerci_knjige.id=?"
    return zahtev.query(sql,[idKorisnika,danasnjiDatum,datumVracanja,idPrimerkaKnjige]);
}
async function vrati_knjigu(idPrimerkaKnjige)
{
    let sql="UPDATE primerci_knjige SET idKorisnika=NULL,datumUzimanja=NULL,datumVracanja=NULL WHERE primerci_knjige.id=?"
    return zahtev.query(sql,[idPrimerkaKnjige]);
}
async function obrisi(idPrimerkaKnjige)
{
    let sql="DELETE FROM primerci_knjige WHERE id=?"
    return zahtev.query(sql,[idPrimerkaKnjige]);
}
exports.dodaj=dodaj;
exports.nadji_po_id=nadji_po_id;
exports.iznajmi_potvrda=iznajmi_potvrda;
exports.nadji_po_idKnjige=nadji_po_idKnjige;
exports.vrati_knjigu=vrati_knjigu
exports.obrisi=obrisi
exports.nadji_po_idKorisnika=nadji_po_idKorisnika