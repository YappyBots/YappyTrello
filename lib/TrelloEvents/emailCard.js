module.exports = {
  Webhook: (data) => {
    let { card, list } = data.data;
    return {
      attachments: [{
        color: "good",
        title: `Emailed card to list \`${list.name}\` with name \`${card.name}\``,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board, card, list } = data.data;
    let actor = data.memberCreator;
    channel.send([
      `**${board.name}**: **${actor.fullName}** emailed card \`${card.name}\` to _${list.name}_`,
    ]);
  },
};
