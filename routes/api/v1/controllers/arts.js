import express from 'express';

var router = express.Router();

router.post('/like', async (req, res) => {
	try {
		if (req.session.isAuthenticated) {
			let username = req.session.account.username
			let findArt = await req.models.Art.findOne({'_id': req.body.artID});
			if (!findArt.likes.includes(username)) {
				findArt.likes.push(username);
				await findArt.save();
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

router.post('/unlike', async (req, res) => {
	try {
		if (req.session.isAuthenticated) {
			let findArt = await req.models.Art.findOne({'_id': req.body.artID});
			if (findArt.likes.includes(req.session.account.username)) {
				findArt.likes.splice(findArt.likes.indexOf(req.session.account.username), 1);
			}
			await findArt.save();
			res.send({'status': 'success'});
		} else {
			res.status(401).json({status: 'error', error: 'not logged in'})
		}
	} catch(err) {
    console.log(err);
		res.status(500).json({'status': 'error', 'error': err});
	}
});

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

router.post('/', async (req, res) => {
  try {
		if (req.session.isAuthenticated) {
			const Art = new req.models.Art({
				imgUrl: req.body.art_url,
				title: req.body.art_title,
        		alt: req.body.art_alt,
				username: req.session.account.username,
				created_date: Date.now()
			});
			await Art.save();
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
		let username = req.query.username;
		let allArt = '';
		if (username) {
			allArt = await req.models.Art.find({'username': username});
		} else {
			allArt = await req.models.Art.find();
		}
		let artData = await Promise.all(
			allArt.map(async art => {
				return {'imgUrl': art.imgUrl, 'alt': art.alt, 'title': art.title, 'username': art.username, 'likes': art.likes, 'id': art._id};
			})
	);
		res.send(artData);
	} catch(err) {
    console.log(err);
		res.status(500).json({'status': 'error', 'error': err});
	}
});

export default router;