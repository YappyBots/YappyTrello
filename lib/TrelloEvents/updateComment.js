module.exports = {
  Webhook: (data) => {
    let { card, old, action } = data.data;
    let changed = Object.keys(old)[0];
    let text;
    let change = {
      old: old[changed],
      new: action[changed],
    };

    if (changed === "text") {
      text = change.new.slice(0, 400);
    }

    return {
      attachments: [{
        color: "good",
        title: `Updated the ${changed} of a comment in card \`${card.name}\``,
        pretext: text || `Changed ${changed} to \`${change.new.slice ? change.new.slice(0, 200) : change.new}\``,
      }],
    };
  },
  Channel: (channel, data) => {
    let { board, card, old, action } = data.data;
    let actor = data.memberCreator;
    let changed = Object.keys(old)[0];
    let change = {
      new: action[changed],
      old: old[changed],
    };
    channel.sendMessage([
      `**${board.name}**: **${actor.fullName}** changed \`${change}\` of a comment in card **${card.name}** to \`${change.new.slice(0, 100)}\``,
    ]);
  },
};
