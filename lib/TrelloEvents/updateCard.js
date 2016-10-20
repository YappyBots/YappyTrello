module.exports = {
  Webhook: (data) => {
    let { card, old } = data.data;
    let changed = Object.keys(old)[0];
    let change = {
      new: card[changed],
      old: old[changed],
    };
    return {
      attachments: [{
        color: "good",
        title: `Updated card \`${changed === "name" ? change.old : card.name}\``,
        pretext: `Changed \`${changed}\` to \`${change.new.slice ? change.new.slice(0, 200) : change.new}\``,
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
      `**${board.name}**: **${actor.fullName}** changed \`${change}\` of card **${card.name}** to \`${change.old.slice(0, 100)}\``,
    ]);
  },
};
