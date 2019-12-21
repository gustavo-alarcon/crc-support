const functions = require('firebase-functions');
const admin = require('firebase-admin');
// const gcs = require('@google-cloud/storage')();
// const os = require('os');
// const path = require('path');
const cors = require('cors')({ origin: true });
// const nodemailer = require('nodemailer');
// const Busboy = require('busboy');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
let app = admin.initializeApp();

exports.msCreateUser = functions.https.onRequest((req, res) => {

    cors(req, res, () => {
        var params = req.query;

        app.auth().createUser({
            email: params['email'],
            emailVerified: false,
            password: params['password'],
            displayName: params['displayName'],
            disabled: false
        })
            .then(userRecord => {
                console.log("Successfully created new user:", userRecord.uid);
                res.send({
                    result: "OK",
                    uid: userRecord.uid
                })
                return true;
            })
            .catch(error => {
                console.log("Error creating new user:", error);
                res.send({
                    result: "ERROR",
                    code: error['errorInfo']['code']
                })
                return false;
            });
    })

});

exports.msDeleteUser = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        var params = req.query;

        admin.auth().deleteUser(params['uid'])
            .then(() => {
                console.log('Successfully deleted user');
                res.send({
                    result: "OK"
                })
                return true;
            })
            .catch(error => {
                console.log('Error deleting user:', error);
                res.send({
                    result: "ERROR",
                    code: error['errorInfo']['code']
                })
                console.log("Error updating user:", error);
                return false;
            });
    })
})

exports.msUpdatePassword = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        var params = req.query;

        app.auth().updateUser(params['uid'], {
            password: params['password']
        })
            .then(userRecord => {
                console.log("Successfully updated user");
                res.send({
                    result: "OK"
                })
                return true;
            })
            .catch(error => {
                res.send({
                    result: "ERROR",
                    code: error['errorInfo']['code']
                })
                console.log("Error updating user:", error);
                return false;
            })
    })
})