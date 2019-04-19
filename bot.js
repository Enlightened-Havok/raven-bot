const config = require("./config.json");
const Discord = require("discord.js");
const locations = require("./ravenlocation.json");
const flavor = require("./ravenflavor.json");
const ravenMessagesPath = `./messages.json`;
var length = 0;

const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () => {
    console.log(`${bot.user.username} is properly functioning right now.`)
    bot.user.setActivity("with whatever you gave it for lunch");

});

bot.on("message", async message => {
 
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;


/*
    //splices the command into parts. first splits off the prefix, then splits on spaces and between quotations.
    const args = message.content.slice(prefix.length).match(/\w+|"[^"]+"/g);
    //takes the command from the first element of the args.
    const command = args.shift().toLowerCase();

    consider using this code for getting the command from the code. 
    then you only need to use args[0] for the first input after the command. It's what I use in my code and it makes life easy.

    to check if something is a number or not you can do if (isNaN(args[0])) {stuff}; Ohhh I see what you're doing with typeof. it's a good way of doing it :)
*/



    let prefix = config.prefix;
    let args = message.content.slice(prefix.length).match(/\w+|"[^"]+"/g);
    let cmd = args.shift().toLowerCase();
    let arg1 = typeof args[0];
    let arg2 = typeof args[1];
    let arg3 = typeof args[2];
    let channel = message.mentions.channels.first();
    let sendChannel = message.channel;
    let reciever = message.mentions.members.first();
    let note = args[3];

    let rawData = fs.readFileSync(ravenMessagesPath, 'utf8');
    const ravenMessages = JSON.parse(rawData);
    
    if(cmd === `${prefix}send`){
        
        if(arg1 != "number"){
            return message.channel.send("The raven squawks indignantly at your incorrect syntax. Please format as .send <destination> <reciever> <message>");
        }else if(arg2 != "number"){
            return message.channel.send("The raven squawks indignantly at your incorrect syntax. Please format as .send <destination> <reciever> <message>");
        }else if(arg3 != "string"){
            return message.channel.send("The raven squawks indignantly at your incorrect syntax. Please format as .send <destination> <reciever> <message>");

        }else if (channel == null){
            return message.channel.send("The raven squawks indignantly at your incorrect syntax. Please format as .send <destination> <reciever> <message>"); 
        }else if(!locations.hasOwnProperty(sendChannel.id)) {
            return message.channel.send("You cannot send a raven from this channel. Go to a raven's nest.");
        }else{
            //<math code that says how long it takes
            //wait this long code
            //bot.channels.get(channel).send(random string from ravenflavor.js);
            if (locations.hasOwnProperty(channel.id) && locations[channel.id].plane == locations[sendChannel.id].plane){
                //this is the distance formula. sqareroot((x2-x1)^2 + (y2-y1)^2)
                let distance = Math.sqrt(Math.pow((locations[sendChannel.id].x - locations[channel.id].x), 2) + Math.pow((locations[sendChannel.id].y - locations[channel.id].y), 2));
                
                //get the time in hours, modified by time mult. distance is measured in miles, speed is in mph. The second part of the equation accounts for rest periods. 
                //The bird has a max distance it can fly before it has to take 8 hours to rest. every time it hits its max, it must rest. 
                //timemult reduces the time it takes for the raven to arrive. Forcing it to take the entire realistic time is ridiculous. 
                //timediv = 60 will change the hours to minutes, in hour notation. for instance if the bird would take 1 hour to reach its objective, it will now take 0.0166 hours, which is equivalent to 1 minute. If it takes too long, this number can be increased further.
                let time = (distance / config.birdspeed + (Math.floor(config.maxrange / distance) * config.resttime)) / config.timediv;
                
                //convert hours to milliseconds... with random deviation in minutes added in. 
                //randdeviation = 5 will make the bird arrive with a random number between plus or minus 5 minutes.
                let timems = (time * 60 + (Math.random() * config.randdeviation * 2 - config.randdeviation)) * 60 * 1000
                sendChannel.send(`${message.member.displayName} sends a message by raven.`);
                message.delete();
                
                //Chances the bird is eaten, lost, or never makes it for an unknown reason.
                //lostchance = 0.005 will give it a 0.5% chance of being lost.
                if (Math.random() < config.lostchance) return;
                
                //sets the time it takes for the promise to resolve.
                let promise = new Promise((resolve, reject) => {
                    setTimeout(function() {
                        resolve (`A raven has arrived bearing a message.`);
                    }, Math.max(timems, 0)); 
                });
                let result  = await promise;
                // i have to go to sleep right now, but right here is where you would put the code that adds the note to the other notes. 
                /*

                
                let data = JSON.stringify(ravenMessages, null, 2);  
                fs.writeFileSync(ravenMessagesPath, data);  
                */
                return channel.send(result); 
            } else {
                return message.channel.send("The raven squawks indignantly. It does not know the location you're trying to send it to.");
            }
        } 
        
    }
    if(cmd === `${prefix}openraven`){
        
    }
    


    

})

/*
function getChannelFromMention(mention) {

    const matches = mention.match(/^<#!?(\d+)>$/);
    
    const id = matches[1];
    
    console.log(message.mentions.channels.get(id));

	return message.mentions.channels.get(id);
	
}
*/
bot.login(config.token);