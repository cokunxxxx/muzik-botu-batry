module.exports = {
    name: 'skip',
    aliases: [],
    utilisation: '{prefix}skip',
    voiceChannel: true,

    execute(client, message) {
        const queue = client.player.getQueue(message.guild.id);
 
        if (!queue || !queue.playing) return message.channel.send({ content: `${message.author}, Şu anda çalan müzik yok!.        . ❌` });

        const success = queue.skip();

        return message.channel.send({ content: success ? `**${queue.current.title}**, Şarkı Geçildi ✅` : `${message.author}, Beklenmedik Bir Hata Oluştu Tekrar Deneyin Olmasa Kurucuya Beilitrtin ❌` });
    },
};
