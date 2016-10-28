module.exports = {
  Webhook: (data) => {
    let { checkItem, checklist } = data.data;
    let newStateText = checkItem.state === "complete" ? `Completed item \`${checkItem.name}\`` : `Marked item \`${checkItem.name}\` incomplete`;
    return {
      attachments: [{
        color: "good",
        title: `${newStateText} in checklist \`${checklist.name}\``,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board, checkItem, checklist } = data.data;
    let actor = data.memberCreator;
    let newStateText = checkItem.state === "complete" ? `Completed item \`${checkItem.name}\`` : `Marked item \`${checkItem.name}\` incomplete`;
    channel.sendMessage([
      `**${board.name}**: **${actor.fullName}** ${newStateText} in checklist \`${checklist.name}\``,
    ]);
  },
};
