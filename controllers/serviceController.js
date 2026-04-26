const Service = require("../models/Service");

const getAllServices = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };

    const allServices = await Service.find(filter).populate(
      "providerId",
      "name email",
    );
    res.json(allServices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOneService = async (req, res) => {
  try {
    const oneService = await Service.findById(req.params.id).populate(
      "providerId",
      "name email",
    );
    if (!oneService)
      return res.status(404).json({ message: "Service not found." });
    res.json(oneService);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createService = async (req, res) => {
  try {
    req.body.providerId = req.user.id; // fix: was req.user._id
    const createdService = await Service.create(req.body);
    res.status(201).json(createdService);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service)
      return res.status(404).json({ message: "Service not found." });

    if (String(service.providerId) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ message: "You cannot update this service." });
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(updatedService);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service)
      return res.status(404).json({ message: "Service not found." });

    if (String(service.providerId) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ message: "You cannot delete this service." });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllServices,
  getOneService,
  createService,
  updateService,
  deleteService,
};
