module.exports = {
  Webhook: (data) => {
    let { card } = data.data;
    return {
      attachments: [{
        color: "good",
        title: `Deleted a comment from card \`${card.name}\``,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board, card, list } = data.data;
    let actor = data.memberCreator;
    channel.send([
      `**${board.name}**: **${actor.fullName}** deleted a comment from card \`${card.name}\` in _${list.name}_`,
    ]);
  },
};
