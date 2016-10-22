module.exports = {
  Webhook: (data) => {
    let { attachment, card } = data.data;
    return {
      attachments: [{
        fallback: `Deleted attachment ${attachment.name} from card ${card.name}`,
        color: "good",
        title: `Deleted attachment ${attachment.name} from card \`${card.name}\``,
        image_url: attachment.url,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board, attachment, card } = data.data;
    let actor = data.memberCreator;
    channel.sendMessage([
      `**${board.name}**: **${actor.fullName}** deleted attachment ${attachment.name} from card **${card.name}**`,
    ]);
  },
};
