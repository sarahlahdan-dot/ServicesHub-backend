const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Review = require('../models/Review');
const Service = require('../models/Service');
const User = require('../models/User');     


//submit a review
router.post('/', async(req,res)=>{
    try{
        const {bookingId} = req.params;
        
        //find booking 
        const booking = await Booking.findById(bookingId);

        if(!booking){
            return res.status(404).json9({message: 'Booking not found'});
    }
    
    // check booking status
    if(booking.status !== 'completed'){
        return res.status(400).json({message: 'cannot make a review , booking status must be completed!'});
    }

    //create review

    const review = await Review.create(req.body);
     res.status(201).json(createdReview);
}

    catch(err){
        console.log(err);
         res.status(500).json({err:err.message})
    }
});