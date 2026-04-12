import Complaint from '../models/Complaint.js';

export async function createComplaint(req, res, next) {
  try {
    const { title, description, category } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    const doc = await Complaint.create({
      user: req.user._id,
      title,
      description,
      category,
    });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

export async function listMyComplaints(req, res, next) {
  try {
    const items = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

export async function listAllComplaints(req, res, next) {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const items = await Complaint.find(filter)
      .populate('user', 'name email')
      .populate('handledBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

export async function getComplaint(req, res, next) {
  try {
    const doc = await Complaint.findById(req.params.id)
      .populate('user', 'name email')
      .populate('handledBy', 'name email');
    if (!doc) return res.status(404).json({ message: 'Complaint not found' });
    if (req.user.role !== 'admin' && doc.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

export async function updateComplaintAdmin(req, res, next) {
  try {
    const doc = await Complaint.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Complaint not found' });
    const { status, adminNotes } = req.body;
    if (status) doc.status = status;
    if (adminNotes !== undefined) doc.adminNotes = adminNotes;
    doc.handledBy = req.user._id;
    await doc.save();
    res.json(doc);
  } catch (err) {
    next(err);
  }
}
