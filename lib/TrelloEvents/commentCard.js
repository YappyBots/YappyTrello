module.exports = {
  Webhook: (data) => {
    let { card, list, text } = data.data;
    let commentShort = text.slice(0, 250);
    let commentDots = text.length > 250 ? "..." : "";
    return {
      attachments: [{
        color: "good",
        title: `Commented on card \`${card.name}\` in _${list.name}_`,
        pretext: `${commentShort}${commentDots}`,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board, card, list } = data.data;
    let actor = data.memberCreator;
    channel.sendMessage([
      `**${board.name}**: **${actor.fullName}** commented on card \`${card.name}\` in _${list.name}_`,
    ]);
  },
};
