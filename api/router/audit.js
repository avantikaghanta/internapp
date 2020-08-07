const express = require('express');
const bodyparser = require('body-parser');
const mongoose= require('mongoose');
const checkAuth = require("../middleware/check-auth");
const audit = require("../models/audit");
const auditee = require("../models/auditee");
const team = require("../models/team");
const checklistcategore= require("../models/checklistcategory");

const auditRouter = express.Router();

auditRouter.use (bodyparser.json());

auditRouter.route('/')
.get(checkAuth, (req,res,next) => {
    audit.find({})
    .then((audit) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(audit);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( checkAuth,(req, res, next) => {
    audit.create(req.body)
    .then((audit) => {
        console.log('audit Created ', audit)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(audit);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(checkAuth, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /audit');
})
.delete(checkAuth, (req, res, next) => {
    audit.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

auditRouter.route('/:auditId')
.get(checkAuth, (req,res,next) => {
    audit.findById(req.params.auditId)
    .then((audit) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(audit);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(checkAuth, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /audit/'+ req.params.auditId);
})
.put(checkAuth, (req, res, next) => {
    audit.findByIdAndUpdate(req.params.auditId, {
        $set: req.body
    }, { new: true })
    .then((audit) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(audit);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(checkAuth, (req, res, next) => {
    audit.findByIdAndRemove(req.params.auditId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

auditRouter.route('/:auditId/team')
.get(checkAuth, (req,res,next) => {
    audit.findById(req.params.auditId)
    .then((audit) => {
        if (audit!= null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(audit);
        }
        else {
            err = new Error('audit' + req.params.auditId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(checkAuth, (req, res, next) => {
    audit.findById(req.params.auditId)
    .then((audit) => {
        if (audit != null) {
            audit.team.push(req.body);
            audit.save()
            .then((audit) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(audit);                
            }, (err) => next(err));
        }
        else {
            err = new Error('audit' + req.params.auditId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(checkAuth, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /audit/'
        + req.params.auditId + '/team');
})
.delete(checkAuth, (req, res, next) => {
    audit.findById(req.params.auditId)
    .then((audit) => {
        if (audit!= null) {
            for (var i = (audit.team.length -1); i >= 0; i--) {
                audit.team.id(audit.team[i]._id).remove();
            }
            audit.save()
            .then((audit) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(audit);                
            }, (err) => next(err));
        }
        else {
            err = new Error('audit' + req.params.auditId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

auditRouter.route('/:auditId/team/:teamId')
.get(checkAuth, (req,res,next) => {
    audit.findById(req.params.auditId)
    .then((audit) => {
        if (audit!= null && audit.team.id(req.params.teamId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(audit.team.id(req.params.teamId));
        }
        else if (audit== null) {
            err = new Error('audit' + req.params.auditId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('team' + req.params.auditId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(checkAuth, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /audit/'+ req.params.auditId
        + '/team/' + req.params.teamId);
})
.put(checkAuth, (req, res, next) => {
    audit.findById(req.params.auditId)
    .then((audit) => {
        if (audit!= null && audit.team.id(req.params.teamId) != null) {
            if (req.body.title) {
                audit.team.id(req.params.teamId).name = req.body.name;
            }
            
            audit.save()
            .then((audit) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(audit);                
            }, (err) => next(err));
        }
        else if (audit == null) {
            err = new Error('audit' + req.params.auditId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('team' + req.params.teamId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(checkAuth, (req, res, next) => {
    audit.findById(req.params.auditId)
    .then((audit) => {
        if (audit!= null && audit.team.id(req.params.teamId) != null) {
            audit.team.id(req.params.teamId).remove();
            audit.save()
            .then((audit) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(audit);                
            }, (err) => next(err));
        }
        else if (audit == null) {
            err = new Error('audit' + req.params.auditId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('team' + req.params.teamId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});



auditRouter.route('/:auditId/checklistCategory')
.get(checkAuth, (req,res,next) => {
    audit.findById(req.params.auditId)
    .then((audit) => {
        if (audit!= null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(audit);
        }
        else {
            err = new Error('audit' + req.params.auditId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(checkAuth, (req, res, next) => {
    audit.findById(req.params.auditId)
    .then((audit) => {
        if (audit != null) {
            audit.checklistcategory.push(req.body);
            audit.save()
            .then((audit) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(audit);                
            }, (err) => next(err));
        }
        else {
            err = new Error('audit' + req.params.auditId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(checkAuth, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /audit/'
        + req.params.auditId + '/checklistcategory');
})
.delete(checkAuth, (req, res, next) => {
    audit.findById(req.params.auditId)
    .then((audit) => {
        if (audit!= null) {
            for (var i = (audit.checklistcategory.length -1); i >= 0; i--) {
                audit.checklistcategory.id(audit.checklistcategory[i]._id).remove();
            }
            audit.save()
            .then((audit) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(audit);                
            }, (err) => next(err));
        }
        else {
            err = new Error('audit' + req.params.auditId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

auditRouter.route('/:auditId/checklistcategory/:checklistcategoryId')
.get(checkAuth, (req,res,next) => {
    audit.findById(req.params.auditId)
    .then((audit) => {
        if (audit!= null && audit.checklistcategory.id(req.params.checklistCategoryId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(audit.checklistcategory.id(req.params.checklistcategoryId));
        }
        else if (audit== null) {
            err = new Error('audit' + req.params.auditId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('checklistcategory' + req.params.auditId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(checkAuth, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /audit/'+ req.params.auditId
        + '/checklist-category/' + req.params.checklistcategoryId);
})
.put(checkAuth, (req, res, next) => {
    audit.findById(req.params.auditId)
    .then((audit) => {
        if (audit!= null && audit.checklistcategory.id(req.params.checklistcategoryId) != null) {
            if (req.body.title) {
                audit.checklistcategory.id(req.params.checklistcategoryId).title=req.body.title;
            }
            
            audit.save()
            .then((audit) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(audit);                
            }, (err) => next(err));
        }
        else if (audit == null) {
            err = new Error('audit' + req.params.auditId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('checklist-categorym' + req.params.checklistcategoryId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(checkAuth, (req, res, next) => {
    audit.findById(req.params.auditId)
    .then((audit) => {
        if (audit!= null && audit.checklistcategory.id(req.params.checklistcategoryId) != null) {
            audit.checklistcategory.id(req.params.checklistcategoryId).remove();
            audit.save()
            .then((audit) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(audit);                
            }, (err) => next(err));
        }
        else if (audit == null) {
            err = new Error('audit' + req.params.auditId + ' not found');
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






auditRouter.route('/:auditId/auditee')
.get(checkAuth, (req,res,next) => {
    audit.findById(req.params.auditId)
    .then((audit) => {
        if (audit!= null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(audit);
        }
        else {
            err = new Error('audit' + req.params.auditId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(checkAuth, (req, res, next) => {
    audit.findById(req.params.auditId)
    .then((audit) => {
        if (audit != null) {
            audit.auditee.push(req.body);
            audit.save()
            .then((audit) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(audit);                
            }, (err) => next(err));
        }
        else {
            err = new Error('audit' + req.params.auditId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(checkAuth, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /audit/'
        + req.params.auditId + '/auditee');
})
.delete(checkAuth, (req, res, next) => {
    audit.findById(req.params.auditId)
    .then((audit) => {
        if (audit!= null) {
            for (var i = (audit.auditee.length -1); i >= 0; i--) {
                audit.auditee.id(audit.auditee[i]._id).remove();
            }
            audit.save()
            .then((audit) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(audit);                
            }, (err) => next(err));
        }
        else {
            err = new Error('audit' + req.params.auditId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

auditRouter.route('/:auditId/auditee/:auditeeId')
.get(checkAuth, (req,res,next) => {
    audit.findById(req.params.auditId)
    .then((audit) => {
        if (audit!= null && audit.auditee.id(req.params.auditeeId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(audit.auditee.id(req.params.auditeeId));
        }
        else if (audit== null) {
            err = new Error('audit' + req.params.auditId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('auditee' + req.params.auditId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(checkAuth, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /audit/'+ req.params.auditId
        + '/auditee/' + req.params.auditeeId);
})
.put(checkAuth, (req, res, next) => {
    audit.findById(req.params.auditId)
    .then((audit) => {
        if (audit!= null && audit.auditee.id(req.params.auditeeId) != null) {
            if (req.body.title) {
                audit.auditee.id(req.params.auditeeId).title= req.body.title;
            }
            
            audit.save()
            .then((audit) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(audit);                
            }, (err) => next(err));
        }
        else if (audit == null) {
            err = new Error('audit' + req.params.auditId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('auditee' + req.params.auditeeId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(checkAuth, (req, res, next) => {
    audit.findById(req.params.auditId)
    .then((audit) => {
        if (audit!= null && audit.cauditee.id(req.params.auditeeId) != null) {
            audit.auditee.id(req.params.auditeeId).remove();
            audit.save()
            .then((audit) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(audit);                
            }, (err) => next(err));
        }
        else if (audit == null) {
            err = new Error('audit' + req.params.auditId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('auditee' + req.params.auditeeId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});





module.exports = auditRouter;