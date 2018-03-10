module.exports = {
  Webhook: (data) => {
    let member = data.member;
    return {
      attachments: [{
        color: "good",
        title: `Removed Admin From Board`,
        pretext: `Made **[${member.username}](https://trello.com/${member.username})** normal`,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board } = data.data;
    let member = data.member;
    let actor = data.memberCreator;
    channel.send([
      `**${board.name}**: **${actor.fullName}** made ${member.username} normal in the board`,
    ]);
  },
};
