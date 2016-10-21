module.exports = {
  Webhook: (data) => {
    let member = data.member;
    return {
      attachments: [{
        color: "good",
        title: `Removed member to board`,
        pretext: `Removed **[${member.username}](https://trello.com/${member.username})**`,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board } = data.data;
    let member = data.member;
    let actor = data.memberCreator;
    channel.sendMessage([
      `**${board.name}**: **${actor.fullName}** removed ${member.username} from board`,
    ]);
  },
};
