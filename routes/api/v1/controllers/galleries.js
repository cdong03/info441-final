import express from 'express';

var router = express.Router();

router.delete('/', async (req, res) => {
	try {
		if (req.session.isAuthenticated) {
			await req.models.Gallery.deleteOne({'_id': req.body.id});
			res.send({'status': 'success'});
		} else {
			res.status(401).json({status: 'error', error: 'not logged in'});
		}
	} catch(err) {
    console.log(err);
		res.status(500).json({'status': 'error', 'error': err});
	}
});

// Add art
router.post('/art', async (req, res) => {
  try {
		if (req.session.isAuthenticated) {
			let findArt = await req.models.Art.findOne({'username': req.body.username, 'title': req.body.title});
			let artID = findArt.id;
			if (artID) {
				let findGall = await req.models.Gallery.findOne({'_id': req.body.gallery});
				if (!findGall.arts.includes(artID)) {
					findGall.arts.push(artID);
					await findGall.save();
				}
			} else {
				res.status(401).json({status: 'error', error: 'art or gallery not found'});
			}
			res.send({'status': 'success'});
		} else {
			res.status(401).json({status: 'error', error: 'not logged in'});
		}
	} catch(err) {
    console.log(err);
		res.status(500).json({'status': 'error', 'error': err});
	}
});

// Add user
router.post('/user', async (req, res) => {
  try {
		if (req.session.isAuthenticated) {
			let username = req.body.username;
			let findGall = await req.models.Gallery.findOne({'_id': req.body.gallery});
			if (!findGall.users.includes(username)) {
				findGall.users.push(username);
				await findGall.save();
			}
			res.send({'status': 'success'});
		} else {
			res.status(401).json({status: 'error', error: 'not logged in'});
		}
	} catch(err) {
    console.log(err);
		res.status(500).json({'status': 'error', 'error': err});
	}
});

router.post('/', async (req, res) => {
  try {
		if (req.session.isAuthenticated) {
			const Gallery = new req.models.Gallery({
				title: req.body.title,
        users: [req.session.account.username],
				arts: [],
				created_date: Date.now()
			});
			await Gallery.save();
			res.send({'status': 'success'});
		} else {
			res.status(401).json({status: 'error', error: 'not logged in'})
		}
	} catch(err) {
    console.log(err);
		res.status(500).json({'status': 'error', 'error': err});
	}
});

router.get('/', async (req, res) => {
	try {
		let allArt = await req.models.Gallery.find();
		let artData = await Promise.all(
			allArt.map(async art => {
				let userPartOf = false;
				let users = art.users
				if (req.session.isAuthenticated && users.includes(req.session.account.username)) {
					userPartOf = true;
				}
				return {'title': art.title, 'users': art.users, 'created_date': art.created_date, 'userPartOf': userPartOf, 'id': art._id};
			})
	);
		res.send(artData);
	} catch(err) {
    console.log(err);
		res.status(500).json({'status': 'error', 'error': err});
	}
});

export default router;