module.exports = {
  Webhook: (data) => {
    let { board, old } = data.data;
    let changed = Object.keys(old)[0];
    let change = {
      new: board[changed],
      old: old[changed],
    };
    let text;
    if (changed === "name") {
      text = `Renamed to \`${board.name}\` from \`${change.old}\``;
    }
    return {
      attachments: [{
        color: "good",
        title: `Updated board`,
        pretext: text || `Changed ${changed} to \`${change.new.slice ? change.new.slice(0, 200) : change.new}\``,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board, card, old } = data.data;
    let changed = Object.keys(old)[0];
    let change = {
      new: card[changed],
      old: old[changed],
    };
    let actor = data.memberCreator;
    channel.sendMessage([
      `**${board.name}**: **${actor.fullName}** changed \`${change}\` of the board to \`${change.old.slice(0, 100)}\``,
    ]);
  },
};
