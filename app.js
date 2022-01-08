const express=require('express')
const mysql=require('mysql')
const parser = require('body-parser')
const app=express();
const knjige=require('./zahtevi/knjige')
const primerci_knjige=require('./zahtevi/primerci_knjige')
const kategorije=require('./zahtevi/zanrovi')
const korisnici=require('./zahtevi/korisnik')
const session=require('express-session')
const bcrypt=require('bcrypt')
app.set('view engine','pug')
app.use(parser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(session({
    secret: 'ufieufkvfidfiy',
    saveUninitialized: true,
    resave: false,
  }))
const con = mysql.createConnection({
    host: 'localhost', user: 'root',database: 'biblioteka'
    });
    
app.use(function (req, res, next) {
    if(typeof req.session.korisnik_id!='undefined')
    {
        req.session.korisnik_id==null
    }
    if(typeof req.session.tip_naloga!='undefined')
    {
        req.session.tip_naloga==null
    }
    if(req.session.korisnik_id!=null)
    {
        res.locals.korisnik_id=req.session.korisnik_id;
    
    }
    if(req.session.tip_naloga!=null)
    {
        res.locals.tip_naloga=req.session.tip_naloga;
    
    }
    next()
})
app.get('/knjige/dodaj',async (req,res)=>
{
    if(!req.session.korisnik_id)
    {
        res.redirect('/login');
        return;
    }
    else
    {
        if(req.session.tip_naloga!='bibliotekar')
        {
            res.redirect('/knjige');
            return;
        }
    }
    let zanrovi=await kategorije.prikazi();
    let sql="SELECT * from kategorije"
    con.query(sql,[],(err,zanrovi)=>
    {
        console.log(zanrovi);
        res.render('knjige/dodaj',{trenutna:'kdodaj',zanrovi:zanrovi});
    })
})
app.post('/knjige/dodaj',async (req,res)=>
{
    if(!req.session.korisnik_id)
    {
        res.redirect('/login');
        return;
    }
    else
    {
        if(req.session.tip_naloga!='bibliotekar')
        {
            res.redirect('/knjige');
            return;
        }
    }
    var ime=req.body.ime;
    var ime_autora=req.body.ime_autora;
    var zanr=req.body.zanr;
    var broj_primeraka=req.body.broj_primeraka;
    knjige.dodaj(ime,ime_autora,zanr,broj_primeraka);
    res.redirect('/knjige/dodaj');
   
    
    

})

app.get('/korisnik/dodaj',async (req,res)=>
{
    if(!req.session.korisnik_id)
    {
        res.redirect('/login');
        return;
    }
    else
    {
        if(req.session.tip_naloga!='bibliotekar')
        {
            res.redirect('/knjige');
            return;
        }
    }
    res.render('korisnik/dodaj',{trenutna:'registracija'});
})
app.post('/korisnik/dodaj',async (req,res)=>
{
    if(!req.session.korisnik_id)
    {
        res.redirect('/login');
        return;
    }
    else
    {
        if(req.session.tip_naloga!='bibliotekar')
        {
            res.redirect('/knjige');
            return;
        }
    }
    var ime=req.body.ime;
    var prezime=req.body.prezime;
    var email=req.body.email;
    var bojlicne=req.body.brojlicne;
    var datumrodjenja=req.body.datumrodjenja;
    var jmbg=req.body.jmbg;
    var telefon=req.body.telefon;
    var tipnaloga=req.body.tipnaloga;
    var lozinka=req.body.lozinka;
    var salt = await bcrypt.genSalt(5);
    lozinka = await bcrypt.hash(lozinka, salt);
    korisnici.dodaj(ime,prezime,email,bojlicne,datumrodjenja,jmbg,telefon,tipnaloga,lozinka)
    res.redirect('/knjige')
})

app.get('/login',async (req,res)=>
{
    if(req.session.korisnik_id)
    {
        if(req.session.tip_naloga=='bibliotekar')
        {
            res.redirect('/knjige');
            return;
        }
        else
        {
            res.redirect('/moje');
            return;
        }
    }
    else
    {
        res.render('korisnik/login');
    }
})
app.get('/logout', function(req,res){

    req.session.korisnik_id=null;
    req.session.tip_naloga=null;
    res.redirect('/login')
   })


app.post('/login',async (req,res)=>
{
        var korisnik=await korisnici.prijava(req.body.email);
        
        if(korisnik.length==1)
        {
            var ispravna= await bcrypt.compare(req.body.lozinka, korisnik[0].lozinka);
            if(ispravna==false)
            {
                res.render('korisnik/login',{greska:'Pogresan mail ili lozinka.'});
                return;
            }
            req.session.korisnik_id=korisnik[0].idKorisnika;
            req.session.tip_naloga=korisnik[0].tipnaloga;
            res.redirect('/knjige');
        }
        else
        {
            res.render('korisnik/login',{greska:'Pogresan mail ili lozinka.'});
        }
})
app.get('/knjige',async (req,res)=>
{
    if(!req.session.korisnik_id)
    {
        res.redirect('/login');
        return;
    }
    else
    {
        if(req.session.tip_naloga!='bibliotekar')
        {
            res.redirect('/moje');
            return;
        }
    }
    var sve_knjige=await knjige.sve();
    console.log(sve_knjige);
    res.render('knjige/lista',{trenutna:'knjige',knjige:sve_knjige})
})

app.get('/bibliotekar/iznajmi/:id_primerka_knjige?',async (req,res)=>
{
    if(!req.session.korisnik_id)
    {
        res.redirect('/login');
        return;
    }
    else
    {
        if(req.session.tip_naloga!='bibliotekar')
        {
            res.redirect('/knjige');
            return;
        }
    }
    var id_primerka_knjige=req.params.id_primerka_knjige;
    res.render('bibliotekar/iznajmi',{id_primerka_knjige:id_primerka_knjige, trenutna:'iznajmi'});
})
app.post('/bibliotekar/iznajmi',async (req,res)=>
{
    if(!req.session.korisnik_id)
    {
        res.redirect('/login');
        return;
    }
    else
    {
        if(req.session.tip_naloga!='bibliotekar')
        {
            res.redirect('/knjige');
            return;
        }
    }
    var id_korisnika=req.body.broj_clanske_karte;
    var id_primerka_knjige=req.body.broj_knjige;
    var korisnik=await korisnici.nadji_po_id(id_korisnika);
    var primerak_knjige=await primerci_knjige.nadji_po_id(id_primerka_knjige);
    var greska='';
    if(korisnik.length==0)
    {
        greska+='Korisnik sa tim brojem clanske karte nije pronadjen.';
    }
    if(primerak_knjige.length==0)
    {
        greska+='Knjiga sa tim brojem nije pronadjena.';
    }
    else
    {
        if(primerak_knjige[0].idKorisnika!=null)
        {
            greska+='Knjiga sa tim brojem je vec iznajmljena.';
        }
    }
    if(greska=='')
    {
        console.log(primerak_knjige);
        console.log(korisnik);
        res.render('bibliotekar/iznajmi_potvrda',{primerak_knjige:primerak_knjige[0],korisnik:korisnik[0]});
    }
    else
    {
        console.log(greska);
        res.render('bibliotekar/iznajmi',{greska,});
    }
})
app.get('/bibliotekar/vrati_potvrda/:id_primerka_knjige',async(req,res)=>
{
    if(!req.session.korisnik_id)
    {
        res.redirect('/login');
        return;
    }
    else
    {
        if(req.session.tip_naloga!='bibliotekar')
        {
            res.redirect('/knjige');
            return;
        }
    }
    var id_primerka_knjige=req.params.id_primerka_knjige;
    var primerak_knjige=await primerci_knjige.nadji_po_id(id_primerka_knjige);
    res.render('bibliotekar/vrati_potvrda',{primerak_knjige:primerak_knjige[0]})

})
app.post('/bibliotekar/vrati_potvrda/:id_primerka_knjige',async(req,res)=>
{
    if(!req.session.korisnik_id)
    {
        res.redirect('/login');
        return;
    }
    else
    {
        if(req.session.tip_naloga!='bibliotekar')
        {
            res.redirect('/knjige');
            return;
        }
    }
    var id_primerka_knjige=req.params.id_primerka_knjige;
    var iznajmljivanje=await primerci_knjige.vrati_knjigu(id_primerka_knjige);
    var primerak_knjige=await primerci_knjige.nadji_po_id(id_primerka_knjige);
    res.redirect(`/knjige/info/${primerak_knjige[0].idKnjige}`)


})
app.post('/bibliotekar/iznajmi_potrvrda/:id_korisnika/:id_primerka_knjige',async (req,res)=>
{
    if(!req.session.korisnik_id)
    {
        res.redirect('/login');
        return;
    }
    else
    {
        if(req.session.tip_naloga!='bibliotekar')
        {
            res.redirect('/knjige');
            return;
        }
    }
    var id_korisnika=req.params.id_korisnia;
    var id_primerka_knjige=req.params.id_primerka_knjige;
    var novo_iznajmljivanje=await primerci_knjige.iznajmi_potvrda(id_korisnika,id_primerka_knjige);
    res.render('bibliotekar/iznajmi',{uspesno:'Knjige uspesno iznajmljenja'});
    
})

app.get('/knjige/info/:id_knjige',async (req,res)=>
{
    if(!req.session.korisnik_id)
    {
        res.redirect('/login');
        return;
    }
    else
    {
        if(req.session.tip_naloga!='bibliotekar')
        {
            res.redirect('/knjige');
            return;
        }
    }
    var knjiga=await knjige.nadji_po_id(req.params.id_knjige)
    var primerci=await primerci_knjige.nadji_po_idKnjige(req.params.id_knjige)
    console.log(knjiga[0])
    res.render('knjige/knjiga_info',{treutna:'knjiga_info',knjiga:knjiga[0],primerci:primerci});
})
app.get('/moje',async (req,res)=>
{
    if(!req.session.korisnik_id)
    {
        res.redirect('/login');
        return;
    }

    var primerci=await primerci_knjige.nadji_po_idKorisnika(req.session.korisnik_id)
    res.render('knjige/moje_knjige',{primerci:primerci});
})
app.post('/primerci_knjige/obrisi/:id_primerka_knjige',async (req,res)=>
{
    if(!req.session.korisnik_id)
    {
        res.redirect('/login');
        return;
    }
    else
    {
        if(req.session.tip_naloga!='bibliotekar')
        {
            res.redirect('/knjige');
            return;
        }
    }
    var id_primerka_knjige=req.params.id_primerka_knjige;
    var primerak_knjige=await primerci_knjige.nadji_po_id(id_primerka_knjige);
    console.log(id_primerka_knjige,primerak_knjige)
    var brisanje=await primerci_knjige.obrisi(id_primerka_knjige);
    res.redirect(`/knjige/info/${primerak_knjige[0].idKnjige}`)
    
})
app.post('/knjige/obrisi/:id_knjige',async (req,res)=>
{
    if(!req.session.korisnik_id)
    {
        res.redirect('/login');
        return;
    }
    else
    {
        if(req.session.tip_naloga!='bibliotekar')
        {
            res.redirect('/knjige');
            return;
        }
    }
    var id_knjige=req.params.id_knjige;
    var brisanje=await knjige.obrisi(id_knjige);
    res.redirect(`/knjige`)
    
})
app.get('/',(req,res)=>
{
    res.redirect('/login')
})
app.listen(5000);




exports.con=con;