module.exports = {
  Webhook: (data) => {
    let { checkItem, checklist } = data.data;
    return {
      attachments: [{
        color: "good",
        title: `Deleted check item \`${checkItem.name}\` (${checkItem.state}) from checklist \`${checklist.name}\``,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board, checkItem, checklist } = data.data;
    let actor = data.memberCreator;
    channel.sendMessage([
      `**${board.name}**: **${actor.fullName}** deleted check item \`${checkItem.name}\` from checklist _${checklist.name}_`,
    ]);
  },
};
