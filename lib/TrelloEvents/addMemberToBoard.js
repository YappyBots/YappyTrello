module.exports = {
  Webhook: (data) => {
    let member = data.member;
    return {
      attachments: [{
        color: "good",
        title: `Added member to board`,
        pretext: `Added **[${member.username}](https://trello.com/${member.username})**`,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board } = data.data;
    let member = data.member;
    let actor = data.memberCreator;
    channel.send([
      `**${board.name}**: **${actor.fullName}** added ${member.username} to board`,
    ]);
  },
};
