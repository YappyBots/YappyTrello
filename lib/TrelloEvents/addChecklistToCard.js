module.exports = {
  Webhook: (data) => {
    let { card, checklist } = data.data;
    return {
      attachments: [{
        color: "good",
        title: `Added checklist \`${checklist.name}\` to card \`${card.name}\``,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board, card, checklist } = data.data;
    let actor = data.memberCreator;
    channel.sendMessage([
      `**${board.name}**: **${actor.fullName}** added checklist \`${checklist.name}\` to card **${card.name}**`,
    ]);
  },
};
