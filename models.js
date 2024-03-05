import mongoose from 'mongoose';

let models = {};

await mongoose.connect('mongodb+srv://UserGuy:passwordguy@cluster0.5mbj5pg.mongodb.net/final');

const artSchema = new mongoose.Schema({
	imgUrl: String,
	alt: String,
  title: String,
	username: String,
	likes: [String],
	created_date: Date
});

const gallerySchema = new mongoose.Schema({
  title: String,
	users: [String],
	arts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Art'}],
	created_date: Date
});

const commentSchema = new mongoose.Schema({
	username: String,
	comment: String,
	art: {type: mongoose.Schema.Types.ObjectId, ref: 'Art'},
	created_date: Date
});

models.Art = mongoose.model('Art', artSchema);
models.Gallery = mongoose.model('Gallery', gallerySchema);
models.Comment = mongoose.model('Comment', commentSchema);

export default models;