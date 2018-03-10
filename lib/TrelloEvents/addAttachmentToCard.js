module.exports = {
  Webhook: (data) => {
    let { attachment, card } = data.data;
    return {
      attachments: [{
        fallback: `Added attachment ${attachment.url} to card ${card.name}`,
        color: "good",
        title: `Added attachment to card \`${card.name}\``,
        pretext: `[${attachment.name}](${attachment.url})`,
        image_url: attachment.url,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board, attachment, card } = data.data;
    let actor = data.memberCreator;
    channel.send([
      `**${board.name}**: **${actor.fullName}** added attachment ${attachment.url} to card **${card.name}**`,
    ]);
  },
};
