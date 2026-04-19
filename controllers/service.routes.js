const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Review = require('../models/Review');
const Service = require('../models/Service');
const User = require('../models/User');     
const { verify } = require('jsonwebtoken');

// get all services 

router.get('/', async (req,res) =>{
try{
const allServices = await Service.find().populate('providerId','username')
res.json(allServices)
}
catch(err){
console.log(err)
res.status(500).json(err)
}
})

// get single service

router.get('/:id', async (req,res)=>{
    try{
        const oneService = await Service.findById(req.params.id).populate('providerId')
        res.json(oneService)

    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

//create new service

router.post('/',verifyToken , async(req,res)=>{
    try{
        req.body.providerId = req.user._id
        const createdService = await Service.create(req.body)
        res.status(200).json(createdService)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }

})

// update service


router.put('/:id',verifyToken, async (req,res)=>{
    
     try{
        const serviceList = await Service.findById(req.params.id)
        if(!serviceList.providerId.equals(req.user._id)){
             return res.status(403).json({err:'You cant update this list'})
             }

                const updateService = await Service.findByIdAndUpdate(req.params.id,req.body,{new:true})
                res.json(updateService)
        }
    
    
     catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})


// delete service

router.delete('/:id', verifyToken, async(req,res)=>{
    try{
        const serviceListings = await Service.findById(req.params.id)
        if(!serviceListings.providerId.equals(req.user._id)){
            return res.status(403).json({err:'You cant update this list'})
        }
        const deletedService = await Service.findByIdAndDelete(req.params.id)
        res.json(deletedService)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})