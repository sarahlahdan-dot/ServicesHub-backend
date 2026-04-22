const Service = require('../models/Service');

const getAllServices = async (req, res) => {
    try {
        const allServices = await Service.find().populate('providerId', 'name email role');
        res.json(allServices);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

const getOneService = async (req, res) => {
    try {
        const oneService = await Service.findById(req.params.id).populate('providerId');
        res.json(oneService);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

const createService = async (req, res) => {
    try {
        req.body.providerId = req.user._id;
        const createdService = await Service.create(req.body);
        res.status(201).json(createdService);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

const updateService = async (req, res) => {
    try {
        const serviceList = await Service.findById(req.params.id);
        if (!serviceList.providerId.equals(req.user._id)) {
            return res.status(403).json({ err: 'You cannot update this service' });
        }
        const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedService);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

const deleteService = async (req, res) => {
    try {
        const serviceListings = await Service.findById(req.params.id);
        if (!serviceListings.providerId.equals(req.user._id)) {
            return res.status(403).json({ err: 'You cannot delete this service' });
        }
        const deletedService = await Service.findByIdAndDelete(req.params.id);
        res.json(deletedService);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

module.exports = { getAllServices, getOneService, createService, updateService, deleteService };
