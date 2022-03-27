module.exports = async (client) => {
    console.log(`${client.user.username} Adlı Bot Giriş Yaptı!`);

    client.user.setActivity(client.config.playing);
};