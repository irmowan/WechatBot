import {log, ScanStatus, WechatyBuilder} from "wechaty";
import {PuppetPadlocal} from "wechaty-puppet-padlocal";
import {QRCodeTerminal, EventLogger } from 'wechaty-plugin-contrib';
import {Config} from "./config"
import {ChatGPTBot} from "./chatgptBot"

// log.level("silly");

const wechatBot = WechatyBuilder.build({
  name: "WechatBot3",
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
        console.log(`onScan: ${ScanStatus[status]}(${status})`);
        console.log("\n==================================================================");
        console.log("\n* Two ways to sign on with qr code");
        console.log("\n1. Scan following QR code:\n");
        require('qrcode-terminal').generate(qrcode, {small: true})  // show qrcode on console

        const qrcodeImageUrl = [
          'https://wechaty.js.org/qrcode/',
          // 'https://api.qrserver.com/v1/create-qr-code/?data=',
          encodeURIComponent(qrcode),
        ].join('')
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