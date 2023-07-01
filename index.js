const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
require('dotenv').config();
const jwt = require ('jsonwebtoken');
const avatarMaker = require('./avatarmaker');
const users = {
	admin:{
		passwordHash:'31d08dea87991407c2c1712ac8c65642899fab5b933a680df28db923d84916eee519c84e8176e889f5c45818039f30cd74d07f24242f90efd6664dc1065f00cb',
		notes:[
			process.env.flag
		]
	}
}

const PORT = 8080;

const app = express();

const unauthed = ['/login.html','/register.html','/login','/register','/main.css'];

app.use(cookieParser());
app.use(bodyParser.json());

app.use((req,res,next)=>{
	if(unauthed.includes(req._parsedUrl.pathname)) return next();
	if(!req.cookies.auth) return res.redirect('/login.html');
	jwt.verify(req.cookies.auth,'1KpIFmdVsY+dlTY/Qas/rutotaTcznieSLGV9QheewIgyg56B10CsSO6Y89CHaElG5VI5J80Tk4gKuK9eSH15A==',(err,decoded)=>{
		if(err) return res.redirect('/login.html');
		if(!(decoded.username in users)){
			res.clearCookie('auth');
			return res.redirect('/login.html');
		}
		req.decoded = decoded;
		next();
	});
});


app.use(express.static('./public'));




app.post('/login',(req,res)=>{
	if(!('username' in req.body) || !('password' in req.body)) 
		return res.send({
			success:false,
			message: 'Invalid request!'
		});
	if(!(req.body.username in users))
		return res.send({
			success:false,
			message: 'Invalid user!'
		});
	const passHash = crypto.createHash('sha512').update(req.body.password).digest('hex');
	if(passHash !== users[req.body.username].passwordHash)
		return res.send({
			success:false,
			message: 'Invalid password!'
		});
	const auth = jwt.sign({username:req.body.username},'1KpIFmdVsY+dlTY/Qas/rutotaTcznieSLGV9QheewIgyg56B10CsSO6Y89CHaElG5VI5J80Tk4gKuK9eSH15A==',{expiresIn:'7d'});	
	res.cookie('auth',auth,{maxAge:604800000});
	return res.send({
		success: true,
		message: 'Successful login!'
	});

});

app.post('/register',(req,res)=>{
	if(!('username' in req.body) || !('password' in req.body)) 
		return res.send({
			success:false,
			message: 'Invalid request!'
		});
	if(req.body.username in users)
		return res.send({
			success:false,
			message: 'Invalid user!'
		});
	const passHash = crypto.createHash('sha512').update(req.body.password).digest('hex');
	users[req.body.username] = {};
	users[req.body.username].passwordHash = passHash;
	users[req.body.username].notes = ['Welcome to the notes site!']
	avatarMaker.makeAvatar('avatars/' + crypto.createHash('md5').update(req.body.username).digest('hex') + '.png')
	return res.send({
		success: true,
		message: 'Successful registration!'
	});

});

app.get('/home',(req,res)=>{
	const username = req.decoded.username
	res.send({
		username,
		notes:users[username].notes,
		avatar: crypto.createHash('md5').update(username).digest('hex') + '.png'
	})
});

app.get('/avatar',(req,res)=>{
	if(req.query.file.includes('proc')) return res.send('This is a secure system. That is not permitted.');
	return res.send(fs.readFileSync(`avatars/${req.query.file}`));
});


app.post('/note',(req,res)=>{
	if(!req.body.note) 
		return res.send({
			success:false,
			message: 'Invalid request!'
		});
	users[req.decoded.username].notes.push(req.body.note);
	return res.send({
		success: true,
		message: 'Note added!',
		notes: users[req.decoded.username].notes
	});

});

app.listen(PORT,()=>{
	console.log(`Listening on port ${PORT}.`);
});
