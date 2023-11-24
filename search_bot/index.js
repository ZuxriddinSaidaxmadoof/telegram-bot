const {Telegraf, Markup} = require("telegraf");
const { getJson } = require("serpapi");
require("dotenv").config();

// console.log(process.env.API_KEY)
// console.log(process.env.BOT_TOKEN)

const API_KEY = process.env.API_KEY;
const bot = new Telegraf(process.env.BOT_TOKEN);

const exemplButton = Markup.inlineKeyboard([
    Markup.button.callback("Lion", "lion"),
    Markup.button.callback("Apple", "apple")

]) 

let data = [{}]
 async function getData (search){
    try{
        console.log("run");
        await getJson({
          engine: "google",
          api_key: API_KEY, // Get your API_KEY from https://serpapi.com/manage-api-key
          q: search,
          location: "Austin, Texas",
        },async (json) => {
             data = await json["organic_results"];
        });
    }catch(error){
        console.log(error);
    }
}
bot.start(ctx => {
    ctx.reply(`Hi ${ctx.chat.first_name} 👋,
What do you want to search today, for example:`, exemplButton)
})


// actions //
let img = "";
let options = [{}];
async function getRandomImg(name){
    await getData(name)
     const random = await Math.floor(Math.random(10) * 10);
    if(!data[random].thumbnail){
        // await getRandomImg(name);
        img = ""
        options = [{}]

    }else{
        console.log(await data[random].thumbnail);
        img = await data[random].thumbnail;
        options = await data[random];
    }
}

bot.action("lion", async(ctx) => {
    await getRandomImg("lion");
    await ctx.sendPhoto(img);
    const massage = ctx.callbackQuery.message;
    ctx.telegram.editMessageText(massage.chat.id, massage.message_id, null, "what do you want to see, please type it", null)
})
bot.action("apple", async ctx => {
    await getRandomImg("apple");
    await ctx.sendPhoto(img);
    const massage = ctx.callbackQuery.message;
    ctx.telegram.editMessageText(massage.chat.id, massage.message_id, null, "what do you want to see, please type it", null)
})
bot.hears(/.*/, async(ctx) => {
    console.log(ctx.message.text)
    await getRandomImg(ctx.message.text);
    if(!img){
        ctx.reply("image not found, please try again")
        options.link ? 
        ctx.reply(`but you can reed more about the picture 🖼 
${options.link}`)
        : null
    }else{
        await ctx.sendPhoto(img);
        options.link ? 
        ctx.reply(`you can reed more about the picture 🖼 
${options.link}`)
        : null
        console.log(options);
        console.log(options.sitelinks);
        
    }
})

bot.launch();