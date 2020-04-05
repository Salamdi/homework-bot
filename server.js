const app = require('express')();
const bp = require('body-parser');
const axios = require('axios');
require('dotenv').config();
const TELEGRAM_API_URL = `https://api.telegram.org/bot${ process.env.TELEGRAM_BOT_TOKEN }`;
const PORT = process.env.PORT || 3000;

let CHAT_ID;
let BOT_ID;

const getReady = async () => {

  // set webhooks
  const url = `${ process.env.TELEGRAM_WEBHOOK_URL }/${ process.env.TELEGRAM_BOT_TOKEN }`;
  await axios
    .post(`${ TELEGRAM_API_URL }/setWebhook`, {
      url,
    });

  // get self id
  const { data: { result: { id } } } = await axios
    .get(`${ TELEGRAM_API_URL }/getMe`);

  BOT_ID = id;
}

const run = async () => {
  await getReady();
  app.listen(PORT, () => console.log(`listening on port ${ PORT }`));
}

app.use(bp.json());
app.use(`/${process.env.TELEGRAM_BOT_TOKEN}`, async (req, res) => {
  try {
    const { body } = req;
    if (body.message.new_chat_participant && body.message.new_chat_participant.id === BOT_ID) {
      CHAT_ID = body.message.chat.id;
    }
    if (body.message.chat.type !== 'private') {
      res.status(200);
      res.send();
      return;
    }
    const { message: { text } } = body;
    const { data: { result: { pinned_message } } } = await axios.post(`${ TELEGRAM_API_URL }/getChat`, { chat_id: CHAT_ID });
    // remove today's homework
    const last2 = pinned_message.text.split('\n\n').slice(1).join('\n\n');

    // append new homework
    const textToPin = `${ last2 }\n\n${ text }`;
    const { data: { result: { message_id } } } = await axios.post(`${ TELEGRAM_API_URL }/sendMessage`, {
      chat_id: CHAT_ID,
      text: textToPin,
    });
    await axios.post(`${ TELEGRAM_API_URL }/pinChatMessage`, {
      chat_id: CHAT_ID,
      message_id,
    });
  } catch (err) {
    console.error(err.message);
    if (err.response && err.response.data) {
      console.error(err.response.data);
    }
    res
      .status(200)
      .json({
        method: 'sendMessage',
        chat_id: req.body.message.chat.id,
        text: err.message || 'error\nsomething went wrong...',
      });
  } finally {
    if (!res.headersSent) {
      res.status(200);
      res.send();
    }
  }
});

app.use('*', (req, res) => {
  res.status(404);
  res.send();
});

run();
