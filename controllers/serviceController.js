const Service = require('../models/Service');
const User = require('../models/User');

const getServices = async (req, res) => {
  try {
    const query = {};
    if (req.query.provider) {
      query.provider = req.query.provider;
    }

    const services = await Service.find(query)
      .populate('provider', 'name email role')
      .sort({ createdAt: -1 });
    return res.json(services);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProviders = async (req, res) => {
  try {
    const providers = await User.find({ role: 'provider' })
      .select('name email role createdAt')
      .sort({ createdAt: -1 });
    return res.json(providers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const { title, description, price, availableFrom, availableTo } = req.body;

    if (!title || !description || price === undefined || !availableFrom || !availableTo) {
      return res.status(400).json({ message: 'Missing required service fields.' });
    }

    const service = await Service.create({
      title,
      description,
      price,
      availableFrom,
      availableTo,
      provider: req.user.id,
    });

    return res.status(201).json(service);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    if (req.user.role !== 'admin' && String(service.provider) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not allowed to update this service.' });
    }

    Object.assign(service, req.body);
    const updated = await service.save();
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    if (req.user.role !== 'admin' && String(service.provider) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not allowed to delete this service.' });
    }

    await service.deleteOne();
    return res.json({ message: 'Service deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getServices,
  getProviders,
  createService,
  updateService,
  deleteService,
};