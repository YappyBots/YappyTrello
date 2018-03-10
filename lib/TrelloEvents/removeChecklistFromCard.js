module.exports = {
  Webhook: (data) => {
    let { card, checklist } = data.data;
    return {
      attachments: [{
        color: "good",
        title: `Removed checklist \`${checklist.name}\` from card \`${card.name}\``,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board, card, checklist } = data.data;
    let actor = data.memberCreator;
    channel.send([
      `**${board.name}**: **${actor.fullName}** removed checklist \`${checklist.name}\` from card **${card.name}**`,
    ]);
  },
};
