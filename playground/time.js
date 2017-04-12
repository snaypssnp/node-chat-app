const moment = require('moment');

// const date = moment();
// date.add(100, 'years').subtract(9, 'months');
// console.log(date.format('MMM Do, YYYY'));


new Date().getTime();
const someTimeStamp = moment().valueOf();
console.log(someTimeStamp);

const createdAt = 1234;
const date = moment(createdAt);
console.log(date.format('h:mm a'));

