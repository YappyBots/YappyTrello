module.exports = {
  Webhook: (data) => {
    let member = data.member;
    return {
      attachments: [{
        color: "good",
        title: `Add Admin To Board`,
        pretext: `Made **[${member.username}](https://trello.com/${member.username})** admin`,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board } = data.data;
    let member = data.member;
    let actor = data.memberCreator;
    channel.sendMessage([
      `**${board.name}**: **${actor.fullName}** made ${member.username} admin of the board`,
    ]);
  },
};
