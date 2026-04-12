import Post from '../models/Post.js';

export async function listPosts(req, res, next) {
  try {
    const { type, status } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    const items = await Post.find(filter).populate('author', 'name email').sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

export async function getPost(req, res, next) {
  try {
    const doc = await Post.findById(req.params.id).populate('author', 'name email');
    if (!doc) return res.status(404).json({ message: 'Post not found' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

export async function createPost(req, res, next) {
  try {
    const { title, description, type, location, contact } = req.body;
    if (!title || !type) {
      return res.status(400).json({ message: 'Title and type (lost/found) are required' });
    }
    const doc = await Post.create({
      title,
      description,
      type,
      location,
      contact,
      author: req.user._id,
    });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req, res, next) {
  try {
    const doc = await Post.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Post not found' });
    if (doc.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }
    const { title, description, type, location, contact, status } = req.body;
    if (title !== undefined) doc.title = title;
    if (description !== undefined) doc.description = description;
    if (type !== undefined) doc.type = type;
    if (location !== undefined) doc.location = location;
    if (contact !== undefined) doc.contact = contact;
    if (status !== undefined) doc.status = status;
    await doc.save();
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req, res, next) {
  try {
    const doc = await Post.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Post not found' });
    if (doc.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }
    await doc.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}
