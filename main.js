const { Player } = require('discord-player');
const { Client, Intents, Collection } = require('discord.js');
const { readdirSync } = require('fs');

let client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

client.config = require('./config');
client.player = new Player(client, client.config.opt.discordPlayer);
client.commands = new Collection();
const player = client.player

const events = readdirSync('./events/').filter(file => file.endsWith('.js'));
for (const file of events) {
    const event = require(`./events/${file}`);
    console.log(`-> Event Yüklendi ${file.split('.')[0]}`);
    client.on(file.split('.')[0], event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
};
console.log(`-> Komutlar Yükleniyor`);
readdirSync('./commands/').forEach(dirs => {
    const commands = readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));
    for (const file of commands) {
        const command = require(`./commands/${dirs}/${file}`);
        console.log(`${command.name.toLowerCase()} Komut Yüklendi!`);
        client.commands.set(command.name.toLowerCase(), command);
        delete require.cache[require.resolve(`./commands/${dirs}/${file}`)];
    };
});


player.on('trackStart', (queue, track) => {
    if (!client.config.opt.loopMessage && queue.repeatMode !== 0) return;
    queue.metadata.send({ content: `🎵 Şarkı Çalmaya Bşaldı: **${track.title}** -> Kanal: **${queue.connection.channel.name}** 🎧` });
});

player.on('trackAdd', (queue, track) => {
    queue.metadata.send({ content: `**${track.title}** Şarkı Çalma Listesine Eklendi ✅` });
});

player.on('botDisconnect', (queue) => {
    queue.metadata.send({ content: 'Bağlandığım ses kanalından biri beni kovdu, tüm oynatma listesi temizlendi!    ❌' });
});

player.on('channelEmpty', (queue) => {
    queue.metadata.send({ content: 'Ses kanalımda kimse olmadığı için ses kanalından ayrıldım    . ❌' });
});

player.on('queueEnd', (queue) => {
    queue.metadata.send({ content: 'Tüm çalma sırası bitti, sanırım biraz daha müzik dinleyebilirsin.    ✅' });
});



if(client.process.env.TOKEN){
client.login(client.process.env.TOKEN).catch(e => {
console.log("The Bot Token You Entered Into Your Project Is Incorrect Or Your Bot's INTENTS Are OFF!")
})
} else {
console.log("Please Write Your Bot Token Opposite The Token In The config.js File In Your Project!")
}