module.exports = {
  Webhook: (data) => {
    let { card, listAfter, old } = data.data;
    let changed = Object.keys(old)[0];
    let change = {
      new: card[changed],
      old: old[changed],
    };
    let text;
    if (changed === "idList") {
      changed = "list";
      change.new = listAfter.name;
      text = `Moved to list \`${change.new}\``;
    } else if (changed === "closed") {
      changed = "status";
      change.new = change.new ? "Closed" : "Opened";
      text = `${change.new} card`;
    } else if (changed === "name") {
      text = `Renamed to \`${card.name}\` from \`${change.old}\``;
    } else if (changed === "desc") {
      changed = `description`;
    }
    return {
      attachments: [{
        color: "good",
        title: `Updated card \`${changed === "name" ? change.old : card.name}\``,
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
    channel.send([
      `**${board.name}**: **${actor.fullName}** changed \`${change}\` of card **${card.name}** to \`${change.new.slice(0, 100)}\``,
    ]);
  },
};
