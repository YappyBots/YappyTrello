module.exports = {
  Webhook: (data) => {
    let { card } = data.data;
    let member = data.member;
    return {
      attachments: [{
        color: "good",
        title: `Removed member from card \`${card.name}\``,
        pretext: `Removed **[${member.username}](https://trello.com/${member.username})**`,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board, card } = data.data;
    let member = data.member;
    let actor = data.memberCreator;
    channel.send([
      `**${board.name}**: **${actor.fullName}** removed ${member.username} from \`${card.name}\``,
    ]);
  },
};
