import Event from '../models/Event.js';

export async function listEvents(req, res, next) {
  try {
    const items = await Event.find({ isPublished: true }).sort({ startsAt: 1 }).limit(100);
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

export async function listAllEvents(req, res, next) {
  try {
    const items = await Event.find().sort({ startsAt: -1 }).limit(200);
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

export async function getEvent(req, res, next) {
  try {
    const doc = await Event.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Event not found' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

export async function createEvent(req, res, next) {
  try {
    const { title, description, startsAt, endsAt, location, isPublished } = req.body;
    if (!title || !startsAt) {
      return res.status(400).json({ message: 'Title and startsAt are required' });
    }
    const doc = await Event.create({
      title,
      description,
      startsAt,
      endsAt,
      location,
      organizer: req.user._id,
      isPublished: isPublished !== false,
    });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

export async function updateEvent(req, res, next) {
  try {
    const doc = await Event.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Event not found' });
    if (doc.organizer?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }
    Object.assign(doc, req.body);
    await doc.save();
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

export async function deleteEvent(req, res, next) {
  try {
    const doc = await Event.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Event not found' });
    if (doc.organizer?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }
    await doc.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}
