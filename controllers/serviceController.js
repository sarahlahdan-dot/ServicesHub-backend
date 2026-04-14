const {
  listServices,
  listProviders,
  createProviderService,
  updateProviderService,
  removeProviderService,
} = require('../services/serviceService');

const getServices = async (req, res) => {
  try {
    const services = await listServices(req.query.provider);
    return res.json(services);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const getProviders = async (req, res) => {
  try {
    const providers = await listProviders();
    return res.json(providers);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const service = await createProviderService({
      ...req.body,
      providerId: req.user.id,
    });

    return res.status(201).json(service);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const updated = await updateProviderService({
      serviceId: req.params.id,
      payload: req.body,
      currentUser: req.user,
    });
    return res.json(updated);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    await removeProviderService({
      serviceId: req.params.id,
      currentUser: req.user,
    });
    return res.json({ message: 'Service deleted' });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = {
  getServices,
  getProviders,
  createService,
  updateService,
  deleteService,
};