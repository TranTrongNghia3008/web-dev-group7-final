const mongoose = require('mongoose');

const connectionParam = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

mongoose.connect('mongodb+srv://admin:3erkkrKTy2EJBjUl@webdev-21tn-group7.dmacvr7.mongodb.net/tms-v00?retryWrites=true&w=majority&appName=WebDev-21TN-Group7')
  .then(() => console.log('Connected!'));

  // const { db } = mongoose.connection;
  // const result = await db.collection('test').find().toArray();

const Schema = mongoose.Schema;

const accountSchema = new Schema({
  Email: String,
  Password: String,
  IsVerified: Boolean,
}, {
  collection: 'Account' // Tên collection trong database tms-v00
});

// Tạo model từ schema
const AccountModel = mongoose.model('Account', accountSchema);

// Lấy dữ liệu từ collection Account
AccountModel.find({})
  .then(data => {
    console.log("Data:", data);
  })
  .catch(err => {
    console.log("Error:", err);
  });