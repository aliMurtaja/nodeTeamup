const path = require('path');
var express = require('express');
var router = express.Router();
var appRoot = require('app-root-path');
// var admin = require('../Model/Adminm');
var db = require('./../config');
// var async = require('asyncawait');
// var await = require('asyncawait');


//murtajaali10@gmail.com
//AIMS123 

router.get('/', (req, res, next)=>{
  res.render('layout/login',{ali: "this is ali"})
})


router.post('/login', (req, res)=>{
  res.setHeader("Content-Type", 'application/json');
  let password = req.body.password;
  let email = req.body.email;
  db.db.MyAppModel.connection.connect((err)=>{ 
    if(err)throw err
    db.db.MyAppModel.query(`SELECT * FROM t_user where USER_LOGINNAME = '${email}' and USER_PASSWORD = '${password}' `
    )
    .then((result)=>{
      // console.log(result[0].USER_KID)
      // console.log(result[0])
      if(result[0] !== undefined){
        // console.log("not defiend")
        res.status(200)
        res.send(result);
        res.end()
      }else{
        res.status(404)
          res.send({
            message: 'invalid credentials'
          })
      }
      res.end()
    })
    .catch((error)=>{
        console.log(error);
        res.status.json({
          error
        })
      })
  })
  // console.log(db.db.MyAppModel.connection.connect)
  // console.log(db.db.MyAppModel.query)
  // console.log("ali")
})


// function fun(a){


// }

// to give the all productsxxx
router.get('/kjk', function(req, res, next) {
    // res.render('index', { title: 'Express' });
    // admin.Admin.find('all', function(err, rows, fields) {
    //   console.log(rows)
    // });
    // res.sendFile(path.join(appRoot.path, 'data', 'product.json'))
    // console.log(res.sendFile(path.join(__dirname, 'data', 'product.json')))
    // console.log(appRoot.path)
    // res.end()

    db.qb.select(['t_menu.MENU_KID','t_menu.MENU_NAME','t_menu.MENU_CODE','t_menu.SEQ'])
        .order_by('t_menu.SEQ')
        // .where({type: 'rocky', 'diameter <': 12000})
        .get('t_menu', (err, response) => {
          // db.qb.disconnect();
    
            if (err) return console.error("Uh oh! Couldn't get results: " + err.msg);
    
            // SELECT `name`, `position` FROM `planets` WHERE `type` = 'rocky' AND `diameter` < 12000
            console.log("Query Ran: " + db.qb.last_query());

            let data =[];
            data['menu'] = response;

            let lenth = data['menu'].length;

            data['menu'].map(  (men)=>{

                db.qb.select(['t_submenu.SUBMENU_KID','t_submenu.SUBMENU_NAME','t_submenu.SUBMENU_URL'])
                .order_by('t_submenu.SEQ')
                .where({SUBMENU_MENUID: men.MENU_KID})
                .get('t_submenu', (err, response) => {
                  men.sub = response
                  lenth--;
                  // console.log(lenth)
                  if(lenth <= 0){  
                    res.status(200).json({
                      count: response.length,
                      menuSub: data['menu'],            
                      
                    })
                    res.end()
                  console.log('one')
                  }
                  // console.log(res)
                  
                })
                
            })
         
          }
      );
  });
  
  module.exports = router;
