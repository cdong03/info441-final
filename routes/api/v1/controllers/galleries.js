import express from 'express';

var router = express.Router();

router.delete('/', async (req, res) => {
	try {
		if (req.session.isAuthenticated) {
			let artID = req.body.artID;
			let findArt = await req.models.Art.findOne({'_id': artID});
			if (findArt.username !== req.session.account.username) {
				res.status(401).json({status: 'error', error: 'you can only delete your own art'});
			}
			await req.models.Comment.deleteMany({'art': artID});
			await req.models.Art.deleteOne({'_id': artID});
			res.send({'status': 'success'});
		} else {
			res.status(401).json({status: 'error', error: 'not logged in'})
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
			let findArt = await req.models.Art.findOne({'_id': req.body.id});
			let artID = findArt.id;
			if (artID) {
				findGall.arts.push(artID);
				await findGall.save();
			}
			res.send({'status': 'success'});
		} else {
			res.status(401).json({status: 'error', error: 'not logged in'})
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
			let findGall = await req.models.Gallery.findOne({'_id': req.body.id});
			if (!findGall.users.includes(username)) {
				findGall.users.push(username);
				await findGall.save();
			}
			res.send({'status': 'success'});
		} else {
			res.status(401).json({status: 'error', error: 'not logged in'})
		}
	} catch(err) {
    console.log(err);
		res.status(500).json({'status': 'error', 'error': err});
	}
});

router.post('/', async (req, res) => {
  try {
		if (req.session.isAuthenticated) {
			console.log('starting');
			const Gallery = new req.models.Gallery({
				title: req.body.title,
        users: [req.session.account.username],
				arts: [],
				created_date: Date.now()
			});
			console.log('ending');
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
				return {'title': art.title, 'users': art.users, 'created_date': art.created_date, 'userPartOf': userPartOf};
			})
	);
		res.send(artData);
	} catch(err) {
    console.log(err);
		res.status(500).json({'status': 'error', 'error': err});
	}
});

export default router;