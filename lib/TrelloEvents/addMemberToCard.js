module.exports = {
  Webhook: (data) => {
    let { card } = data.data;
    let member = data.member;
    return {
      attachments: [{
        color: "good",
        title: `Added member to card \`${card.name}\``,
        pretext: `Added **[${member.username}](https://trello.com/${member.username})**`,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board, card } = data.data;
    let member = data.member;
    let actor = data.memberCreator;
    channel.sendMessage([
      `**${board.name}**: **${actor.fullName}** added ${member.username} to \`${card.name}\``,
    ]);
  },
};
