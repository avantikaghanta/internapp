const express = require('express');
const bodyparser = require('body-parser');
const mongoose =require('mongoose');

const checkAuth = require('../middleware/check-auth');
const checklist = require('../models/checklist');
const checklistcategory= require('../models/checklistcategory')
const checklistRouter = express.Router();

checklistRouter.use (bodyparser.json());

checklistRouter.route('/')
.get(checkAuth, (req,res,next) => {
    const{role}=req.user;
    checklist.find({})
    .then((checklist) => {
        if(role=='admin'|| role=='inspector'){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(checklist);
    }
    res.statusCode=403;
    res.json({message:"not authenticated"});

}, (err) => next(err))
    .catch((err) => next(err));
})
.post(checkAuth, (req, res, next) => {
    const{role}=req.user;
    checklist.create(req.body)
    .then((checklist) => {
        if(role=='admin'|| role=='inspector'){
        console.log('checklist Created ', checklist);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(checklist);
    }
    

}, (err) => next(err))
    .catch((err) => next(err));
})
.put(checkAuth, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /checklist');
})
.delete(checkAuth, (req, res, next) => {
    const{role}=req.user;
    checklist.remove({})
    .then((resp) => {
        if(role!='admin'){
           res.sendStatus(403).json({message:"not authenticated"}); 
        }
        checklist.remove({});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

checklistRouter.route('/:checklistId')
.get(checkAuth, (req,res,next) => {
    const{role}=req.user;
    checklist.findById(req.params.checklistId)
    .then((checklist) => {
        if(role!='inspector'){
            res.sendStatus(403).json({message:"not authenticated"}); 
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(checklist);
}, (err) => next(err))
    .catch((err) => next(err));
})
.post(checkAuth, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /checklist/'+ req.params.checklistId);
})
.put(checkAuth, (req, res, next) => {
    checklist.findByIdAndUpdate(req.params.checklistId, {
        $set: req.body
    }, { new: true })
    .then((checklist) => {
        if(role!='inspector'){
            res.sendStatus(403).json({message:"not authenticated"}); 
    }
        checklist.Id(req.params.checklistId)=req.body;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(checklist);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(checkAuth, (req, res, next) => {
    checklist.findByIdAndRemove(req.params.checklistId)
    .then((resp) => {
        if(role!='inspector'){
            res.sendStatus(403).json({message:"not authenticated"}); 
    }
    else{
        checklist.checklist.id(re.params.checklistId).remove();
        checklist.save();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }
}, (err) => next(err))
    .catch((err) => next(err));
});


checklistRouter.route('/:checklistId/checklistcategory')
.get(checkAuth, (req,res,next) => {
    checklist.findById(req.params.checklistId)
    .then((checklist) => {
        if (checklist!= null && role=='admin' || role=='inspector') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(checklist.checklistcategory);
        }
        else {
            err = new Error('checklist' + req.params.checklistId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(checkAuth, (req, res, next) => {
    checklist.findById(req.params.checklistId)
    .then((checklist) => {
        if (checklist != null  && role=='admin' || role=='inspector') {
            checklist.checklistcategory.push(req.body);
            checklist.save()
            .then((checklist) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(checklist);                
            }, (err) => next(err));
        }
        else {
            err = new Error('checklist' + req.params.checklistId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(checkAuth, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /checklist/'
        + req.params.checklistId + '/checklistcategory');
})
.delete(checkAuth, (req, res, next) => {
    checklist.findById(req.params.checklistId)
    .then((checklist) => {
        if (checklist != null  && role=='admin' || role=='inspector') {
            for (var i = (checklist.checklistcategory.length -1); i >= 0; i--) {
                checklist.checklistcategory.id(checklist.checklistcategory[i]._id).remove();
            }
            checklist.save()
            .then((checklist) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(checklist);                
            }, (err) => next(err));
        }
        else {
            err = new Error('checklist' + req.params.checklistId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

checklistRouter.route('/:checklistId/checklistcategory/:checklistcategoryId')
.get(checkAuth, (req,res,next) => {
    checklist.findById(req.params.checklistId)
    .then((checklist) => {
        if (checklist!= null && checklist.checklistcategory.id(req.params.checklistcategoryId) != null  && role=='admin' || role=='inspector') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(checklist.checklistcategory.id(req.params.checklistcategoryId));
        }
        else if (checklist== null) {
            err = new Error('checklist' + req.params.checklistId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('checklist-category' + req.params.checklistId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(checkAuth, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /checklist/'+ req.params.checklistId
        + '/checklistcategory/' + req.params.checklistcategoryId);
})
.put(checkAuth, (req, res, next) => {
    checklist.findById(req.params.checklistId)
    .then((checklist) => {
        if (checklist!= null && checklist.checklistcategory.id(req.params.checklistcategoryId) != null  && role=='admin' || role=='inspector') {
            if (req.body.title) {
                checklist.checklistcategory.id(req.params.checklistcategoryId).title; req.body.title;
            }
            
            checklist.save()
            .then((checklist) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(checklist);                
            }, (err) => next(err));
        }
        else if (checklist == null) {
            err = new Error('checklist ' + req.params.checklistId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('checklistcategory ' + req.params.checklistcategoryId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(checkAuth,(req, res, next) => {
    checklist.findById(req.params.checklistId)
    .then((checklist) => {
        if (checklist!= null && checklist.checklistcategory.id(req.params.checklistcategoryId) != null  && role=='admin' || role=='inspector') {
            checklist.checklistcategory.id(req.params.checklistcategoryId).remove();
            checklist.save()
            .then((checklist) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(checklist);                
            }, (err) => next(err));
        }
        else if (checklist == null) {
            err = new Error('checklist ' + req.params.checklistId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('checklistcategory' + req.params.checklistcategoryId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = checklistRouter;