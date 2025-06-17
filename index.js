import { keepAlive } from "./keepAlive.js";
import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  Events,
  EmbedBuilder,
} from "discord.js";
import "dotenv/config";
import pkg from "./package.json" with { type: "json" };

keepAlive();

// ✅ QWERTY -> แป้นพิมพ์ไทย
const engToThaiMap = {
  1: "ๅ",
  2: "/",
  3: "-",
  4: "ภ",
  5: "ถ",
  6: "ุ",
  7: "ึ",
  8: "ค",
  9: "ต",
  0: "จ",
  "-": "ข",
  "=": "ช",
  "@": "๑",
  "#": "๒",
  $: "๓",
  "%": "๔",
  "^": "ู",
  "&": "฿",
  "*": "๕",
  "(": "๖",
  ")": "๗",
  _: "๘",
  "+": "๙",
  q: "ๆ",
  w: "ไ",
  e: "ำ",
  r: "พ",
  t: "ะ",
  y: "ั",
  u: "ี",
  i: "ร",
  o: "น",
  p: "ย",
  "[": "บ",
  "]": "ล",
  a: "ฟ",
  s: "ห",
  d: "ก",
  f: "ด",
  g: "เ",
  h: "้",
  j: "่",
  k: "า",
  l: "ส",
  ";": "ว",
  "'": "ง",
  z: "ผ",
  x: "ป",
  c: "แ",
  v: "อ",
  b: "ิ",
  n: "ื",
  m: "ท",
  ",": "ม",
  ".": "ใ",
  "/": "ฝ",
  Q: "๐",
  E: "ฎ",
  R: "ฑ",
  T: "ธ",
  Y: "ํ",
  U: "๊",
  I: "ณ",
  O: "ฯ",
  P: "ญ",
  "{": "ฐ",
  A: "ฤ",
  S: "ฆ",
  D: "ฏ",
  F: "โ",
  G: "ฌ",
  H: "็",
  J: "๋",
  K: "ษ",
  L: "ศ",
  ":": "ซ",
  C: "ฉ",
  V: "ฮ",
  B: "ฺ",
  N: "์",
  "<": "ฒ",
  ">": "ฬ",
  "?": "ฦ",
};

function convertEngToThai(input) {
  return input
    .split("")
    .map((char) => engToThaiMap[char] || char)
    .join("");
}

// ✅ ลงทะเบียนคำสั่ง
const translateCommand = new SlashCommandBuilder()
  .setName("translate")
  .setDescription("แปลข้อความที่พิมพ์ผิดจากภาษาอังกฤษเป็นภาษาไทย")
  .addStringOption((option) =>
    option
      .setName("ข้อความ")
      .setDescription("ข้อความที่ต้องการแปลง")
      .setRequired(true),
  );

const helpCommand = new SlashCommandBuilder()
  .setName("help")
  .setDescription("แสดงรายการคำสั่งของบอท");

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

console.log("⏳ เริ่มลงทะเบียนคำสั่ง...");
await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
  body: [translateCommand.toJSON(), helpCommand.toJSON()],
});
console.log("✅ ลงทะเบียนคำสั่งเสร็จเรียบร้อย");

// ✅ เริ่มบอท
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`✅ เข้าสู่ระบบด้วย ${client.user.tag}`);

  let statusIndex = 0;
  const statuses = ["/translate", "vjkow,jvvd5k,z,wfh", "พร้อมแปลให้เสมอ"];

  setInterval(() => {
    const status = statuses[statusIndex];
    client.user.setPresence({
      activities: [{ name: `${status} | V${pkg.version}`, type: 4 }],
      status: "online",
    });
    statusIndex = (statusIndex + 1) % statuses.length;
  }, 870000);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "translate") {
    const inputText = interaction.options.getString("ข้อความ");

    if (!inputText) {
      await interaction.reply({
        content: "❌ กรุณาใส่ข้อความที่ต้องการแปล",
        ephemeral: true,
      });
      return;
    }

    const translated = convertEngToThai(inputText);

    await interaction.reply({
      content: `✅ ข้อความแปลเป็นไทย:\n\`\`\`\n${translated}\n\`\`\``,
    });
  } else if (interaction.commandName === "help") {
    const embed = new EmbedBuilder()
      .setTitle("คำสั่งของ ThaiTypoBot")
      .setColor("#00AAFF")
      .setDescription("ตัวอย่างคำสั่งและวิธีใช้บอท")
      .addFields(
        {
          name: "/translate <ข้อความ>",
          value: "แปลข้อความพิมพ์ผิดจากอังกฤษเป็นไทย",
        },
        { name: "/help", value: "แสดงรายการคำสั่งของบอท" },
      );
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);
