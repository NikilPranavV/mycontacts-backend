const asyncHandler = require("express-async-handler");

const Contact = require("../models/contactModel");
//@desc Get all contacts
//@route GET /api/contacts
//@access private

const getContacts = asyncHandler(async(req,res) => {
    const contacts = await Contact.find({user_id : req.user.id});
    res.status(200).json(contacts); 
});

//@desc Get contacts
//@route GET /api/contacts/:id
//@access private

const getContact = asyncHandler(async(req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
});

//@desc Create all contacts
//@route POST /api/contacts
//@access private

const createContact = asyncHandler(async(req,res) => {
    const {name, email, phone} = req.body;
    if(!name || !email || !phone){
        res.status(400); //error if the body is empty
        throw new Error ("Fields should not be empty");
    }

    console.log("the request body is:", req.body); //if the body is defined


    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id,
    });

    res.status(201).json(contact);

});

//@desc Update contacts
//@route PUT /api/contacts/:id
//@access private

const updateContact = asyncHandler(async(req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("other users arenot allowed to edit the contacts");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true
        }
    );
    res.status(200).json(updatedContact);
});

//@desc Delete contacts
//@route Delete /api/contacts/:id
//@access private

const deleteContact = asyncHandler(async(req,res) => {

    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("other users arenot allowed to edit the contacts");
    }
    await Contact.deleteOne({_id : req.params.id});
    res.status(200).json(contact);
});

module.exports = {
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact,
  };