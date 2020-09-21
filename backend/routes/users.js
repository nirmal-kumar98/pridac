const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');

// Models
const Users = require('../models/users');
const checkAuth = require('../middleware/check-auth');


const singleStorage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, 'backend/profile_pic')
  },
  filename: (req, file, callBack) => {
      callBack(null, `profile_pic_${ file.originalname }`)
  }
})

var upload = multer({ storage: singleStorage});


router.post('/signup', (req, res, next) => {

    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const users = new Users({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            position: req.body.position,
            user_type: req.body.user_type,
            email_id: req.body.email_id,
            phone_number: req.body.phone_number,
            created_date: req.body.created_date,
            password: hash
        });
        users.save()
        .then(result => {

            const token = jwt.sign({
                mailId: result.email_id,
                userId: result._id},
                'diaMond^B__ABuk?09(-_-)',
                {expiresIn: '30m'}
            );

            const url = `http://localhost:4200/confirmation/${token}`

            var transporter = nodemailer.createTransport({
                service: 'aol',
                auth: {
                  user: 'harivignesh260998',
                  pass: 'kdhugqzrdkgdzmaa'
                }
            });

            var mailOptions = {
                from: 'harivignesh260998@aol.com',
                to: `manikandanb975121@gmail.com`,
                subject: 'Email Confirmation',
                html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
                 <head> 
                  <meta charset="UTF-8"> 
                  <meta content="width=device-width, initial-scale=1" name="viewport"> 
                  <meta name="x-apple-disable-message-reformatting"> 
                  <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
                  <meta content="telephone=no" name="format-detection"> 
                  <title>New email template 2020-07-23</title> 
                  <!--[if (mso 16)]>
                    <style type="text/css">
                    a {text-decoration: none;}
                    </style>
                    <![endif]--> 
                  <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> 
                  <!--[if gte mso 9]>
                <xml>
                    <o:OfficeDocumentSettings>
                    <o:AllowPNG></o:AllowPNG>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                    </o:OfficeDocumentSettings>
                </xml>
                <![endif]--> 
                  <!--[if !mso]><!-- --> 
                  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i" rel="stylesheet"> 
                  <!--<![endif]--> 
                  <style type="text/css">
                @media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:30px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button { font-size:20px!important; display:inline-block!important; border-width:6px 25px 6px 25px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
                #outlook a {
                    padding:0;
                }
                .ExternalClass {
                    width:100%;
                }
                .ExternalClass,
                .ExternalClass p,
                .ExternalClass span,
                .ExternalClass font,
                .ExternalClass td,
                .ExternalClass div {
                    line-height:100%;
                }
                .es-button {
                    mso-style-priority:100!important;
                    text-decoration:none!important;
                }
                a[x-apple-data-detectors] {
                    color:inherit!important;
                    text-decoration:none!important;
                    font-size:inherit!important;
                    font-family:inherit!important;
                    font-weight:inherit!important;
                    line-height:inherit!important;
                }
                .es-desk-hidden {
                    display:none;
                    float:left;
                    overflow:hidden;
                    width:0;
                    max-height:0;
                    line-height:0;
                    mso-hide:all;
                }
                </style> 
                 </head> 
                 <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"> 
                  <div class="es-wrapper-color" style="background-color:#FFFFFF"> 
                   <!--[if gte mso 9]>
                            <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                                <v:fill type="tile" color="#ffffff"></v:fill>
                            </v:background>
                        <![endif]--> 
                   <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top"> 
                     <tr style="border-collapse:collapse"> 
                      <td valign="top" style="padding:0;Margin:0"> 
                       <table class="es-content" align="center" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
                         <tr style="border-collapse:collapse"> 
                          <td align="center" bgcolor="#f7f7f7" style="padding:0;Margin:0;background-color:#F7F7F7"> 
                           <table class="es-content-body" align="center" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"> 
                             <tr style="border-collapse:collapse"> 
                              <td align="left" bgcolor="#f7f7f7" style="padding:0;Margin:0;padding-top:20px;background-color:#F7F7F7"> 
                               <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                 <tr style="border-collapse:collapse"> 
                                  <td align="center" valign="top" style="padding:0;Margin:0;width:600px"> 
                                   <table width="100%" cellspacing="0" cellpadding="0" background="https://images.theconversation.com/files/312387/original/file-20200129-92992-aoyptf.jpg?ixlib=rb-1.1.0&amp;q=45&amp;auto=format&amp;w=1200&amp;h=1200.0&amp;fit=crop" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-image:url(https://images.theconversation.com/files/312387/original/file-20200129-92992-aoyptf.jpg?ixlib=rb-1.1.0&amp;q=45&amp;auto=format&amp;w=1200&amp;h=1200.0&amp;fit=crop);background-repeat:no-repeat;background-position:left top" role="presentation"> 
                                     <tr style="border-collapse:collapse"> 
                                      <td align="center" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://images.theconversation.com/files/312387/original/file-20200129-92992-aoyptf.jpg?ixlib=rb-1.1.0&amp;rect=43%2C0%2C4896%2C3261&amp;q=45&amp;auto=format&amp;w=496&amp;fit=clip" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="596"></td> 
                                     </tr> 
                                   </table></td> 
                                 </tr> 
                               </table></td> 
                             </tr> 
                           </table></td> 
                         </tr> 
                       </table> 
                       <table class="es-content" align="center" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
                         <tr style="border-collapse:collapse"> 
                          <td align="center" bgcolor="#f7f7f7" style="padding:0;Margin:0;background-color:#F7F7F7"> 
                           <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;border-top:1px solid transparent;border-right:1px solid transparent;border-left:1px solid transparent;width:600px;border-bottom:1px solid transparent" align="center" cellspacing="0" cellpadding="0" bgcolor="#ffffff"> 
                             <tr style="border-collapse:collapse"> 
                              <td align="left" style="Margin:0;padding-top:20px;padding-bottom:40px;padding-left:40px;padding-right:40px"> 
                               <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                 <tr style="border-collapse:collapse"> 
                                  <td align="left" style="padding:0;Margin:0;width:518px"> 
                                   <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                     <tr style="border-collapse:collapse"> 
                                      <td class="es-m-txt-c" align="center" style="padding:0;Margin:0"><h2 style="Margin:0;line-height:34px;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-size:28px;font-style:normal;font-weight:normal;color:#474745">Hey, ${req.body.firstName}!</h2></td> 
                                     </tr> 
                                     <tr style="border-collapse:collapse"> 
                                      <td class="es-m-txt-c" align="center" style="padding:0;Margin:0;padding-top:15px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:19px;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:29px;color:#474745">You're almost done with registering on PROJECT KAVI.<br>By clicking on the following button, you are confirming your email address.</p></td> 
                                     </tr> 
                                     <tr style="border-collapse:collapse"> 
                                      <td align="center" style="Margin:0;padding-left:10px;padding-right:10px;padding-bottom:15px;padding-top:20px"><span class="es-button-border" style="border-style:solid;border-color:#474745;background:#474745;border-width:0px;display:inline-block;border-radius:20px;width:auto"><a href=${url} class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-size:16px;color:#EFEFEF;border-style:solid;border-color:#474745;border-width:6px 25px 6px 25px;display:inline-block;background:#474745;border-radius:20px;font-weight:normal;font-style:normal;line-height:19px;width:auto;text-align:center">Confirm Email</a></span></td> 
                                     </tr> 
                                     <tr style="border-collapse:collapse"> 
                                      <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#474745">We wish you all the very best for your placements.<br>Happy learning...!</p></td> 
                                     </tr> 
                                   </table></td> 
                                 </tr> 
                               </table></td> 
                             </tr> 
                           </table></td> 
                         </tr> 
                       </table> 
                       <table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"> 
                         <tr style="border-collapse:collapse"> 
                          <td style="padding:0;Margin:0;background-color:#F7F7F7" bgcolor="#f7f7f7" align="center"> 
                           <table class="es-footer-body" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#F7F7F7;width:600px"> 
                             <tr style="border-collapse:collapse"> 
                              <td align="left" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px"> 
                               <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                 <tr style="border-collapse:collapse"> 
                                  <td valign="top" align="center" style="padding:0;Margin:0;width:560px"> 
                                   <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                     <tr style="border-collapse:collapse"> 
                                      <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#474745">You are receiving this email because you have registered on PROJECT KAVI. If it wasn't you, please drop a mail at mithunsolomon@gmail.com</p></td> 
                                     </tr> 
                                   </table></td> 
                                 </tr> 
                               </table></td> 
                             </tr> 
                           </table></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table> 
                  </div> 
                  <div style="position:absolute;left:-9999px;top:-9999px;margin:0px"></div>  
                 </body>
                </html>`
              };

              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent successfully '+ url);
                  res.status(201).json({
                    message: 'User Created',
                    result: result
                });
                }
              });

            // res.status(201).json({
            //     message: 'User Created',
            //     result: result
            // });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
    });

});

router.post('/login', (req, res, next) => {
    let fetchUser;
    console.log(req.body);
    Users.findOne({ email_id: req.body.email_id})
        .then(user => {
            console.log(user);
            if (!user) {
                return res.status(401).json({
                    message: 'Auth Failed !'
                });
            }
            fetchUser = user;
            // console.log(bcrypt.compare(req.body.password, user.password));
            return bcrypt.compare(req.body.password, user.password)
        })
        .then((result) => {
            if (!result) {
                return res.status(401).json({
                    message
                });
            }
            const token = jwt.sign(
                { email_id: fetchUser.email_id, userId: fetchUser._id},
                'secret_this_should_be_longer',
                { expiresIn: '1h'}
            );
            if (fetchUser.verified === true) {
                res.status(200).json({
                    token: token,
                    expiresIn: 3600,
                    userId: fetchUser._id
                });
            } else if (fetchUser.verified === false) {
                res.status(200).json({
                    message: 'Verify Email'
                });
            }
            
        })
        .catch(err => {
            return res.status(401).json({
                message: 'Auth Failed !'
            });
        });
});


router.post('/confirmation', (req, res, next) => {
    console.log(req.body)
    const decodedToken = jwt.verify(req.body.token , 'diaMond^B__ABuk?09(-_-)');
    userData = { email: decodedToken.email_id, userId: decodedToken.userId }
    console.log(userData);
    // College.findById(userData.userId).then((user) => {

    // });

    Users.updateOne({ _id: userData.userId},
        { $set: {'verified': true}}).then(user => {
            // const testScore = new TestScore({
            //     studentId: userData.userId
            // })
            // testScore.save().then(test => {
            //     res.status(201).json({
            //         message: 'testScore Created',
            //         test: test
            //     })
            // })
            res.status(201).json({
                message: 'Email Verifited Successfully',
                result: user
            })
            // res.status(201).json({
            //     message: 'Confirmated',
            //     student: student
            // })
    });
    
});


router.get('', checkAuth, (req, res, next) => {

    Users.findById(req.userData.userId).then(user => {
        res.status(201)
            .json({
                message: 'User Fetched Successfully',
                result: user
            });
    });
});


router.post('/update', checkAuth, upload.single('profile_pic'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');

  Users.updateMany({_id: req.userData.userId},
    {
      $set: {
        'first_name': req.body.first_name,
        'last_name': req.body.last_name,
        'phone_number': req.body.phone_number,
        'profile_pic': `${url}/profile_pic/${req.file.filename}`,
        'position': req.body.position,
        'updated_date': req.body.updated_date
      }
    })
    .then(user => {
      res.status(200).json({
        message: 'Updated Successfully',
        result: user
      })
    })

});

module.exports = router;