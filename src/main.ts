import {log, ScanStatus, WechatyBuilder} from "wechaty";
import {PuppetPadlocal} from "wechaty-puppet-padlocal";
import {QRCodeTerminal, EventLogger } from 'wechaty-plugin-contrib';
import {Config} from "./config"
import {ChatGPTBot} from "./chatgptBot"

// log.level("silly");

const wechatBot = WechatyBuilder.build({
  name: "WechatBot",
  puppet: new PuppetPadlocal({
    token: Config.padlocalToken
  }),
})
const chatGPTBot = new ChatGPTBot();

async function main() {
  // wechatBot.use(QRCodeTerminal({ small: false }))
  wechatBot.use(EventLogger())
  wechatBot
    .on("scan", (qrcode, status) => {
      if (status === ScanStatus.Waiting && qrcode) {
        const qrcodeImageUrl = [
          'https://wechaty.js.org/qrcode/',
          // 'https://api.qrserver.com/v1/create-qr-code/?data=',
          encodeURIComponent(qrcode),
        ].join('')

        console.log(`onScan: ${ScanStatus[status]}(${status})`);

        console.log("\n==================================================================");
        console.log("\n* Two ways to sign on with qr code");
        console.log("\n1. Scan following QR code:\n");

        require('qrcode-terminal').generate(qrcode, {small: true})  // show qrcode on console

        console.log(`\n2. Or open the link in your browser: ${qrcodeImageUrl}`);
        console.log("\n==================================================================\n");
      } else {
        console.log(`onScan: ${ScanStatus[status]}(${status})`);
      }
    })
    // login to WeChat desktop account
    .on("login", async (user: any) => {
      console.log(`✅ User ${user} has logged in`);
      // chatGPTBot.setBotName(user.name());
      await chatGPTBot.startGPTBot();
    })
    // message handler
    .on("message", async (message: any) => {
      try {
        console.log(`📨 ${message}`);
        // handle message for customized task handlers
        await chatGPTBot.onCustimzedTask(message);

        // handle message for chatGPT bot
        await chatGPTBot.onMessage(message);
      } catch (e) {
        console.error(`❌ ${e}`);
      }
    });

  try {
    await wechatBot.start();
  } catch (e) {
    console.error(`❌ Your Bot failed to start: ${e}`);
    console.log(
      "🤔 Can you login WeChat in browser? The bot works on the desktop WeChat"
    );
  }
}
main();

/*
const bot = 
  .on("scan", (qrcode, status) => {
    if (status === ScanStatus.Waiting && qrcode) {
      const qrcodeImageUrl = [
        // 'https://wechaty.js.org/qrcode/',
        'https://api.qrserver.com/v1/create-qr-code/?data=',
        encodeURIComponent(qrcode),
      ].join('')

      log.info(LOGPRE, `onScan: ${ScanStatus[status]}(${status})`);

      console.log("\n==================================================================");
      console.log("\n* Two ways to sign on with qr code");
      console.log("\n1. Scan following QR code:\n");

      require('qrcode-terminal').generate(qrcode, {small: true})  // show qrcode on console

      console.log(`\n2. Or open the link in your browser: ${qrcodeImageUrl}`);
      console.log("\n==================================================================\n");
    } else {
      log.info(LOGPRE, `onScan: ${ScanStatus[status]}(${status})`);
    }
  })

  .on("login", (user) => {
    log.info(LOGPRE, `${user} login`);
  })

  .on("logout", (user, reason) => {
    log.info(LOGPRE, `${user} logout, reason: ${reason}`);
  })

  .on("message", async (message) => {
    log.info(LOGPRE, `on message: ${message.toString()}`);

    await getMessagePayload(message);

    // await dingDongBot(message);
    await chatBot(message);
  })

  .on("room-invite", async (roomInvitation) => {
    log.info(LOGPRE, `on room-invite: ${roomInvitation}`);
  })

  .on("room-join", (room, inviteeList, inviter, date) => {
    log.info(LOGPRE, `on room-join, room:${room}, inviteeList:${inviteeList}, inviter:${inviter}, date:${date}`);
  })

  .on("room-leave", (room, leaverList, remover, date) => {
    log.info(LOGPRE, `on room-leave, room:${room}, leaverList:${leaverList}, remover:${remover}, date:${date}`);
  })

  .on("room-topic", (room, newTopic, oldTopic, changer, date) => {
    log.info(LOGPRE, `on room-topic, room:${room}, newTopic:${newTopic}, oldTopic:${oldTopic}, changer:${changer}, date:${date}`);
  })

  .on("friendship", (friendship) => {
    log.info(LOGPRE, `on friendship: ${friendship}`);
  })

  .on("error", (error) => {
    log.error(LOGPRE, `on error: ${error}`);
  })

bot.start().then(() => {
  log.info(LOGPRE, "started.");
});
*/