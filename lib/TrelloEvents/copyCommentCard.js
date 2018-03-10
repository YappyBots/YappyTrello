module.exports = {
  Webhook: (data) => {
    let { card, cardSource } = data.data;
    return {
      attachments: [{
        color: "good",
        title: `Copied comment from card \`${cardSource.name}\` to card \`${card.name}\``,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board, card, cardSource } = data.data;
    let actor = data.memberCreator;
    channel.send([
      `**${board.name}**: **${actor.fullName}** copied comment from card \`${cardSource.name}\` to card \`${card.name}\``,
    ]);
  },
};
