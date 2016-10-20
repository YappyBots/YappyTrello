module.exports = {
  Webhook: (data) => {
    let { list } = data.data;
    return {
      attachments: [{
        color: "good",
        title: `Deleted a card from \`${list.name}\``,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board, list } = data.data;
    let actor = data.memberCreator;
    channel.sendMessage([
      `**${board.name}**: **${actor.fullName}** deleted a card from _${list.name}_`,
    ]);
  },
};
