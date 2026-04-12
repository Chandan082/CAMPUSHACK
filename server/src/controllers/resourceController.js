import Resource from '../models/Resource.js';

export async function listResources(req, res, next) {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const items = await Resource.find(filter).populate('uploadedBy', 'name email').sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

export async function getResource(req, res, next) {
  try {
    const doc = await Resource.findById(req.params.id).populate('uploadedBy', 'name email');
    if (!doc) return res.status(404).json({ message: 'Resource not found' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

export async function createResource(req, res, next) {
  try {
    const { title, description, url, category } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const doc = await Resource.create({
      title,
      description,
      url,
      category,
      uploadedBy: req.user._id,
    });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

export async function updateResource(req, res, next) {
  try {
    const doc = await Resource.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Resource not found' });
    if (doc.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }
    Object.assign(doc, req.body);
    await doc.save();
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

export async function deleteResource(req, res, next) {
  try {
    const doc = await Resource.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Resource not found' });
    if (doc.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }
    await doc.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}
