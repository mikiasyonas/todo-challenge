/* eslint-disable max-len */
const {eventBus} = require('../utils/eventBus');
const {sendMail} = require('../utils/email');

eventBus.on('user_regsistered', (user) => {
  const to = user.email;
  const subject = 'you have successfully registered to chat rand';
  const html = `<h4>Here is your confirmation code.</h4>
  </br>
  <h2>${ user.confirmationCode }</h2>`;
  sendMail(to, subject, html);
});

module.exports = {
  emailEvent: eventBus,
};
