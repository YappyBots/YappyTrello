module.exports = {
  Webhook: (data) => {
    let { card, cardSource, list } = data.data;
    return {
      attachments: [{
        color: "good",
        title: `Copied card \`${cardSource.name}\` to _${list.name}_ with name \`${card.name}\``,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board, card, cardSource, list } = data.data;
    let actor = data.memberCreator;
    channel.send([
      `**${board.name}**: **${actor.fullName}** copied card \`${cardSource.name}\` to _${list.name}_ with name \`${card.name}\``,
    ]);
  },
};
