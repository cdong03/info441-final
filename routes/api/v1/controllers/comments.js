import express from 'express';

var router = express.Router();

router.get('/', async (req, res) => {
	try {
    let allComments = await req.models.Comment.find({'post': req.query.postID});
		console.log(allComments);
		let commentData = [];
		if (allComments) {
			commentData = await Promise.all(
				allComments.map(async comm => {
					return {'id': comm._id, 'username': comm.username, 'comment': comm.comment, 'art': comm.art, 'created_date': comm.created_date};
				})
			);
		}
		res.send(commentData);
	} catch(err) {
    console.log(err);
		res.status(500).json({'status': 'error', 'error': err});
	}
});

router.post('/', async (req, res) => {
  try {
		if (req.session.isAuthenticated) {
			const Comment = new req.models.Comment({
				username: req.session.account.username,
				comment: req.body.newComment,
				art: req.body.artID,
				created_date: Date.now()
			});
			await Comment.save();
			res.send({'status': 'success'});
		} else {
			res.status(401).json({status: 'error', error: 'not logged in'})
		}
	} catch(err) {
    console.log(err);
		res.status(500).json({'status': 'error', 'error': err});
	}
});

export default router;