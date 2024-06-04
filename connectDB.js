const mongoose = require('mongoose');

const connectionParam = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

mongoose.connect('mongodb+srv://admin:3erkkrKTy2EJBjUl@webdev-21tn-group7.dmacvr7.mongodb.net/?retryWrites=true&w=majority&appName=WebDev-21TN-Group7')
  .then(() => console.log('Connected!'));

  // const { db } = mongoose.connection;
  // const result = await db.collection('test').find().toArray();

const Schema = mongoose.Schema;

const account = new Schema({
  Email: String,
  Password: String,
  IsVerified: Boolean,
}
, {
  collection: 'tms-v00'
}
);

const AccountModel = mongoose.model('Account', account);

AccountModel.find({})
.then(function(data) {
  console.log("data", data)
})
.catch(function(err){
  console.log(err)
})