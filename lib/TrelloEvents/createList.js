module.exports = {
  Webhook: (data) => {
    let { list } = data.data;
    return {
      attachments: [{
        color: "good",
        title: `Created list \`${list.name}\``,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board, list } = data.data;
    let actor = data.memberCreator;
    channel.send([
      `**${board.name}**: **${actor.fullName}** created list \`${list.name}\``,
    ]);
  },
};
