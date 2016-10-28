module.exports = {
  Webhook: (data) => {
    let { old, checklist } = data.data;
    let oldName = old.name;
    let newName = checklist.name;
    return {
      attachments: [{
        color: "good",
        title: `Renamed checklist \`${oldName}\` to \`${newName}\``,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board, old, checklist } = data.data;
    let actor = data.memberCreator;
    let oldName = old.name;
    let newName = checklist.name;
    channel.sendMessage([
      `**${board.name}**: **${actor.fullName}** renamed checklist \`${oldName}\` to \`${newName}\``,
    ]);
  },
};
