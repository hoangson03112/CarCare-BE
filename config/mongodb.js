const mongoose = require('mongoose')

async function connect() {
  try {
    await mongoose.connect('mongodb://localhost:27017/Exe');
    console.log('Successaka')
  } catch (error) {
    console.log('Fail')
  }
}
 module.exports = {connect}