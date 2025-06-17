import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  Events,
} from "discord.js";
import "dotenv/config";

// แผนที่การกดแป้นพิมพ์แบบ QWERTY -> แป้นพิมพ์ไทย
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

// สมัครคำสั่งใหม่แบบมี string option
const command = new SlashCommandBuilder()
  .setName("translate")
  .setDescription("แปลข้อความที่พิมพ์ผิดจากภาษาอังกฤษเป็นภาษาไทย")
  .addStringOption((option) =>
    option
      .setName("ข้อความ")
      .setDescription("ข้อความที่ต้องการแปลง")
      .setRequired(true),
  );

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

console.log("⏳ เริ่มลงทะเบียนคำสั่ง...");
await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
  body: [command.toJSON()],
});
console.log("✅ ลงทะเบียนคำสั่งเสร็จเรียบร้อย");

// เริ่มบอท
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  client.user.setPresence({
    activities: [
      {
        name: "vjkow,jvvd5k,z,wfh~",
        type: 0, // 0 = Playing, 1 = Streaming, 2 = Listening, 3 = Watching, 5 = Competing
      },
    ],
    status: "online", // online, idle, dnd, invisible
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "translate") {
    // ดึงข้อความจาก option "ข้อความ"
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
  }
});

client.login(process.env.DISCORD_TOKEN);
