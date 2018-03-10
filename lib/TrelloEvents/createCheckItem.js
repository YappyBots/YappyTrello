module.exports = {
  Webhook: (data) => {
    let { checkItem, checklist } = data.data;
    return {
      attachments: [{
        color: "good",
        title: `Added check item \`${checkItem.name}\` (${checkItem.state}) to checklist \`${checklist.name}\``,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board, checkItem, checklist } = data.data;
    let actor = data.memberCreator;
    channel.send([
      `**${board.name}**: **${actor.fullName}** added check item \`${checkItem.name}\` to checklist _${checklist.name}_`,
    ]);
  },
};
