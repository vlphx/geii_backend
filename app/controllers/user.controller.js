const db = require("../models");
const { user, user_role, matiere, role, classe, offres } = db.initModels;
// const user = db.userModel;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a user
  const userObject = {
    user_pwd: req.body.user_pwd,
    user_name: req.body.user_name,
    user_firstname: req.body.user_firstname,
    user_company_name: req.body.user_company_name,
    user_tel: req.body.user_tel,
    user_mail: req.body.user_mail,
    user_address:req.body.user_address,
    user_siret: req.body.user_siret,
    account_validity: req.body.account_validity

  };

  // Save user in the database
  user.create(userObject)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the user.",
      });
    });
};

exports.findAll = (req, res) => {
  user.findAll({

  })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};


exports.findOne = (req, res) => {
  const id = req.params.id;

  user.findByPk(id, { 

  } )
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving user with id=" + id,
      });
    });
};

exports.findByEmail = (req, res) => {
  const mail = req.params.email;
  const pwd = req.params.pwd;
  console.log(typeof user_mail)

  user.findOne( { 
    attributes : ['user_id','user_firstname','user_tel', 'user_name','user_mail'],
    where: { user_mail: mail, user_pwd:pwd},

  } )
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving user with email=" + user_mail,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  user.update(req.body, {
    where: {id: id},

  })
    .then(() => {
      res.status(200).send({ message: "user was updated successfully", });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving user with id=" + id,
      });
    });
};


// Delete a user with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  user.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).send({
          message: "user was deleted successfully!",
        });
      } else {
        res.status(400).send({
          message: `Cannot delete user with id=${id}. Maybe user was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not user user with id=" + id,
      });
    });
};


exports.findUserRoleByUserId = (req, res) => {
  const userId = req.params.userId;


  user.findByPk(userId, { 
        include: [
      {
        
        model: user_role,
        as: 'user_roles',
        where: { user_id: userId }
      }
    ]
  } )
    .then((data) => {
      role.findByPk(data.dataValues.user_roles[0].dataValues.role_id).then((data2) => {res.status(200).send(data2);}).catch((err2) => {res.status(200).send(data);console.log(err2)})
      
    })
    .catch((err) => {
      res.status(500).send(false);
    });
};