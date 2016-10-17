module.exports = {
  Webhook: (data) => {
    let { card, list } = data.data;
    return {
      attachments: [{
        color: "good",
        title: `Created card \`${card.name}\` in _${list.name}_`,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board, card, list } = data.data;
    let actor = data.memberCreator;
    channel.sendMessage([
      `**${board.name}**: **${actor.fullName}** created card \`${card.name}\` in _${list.name}_`,
    ]);
  },
};
